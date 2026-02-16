import React, { useState } from 'react';
import { LuLoader, LuSearch } from 'react-icons/lu';

import { useSession } from '@data';
import type { ErrorFields, LocationFormInputsType } from '@types';
import { scrollToElementID, sleep, validate } from '@utils';

export const LocationForm = () => {
  const { locationform, dispatchLocationForm, dispatchResponseData } = useSession();
  const [errors, setErrors] = useState<ErrorFields>();
  const [error, setError] = useState<string | null>();

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.currentTarget;
    const newValue = value === '' ? null : type === 'number' ? Number(value) : value;
    const newInputs: LocationFormInputsType = {
      ...locationform.inputs,
      [name]: newValue,
    };
    dispatchLocationForm({ type: 'UPDATE_DATA', payload: newInputs });
  };

  const submitAction = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate(locationform.inputs, locationform.mask);
    setErrors(validationErrors);

    const hasAddressErrors = Object.values(validationErrors.address).some((err) => !!err);
    const hasCoordinatesErrors = Object.values(validationErrors.coordinates).some((err) => !!err);

    if (hasAddressErrors || hasCoordinatesErrors) {
      return;
    }

    dispatchLocationForm({ type: 'SET_PENDING', payload: true });

    let coordinates = {};
    if (locationform.mask === 'address') {
      /* Conversion address to coordninates */
      const address = [];
      if (locationform.inputs.street) address.push(locationform.inputs.street);
      if (locationform.inputs.house) address.push(locationform.inputs.house);
      if (locationform.inputs.postcode) address.push(locationform.inputs.postcode);
      if (locationform.inputs.city) address.push(locationform.inputs.city);

      const params = `${address.toString().replace(/[\s,]+/g, '+')}&limit=1`;
      const url = `https://photon.komoot.io/api/?q=${params}`;

      await fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Address conversion error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (
            !data ||
            !Array.isArray(data.features) ||
            data.features.length === 0 ||
            !data.features[0]?.geometry?.coordinates
          ) {
            throw new Error('Error! No coordinates were responded for this address!');
          }
          const [lon, lat] = data.features[0].geometry.coordinates;
          const newFormData = {
            street: locationform.inputs.street,
            house: locationform.inputs.house,
            city: locationform.inputs.city,
            postcode: locationform.inputs.postcode,
            latitude: lat,
            longitude: lon,
          };
          dispatchLocationForm({ type: 'UPDATE_DATA', payload: newFormData });

          coordinates = {
            lat: lat,
            lon: lon,
          };
        })
        .catch((err) => {
          throw new Error('Address conversion failed:', err.message);
        });
    }
    if (locationform.mask === 'coordinates') {
      coordinates = {
        lat: locationform.inputs.latitude,
        lon: locationform.inputs.longitude,
      };
    }

    /* Request to our backend */
    dispatchLocationForm({ type: 'SET_SUCCESS', payload: false });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/geo/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coordinates }),
      });

      if (!response.ok) {
        dispatchLocationForm({ type: 'SET_PENDING', payload: false });

        const errorData = await response.json();
        if (!errorData.error) {
          throw new Error(errorData.message);
        }
        throw new Error(errorData.error);
      }

      const data = await response.json();
      console.log('API response:', data);

      dispatchResponseData({ type: 'SET_DATA', payload: data });
      dispatchLocationForm({ type: 'SET_SUCCESS', payload: true });
      dispatchLocationForm({ type: 'SET_PENDING', payload: false });
      await sleep(100);
      scrollToElementID('Response');
    } catch (err: unknown) {
      dispatchLocationForm({ type: 'SET_PENDING', payload: false });
      const message = (err as { message: string }).message;
      const errorMessages = [
        'Failed to fetch',
        'Failed to fetch OSM data',
        'Failed to fetch elevation data',
        'No content returned from Google GenAI',
        'Failed to generate AI text',
      ];
      if (errorMessages.includes(message)) {
        setError(`⚠️ Etwas ist schiefgelaufen. Bitte versuche es in Kürze erneut.`);
      } else {
        setError(message);
      }

      setTimeout(() => {
        setError(null);
      }, 10000);
    }
  };

  return (
    <section
      id='Location-Form'
      className={`grid lg:grid-cols-2 ${locationform.pending ? 'bg-mt-color-13' : locationform.mask === 'address' ? 'bg-mt-color-4' : 'bg-mt-color-20'}`}
    >
      <div id='Location-Form-Image' className='bg-mt-color-5'>
        <div className='form-beside-image h-full w-full'></div>
      </div>

      <div id='Location-Form-Container' className=''>
        {/* MASK FORM BUTTONS ============================================= */}
        <div id='Location-Form-Control-Buttons' className='mb-5 grid grid-cols-2'>
          <button
            type='button'
            className={`btn btn-location-form-control ${locationform.pending ? 'bg-green-100' : locationform.mask === 'address' ? 'bg-mt-color-4' : 'bg-yellow-100'}`}
            disabled={locationform.pending}
            onClick={() => dispatchLocationForm({ type: 'SET_MASK', payload: 'address' })}
          >
            Adresse
          </button>
          <button
            type='button'
            className={`btn btn-location-form-control ${locationform.pending ? 'bg-green-100' : locationform.mask === 'coordinates' ? 'bg-mt-color-20' : 'bg-purple-100'}`}
            disabled={locationform.pending}
            onClick={() => dispatchLocationForm({ type: 'SET_MASK', payload: 'coordinates' })}
          >
            Koordinaten
          </button>
        </div>

        <div
          id='Location-Form-Centering-Wrapper'
          className='m-auto min-w-fit px-15 pt-10 pb-25 sm:w-3/4 md:w-1/2 lg:w-3/4 xl:w-2/3'
        >
          <h2>
            {locationform.pending ? (
              <span className='text-green-600'>Die Suche läuft...</span>
            ) : locationform.mask === 'address' ? (
              'Ort eingeben:'
            ) : (
              'Punkt eingeben:'
            )}
          </h2>
          {/* START FORM ================================================== */}
          <form onSubmit={submitAction} className='grid gap-2'>
            {/* ADDRESS FORM ============================================== */}
            {locationform.mask === 'address' && (
              <>
                <div className='grid grid-cols-[75%_1fr] gap-2'>
                  <input
                    name='street'
                    type='text'
                    className='input w-full'
                    placeholder='Strasse'
                    // required={locationform.mask === 'address'}
                    disabled={locationform.pending}
                    value={locationform.inputs.street ?? ''}
                    onChange={changeHandler}
                  />
                  <input
                    name='house'
                    type='text'
                    className='input w-full'
                    placeholder='Nr'
                    // required={locationform.mask === 'address'}
                    disabled={locationform.pending}
                    value={locationform.inputs.house ?? ''}
                    onChange={changeHandler}
                  />
                </div>

                <div className='grid grid-cols-[30%_1fr] gap-2'>
                  <input
                    name='postcode'
                    type='text'
                    className='input w-full'
                    placeholder='PLZ'
                    // required={locationform.mask === 'address'}
                    disabled={locationform.pending}
                    value={locationform.inputs.postcode ?? ''}
                    onChange={changeHandler}
                  />
                  <input
                    name='city'
                    type='text'
                    className='input w-full'
                    placeholder='Stadt'
                    // required={locationform.mask === 'address'}
                    disabled={locationform.pending}
                    value={locationform.inputs.city ?? ''}
                    onChange={changeHandler}
                  />
                </div>
                {errors?.address && (
                  <ul className='text-sm text-red-600'>
                    {errors.address.street && <li className='mb-0.5'>{errors.address.street}</li>}
                    {errors.address.house && <li className='mb-0.5'>{errors.address.house}</li>}
                    {errors.address.postcode && (
                      <li className='mb-0.5'>{errors.address.postcode}</li>
                    )}
                    {errors.address.city && <li className='mb-0.5'>{errors.address.city}</li>}
                  </ul>
                )}
              </>
            )}
            {/* COORDINATES FORM ========================================== */}
            {locationform.mask === 'coordinates' && (
              <>
                <div className='grid gap-2'>
                  <input
                    name='longitude'
                    type='number'
                    className='input w-full'
                    placeholder='Längengrad (Longitude)'
                    step={0.0001}
                    // required={locationform.mask === 'coordinates'}
                    disabled={locationform.pending}
                    value={locationform.inputs.longitude ?? ''}
                    onChange={changeHandler}
                  />
                  {errors?.coordinates?.longitude && (
                    <p className='text-sm text-red-600'>{errors.coordinates.longitude} </p>
                  )}
                  <input
                    name='latitude'
                    type='number'
                    className='input w-full'
                    placeholder='Breitengrad (Latitude)'
                    step={0.0001}
                    // required={locationform.mask === 'coordinates'}
                    disabled={locationform.pending}
                    value={locationform.inputs.latitude ?? ''}
                    onChange={changeHandler}
                  />
                  {errors?.coordinates?.latitude && (
                    <p className='text-sm text-red-600'>{errors.coordinates.latitude} </p>
                  )}
                </div>
              </>
            )}

            {/* ERROR MESSAGE ============================================= */}

            {error && <p className='my-2 text-sm text-red-600'>{error} </p>}

            {/* SUBMIT BUTTON ============================================= */}
            <button
              className={`btn btn-secondary m-auto mt-4 w-full text-white ${locationform.pending ? 'bg-mt-color-11 cursor-not-allowed' : 'bg-mt-color-31'}`}
              disabled={locationform.pending}
            >
              {locationform.pending ? (
                <>
                  <LuLoader className='animate-spin' />
                  bitte Geduld...
                </>
              ) : (
                <>
                  <LuSearch />
                  Suchen
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
