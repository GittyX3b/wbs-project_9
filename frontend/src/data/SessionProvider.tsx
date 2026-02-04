import { type ReactNode, createContext, useReducer } from 'react';

import type { LocationFormActionType, LocationFormType, SessionContextType } from '@types';

const SessionCtx = createContext<SessionContextType | undefined>(undefined);

const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [locationform, dispatchLocationForm] = useReducer(LocationFormReducer, {
    pending: false,
    data: {
      address: {
        street: null,
        house: null,
        city: null,
        postalcode: null,
      },
      coordinates: {
        latitude: null,
        longitude: null,
      },
    },
    input: 'address',
  });

  return (
    <SessionCtx.Provider value={{ locationform, dispatchLocationForm }}>
      {children}
    </SessionCtx.Provider>
  );
};

export { SessionCtx, SessionProvider };

function LocationFormReducer(
  locationform: LocationFormType,
  action: LocationFormActionType,
): LocationFormType {
  const { type } = action;

  switch (type) {
    case 'pendingTrue': {
      return { ...locationform, pending: true };
      break;
    }
    case 'pendingFalse': {
      return { ...locationform, pending: false };
      break;
    }
    case 'inputAddress': {
      return { ...locationform, input: 'address' };
      break;
    }
    case 'inputCoordinates': {
      return { ...locationform, input: 'coordinates' };
      break;
    }
    default:
      return locationform;
  }
}
