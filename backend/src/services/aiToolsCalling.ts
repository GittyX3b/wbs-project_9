import { getPois } from '#utils';
import { fetchOsmData, fetchElevation, openMeteo, buildPoisQuery } from '#services';
import { GoogleGenAI, Type } from '@google/genai';
import type { Content } from '@google/genai';
import type { RequestHandler } from 'express';
import type { aiToolsIncomingPrompt, BBox } from '#types';
import { Zone } from '#models';

// Configure the client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

// Define the function declaration for the model
const weatherFunctionDeclaration = {
  name: 'WeatherInfo',
  description: 'Get current weather at this place and the weather for the next six days.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      weather: {
        type: Type.STRING,
        description: 'The current weather and the weather for the next six days.'
      },
      place: {
        type: Type.STRING,
        description: 'The place where the weather forecast is asked for .'
      },
      date: {
        type: Type.STRING,
        description:
          'The date for the weather forecast. Format: YYYY-MM-DD. If not provided, the current weather will be returned .'
      },
      time: {
        type: Type.STRING,
        description:
          'now or specific time for the next six days. Format: HH:MM. If not provided, the current weather will be returned .'
      }
    },
    required: ['weather']
  }
};

const osmFunctionDeclaration = {
  name: 'OsmInfo',
  description: 'Get Open Street Map data like buildings, Green Areas and Water for a place.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      place: {
        type: Type.STRING,
        description: 'The place where Open Street Map data is asked for.'
      },
      buildings: {
        type: Type.STRING,
        description: 'How many buildings are in this area.'
      },
      green: {
        type: Type.STRING,
        description: 'How many Green places are in this area .'
      },
      water: {
        type: Type.STRING,
        description: 'How much is the Water resources are in this area .'
      }
    }
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
      },
      elevation: {
        type: Type.STRING,
        description: 'The elevation of the place in meters.'
      }
    },
    required: ['elevation']
  }
};

// Generation config with function declaration
const config = {
  tools: [
    {
      functionDeclarations: [osmFunctionDeclaration, elevationFunctionDeclaration, weatherFunctionDeclaration]
    }
  ]
};

export const aiToolsCalling: RequestHandler<any, {}, aiToolsIncomingPrompt> = async (req, res) => {
  // Load DB
  const zone = await Zone.findById(req.params.id);

  // Build prompt with DB data
  const contents: Content[] = [
    {
      role: 'user',
      parts: [
        {
          text: `User Frage: ${req.body.prompt} 
          Zone data aus der Datenbank:${zone ? JSON.stringify(zone.stats) : 'No data'}
          Privous KI Text aus der Datenbank::${zone ? zone.aiText : 'No data'}
          Zone Koordinaten aus der Datenbank::${JSON.stringify(zone?.coordinates, null, 2)}`
        }
      ]
    }
  ];
  //Erkläre die Zonendaten. Wenn du mehr Informationen brauchst, Ruf tools.
  contents.unshift({
    role: 'system',
    parts: [
      {
        text: `
        Du bist sehr freudliche KI-Assistent. 
        
        Rolle:
        - Beantworte die Fragen des Anwenders klar und kurz.
        - Nutze nur die relevanten Daten aus der Datenbank.
        - Vermeide jegliche Markdown-Formatierung, keine Sternchen.
        
        Spezialfall GIS-Daten:
        - Wenn die Frage sich auf Gebäude, Supermärkte, Gewässer, Grünflächen oder Infrastruktur bezieht, 
          beantworte nur die konkrete Frage.
        - Lasse unnötige Details wie Koordinaten, Höhe, Wetter oder allgemeine Statistiken weg, 
          wenn der Nutzer nicht danach fragt.
        - Rufe Tools nur auf, wenn Daten fehlen.
        - Gib die Antwort in leicht verständlicher Sprache, ggf. als kurze Liste oder Satz.`
      }
    ]
  });
  try {
    // Send request with function declarations
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      //'gemini-2.5-flash-lite-preview-09-2025',
      //'gemini-2.5-flash',
      contents: contents,
      config: config
    });

    if (!response) throw new Error('No response from Google GenAI');

    //Create a function response part
    const function_response_part = {
      name: 'UnknownFunction', // will be updated later
      response: {}
    };

    // Check for function calls in the response
    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall = response.functionCalls[0] as any; // Assuming one function call
      // console.log(`Function to call: ${functionCall!.name}`);
      // console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
      function_response_part.name = functionCall!.name;

      const lat = zone?.coordinates?.lat || 52.506662; //default to Berlin coordinates;
      const lon = zone?.coordinates?.lon || 13.414172;

      if (functionCall!.name === 'OsmInfo') {
        const bbox = zone?.bbox as BBox;
        const pois = [
          'restaurant',
          'cafe',
          'museum',
          'theatre',
          'bus_stop',
          'supermarket',
          'park',
          'cinema',
          'kindergarten',
          'school',
          'university',
          'hospital',
          'pharmacy',
          'bank',
          'atm',
          'post_office',
          'library'
        ];

        const osmData = await fetchOsmData(buildPoisQuery(bbox, pois));
        const poisData = getPois(osmData.elements);
        const stats: Record<string, unknown[]> = {};
        for (const key of Object.keys(poisData)) {
          const features = poisData[key]?.features;
          if (!features || features.length === 0) continue;

          stats[key] = features.map(feature => feature.properties);
        }

        // console.log(`Function execution result: ${JSON.stringify(stats)}`);
        function_response_part.name = functionCall!.name;
        function_response_part.response = { result: stats };
      } else if (functionCall!.name === 'ElevationInfo') {
        const elevation = await fetchElevation(lat, lon);
        // console.log(`Function execution result: ${JSON.stringify(elevation)}`);
        function_response_part.name = functionCall!.name;
        function_response_part.response = { result: elevation };
      } else if (functionCall!.name === 'WeatherInfo') {
        const weatherData = await openMeteo(lat, lon);
        // console.log(`Function execution result: ${JSON.stringify(weatherData)}`);
        function_response_part.name = functionCall!.name;
        function_response_part.response = { result: weatherData };
      }
      if (!response.candidates?.[0]?.content) {
        return res.status(500).json({ error: 'No candidates in Gemini response' });
      }
      // Append function call and result of the function execution to contents
      contents.push(response.candidates![0].content as any); //push functionCall
      // console.log('response.candidates![0].content:', response.candidates![0].content);
      contents.push({ role: 'user', parts: [{ functionResponse: function_response_part }] });
      // console.log('function_response_part:', function_response_part);
      // console.log('Updated contents with function response:', contents);
      // Get the final response from the model
      const final_response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        //'gemini-2.5-flash',
        contents: contents,
        config: config
      });
      // console.log('Final response from Gemini:', final_response);
      // console.log(final_response.text);
      return res.status(200).json({ response: final_response.text });
    } else {
      // console.log('No function call found in the response.');
      // console.log(response.text);
      return res.status(200).json({ response: response.text });
    }
  } catch (error) {
    throw new Error('Failed to process AI tools calling');
  }
};
