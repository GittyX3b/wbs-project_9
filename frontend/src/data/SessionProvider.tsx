import { type ReactNode, createContext, useReducer } from 'react';

import {
  LocationFormActionSchema,
  type LocationFormActionType,
  type LocationFormType,
  ResponseDataActionSchema,
  type ResponseDataActionType,
  type ResponseDataType,
  type SessionContextType,
} from '@types';

const SessionCtx = createContext<SessionContextType | undefined>(undefined);

const locationFormReducer = (
  state: LocationFormType,
  action: LocationFormActionType,
): LocationFormType => {
  LocationFormActionSchema.parse(action);

  switch (action.type) {
    case 'SET_MASK':
      return { ...state, mask: action.payload };

    case 'UPDATE_DATA':
      return { ...state, inputs: action.payload };

    case 'SET_PENDING':
      return { ...state, pending: action.payload };

    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
  }
};

const responseDataReducer = (
  state: ResponseDataType,
  action: ResponseDataActionType,
): ResponseDataType => {
  ResponseDataActionSchema.parse(action);

  switch (action.type) {
    case 'SET_DATA':
      return action.payload;
  }
};

const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [locationform, dispatchLocationForm] = useReducer(locationFormReducer, {
    mask: 'address',
    inputs: {
      street: null,
      house: null,
      city: null,
      postcode: null,
      latitude: null,
      longitude: null,
    },
    pending: false,
    success: false,
  });

  const [responsedata, dispatchResponseData] = useReducer(responseDataReducer, {
    zoneId: null,
    aiText: null,
    elevation: null,
    layers: {
      buildings: {
        type: null,
        features: [],
      },
      roads: {
        type: null,
        features: [],
      },
      green: {
        type: null,
        features: [],
      },
      water: {
        type: null,
        features: [],
      },
    },
    weather: {
      time: null,
      isDay: null,
      sunshine_next7days: {
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
      },
      temperature: null,
      min_temp_next7days: {
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
      },
      max_temp_next7days: {
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
      },
      humidity: null,
      precipitation: null,
      snowfall: null,
      wind_speed: null,
    },
  });

  return (
    <SessionCtx.Provider
      value={{ locationform, dispatchLocationForm, responsedata, dispatchResponseData }}
    >
      {children}
    </SessionCtx.Provider>
  );
};

export { SessionCtx, SessionProvider };
