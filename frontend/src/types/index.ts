export type SessionContextType = {
  locationform: LocationFormType;
  dispatchLocationForm: React.Dispatch<LocationFormActionType>;
};

export type LocationFormType = {
  pending: boolean;
  data: {
    address: {
      street: string | null;
      house: string | null;
      city: string | null;
      postalcode: string | null;
    };
    coordinates: {
      latitude: number | null;
      longitude: number | null;
    };
  };
  input: 'address' | 'coordinates';
};

export type LocationFormActionType = {
  type: 'pendingTrue' | 'pendingFalse' | 'inputAddress' | 'inputCoordinates';
};
