import type { ErrorFields, LocationFormInputsType } from '@/types';

export function validate(inputs: LocationFormInputsType, mask: 'address' | 'coordinates') {
  const errors: ErrorFields = {
    address: { street: '', house: '', city: '', postcode: '' },
    coordinates: { longitude: '', latitude: '' },
  };

  if (mask === 'address') {
    const { street, house, city, postcode } = inputs;

    if (!street?.trim()) errors.address.street = 'Die Strasse darf nicht leer sein.';

    if (!house?.trim()) errors.address.house = 'Die Hausnummer darf nicht leer sein.';

    if (!city?.trim()) errors.address.city = 'Die Stadt darf nicht leer sein.';

    if (!postcode?.trim()) {
      errors.address.postcode = 'Die Postleitzahl darf nicht leer sein.';
    } else if (!/^\d{5}$/.test(postcode)) {
      // Simple regex for 5-digit German postal codes
      errors.address.postcode = 'Bitte geben Sie eine gültige 5-stellige PLZ ein.';
    }
  } else if (mask === 'coordinates') {
    const { latitude, longitude } = inputs;
    if (latitude === null) errors.coordinates.latitude = 'Latitude darf nicht leer sein.';
    else if (isNaN(Number(latitude)) || latitude < 47.27 || latitude > 55.06)
      // Germany's approximate latitude range
      errors.coordinates.latitude =
        'Bitte geben Sie einen Breitengrad zwischen 47.27 und 55.06 ein.';
    if (longitude === null) errors.coordinates.longitude = 'Longitude darf nicht leer sein.';
    else if (Number.isNaN(longitude) || longitude < 5.87 || longitude > 15.04)
      // Germany's approximate longitude range
      errors.coordinates.longitude =
        'Bitte geben Sie einen Längengrad zwischen 5.87 und 15.04 ein.';
  }
  return errors;
}
