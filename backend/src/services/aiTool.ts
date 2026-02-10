import type { RequestHandler } from 'express';

import { getBBox, getLayers } from '#utils';
import { fetchOsmData, fetchElevation, openMeteo } from '#services';
import type { aiToolsIncomingPrompt } from '#types';
// src/gemini-sdk-structured.ts
import { GoogleGenAI, Type } from '@google/genai';
import type { Content } from '@google/genai';

import { Zone } from '#models';

import NodeGeocoder from 'node-geocoder';

// Configure the client
const ai = new GoogleGenAI({
  apiKey: 'AIzaSyDeR_V9cH07uVsJ_rTbLJq98BedGw4Kn8k'
  //process.env.GOOGLE_API_KEY
});

// Define the function declaration for the model
const weatherFunctionDeclaration = {
  name: 'WeatherInfo',
  description: 'Get current weather at this place and the weather for the next six days.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      place: {
        type: Type.STRING,
        description: 'The place where the weather is asked for .'
      },
      date: {
        type: Type.STRING,
        description: 'The current date and the next six days.'
      },
      time: {
        type: Type.STRING,
        description: 'the current time '
      }
    },
    required: ['date', 'time', 'place']
  }
};

const osmFunctionDeclaration = {
  name: 'OsmInfo',
  description: 'Get OSM data for a place.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      place: {
        type: Type.STRING,
        description: 'The place where the OSM data is asked for .'
      },
      buildings: {
        type: Type.STRING,
        description: 'How many buildings are in this area .'
      },
      green: {
        type: Type.STRING,
        description: 'How many Green places are in this area  .'
      },
      water: {
        type: Type.STRING,
        description: 'How many Water resources are in this area  .'
      }
    },
    required: ['place']
  }
};

const elevationFunctionDeclaration = {
  name: 'ElevationInfo',
  description: 'Get elevation data for a place.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      place: {
        type: Type.STRING,
        description: 'The place where the elevation data is asked for .'
      }
    },
    required: ['place']
  }
};

// Generation config with function declaration
const config = {
  tools: [
    {
      functionDeclarations: [osmFunctionDeclaration, elevationFunctionDeclaration, weatherFunctionDeclaration]
    }
  ],
  //responseMimeType: 'application/json',
  responseSchema: {
    type: 'object',
    properties: {
      originalPrompt: { type: 'string' },
      generatedResponse: { type: 'string' }
    },
    required: ['originalPrompt', 'generatedResponse']
  }
};

export const geminiSdkStructured: RequestHandler<{}, {}, aiToolsIncomingPrompt> = async (req, res) => {
  // Define user prompt
  const contents: Content[] = [
    {
      role: 'user',
      parts: [{ text: req.body.prompt }]
    }
  ];
  // Send request with function declarations
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-preview-09-2025',
    contents: contents,
    config: config
  });
  // Check for function calls in the response
  if (response.functionCalls && response.functionCalls.length > 0) {
    console.log(`Function call detected in the response: ${response.functionCalls}`);
    const functionCall = response.functionCalls[0] as any; // Assuming one function call
    console.log(`Function to call: ${functionCall!.name}`);
    console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);

    //Create a function response part
    const function_response_part = {
      name: functionCall!.name || 'UnknownFunction',
      response: {}
    };
    //functionCall.args.place in lat und lon umwandeln
    const geocoder = NodeGeocoder({
      provider: 'openstreetmap',
      fetch: (url: any, options: any): Promise<any> => {
        return fetch(url, {
          ...options,
          headers: {
            'User-Agent': 'Map-Told-StudentProject/1.0 (Map-Told@gmail.com)'
          }
        });
      }
    });
    const geo = await geocoder.geocode(functionCall.args.place);
    if (!geo.length) throw new Error('Place not found');
    const lat = geo[0]!.latitude || 52.506662;
    const lon = geo[0]!.longitude || 13.41417;
    console.log(`Geocoded location for ${functionCall.args.place}: lat=${lat}, lon=${lon}`);
    // Check if the zone already exists in the database
    const existingZone = await Zone.findOne({ coordinates: { lat, lon } });
    if (existingZone) {
      console.log('Zone already exists in the database. Using existing data.');
      function_response_part.response = { result: existingZone.stats };
    }

    if (functionCall!.name === 'OsmInfo') {
      const bbox = await getBBox(lat, lon, 0.5);
      const osmData = await fetchOsmData(bbox);
      const { buildings, roads, green, water } = getLayers(osmData);
      const stats = {
        buildingCount: buildings.features.length,
        greenCount: green.features.length,
        roadCount: roads.features.length,
        waterCount: water.features.length
      };
      console.log(`Function execution result: ${JSON.stringify(stats)}`);
      function_response_part.response = { result: stats };
    } else if (functionCall!.name === 'ElevationInfo') {
      const elevation = await fetchElevation(lat, lon);
      console.log(`Function execution result: ${JSON.stringify(elevation)}`);
      function_response_part.response = { result: elevation };
    } else if (functionCall!.name === 'WeatherInfo') {
      const weatherData = await openMeteo(lat, lon);
      console.log(`Function execution result: ${JSON.stringify(weatherData)}`);
      function_response_part.response = { result: weatherData };
    }
    if (!response.candidates?.[0]?.content) {
      return res.status(500).json({ error: 'No candidates in Gemini response' });
    }
    // Append function call and result of the function execution to contents
    contents.push(response.candidates![0].content as any); //push functionCall
    console.log('response.candidates![0].content:', response.candidates![0].content);
    contents.push({ role: 'user', parts: [{ functionResponse: function_response_part }] });
    console.log('Updated contents with function response:', contents);
    // Get the final response from the model
    const final_response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-preview-09-2025',
      contents: contents,
      config: config
    });
    console.log('Final response from Gemini:', final_response);
    console.log(final_response.text);
    return res.status(200).json({ response: final_response.text });
  } else {
    console.log('No function call found in the response.');
    console.log(response.text);
    return res.status(200).json({ response: response.text });
  }
};
