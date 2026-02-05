import { LuLoader, LuSearch } from 'react-icons/lu';

import { useSession } from '@data';
import { sleep } from '@utils';

export const LocationForm = () => {
  const { locationform, dispatchLocationForm } = useSession();

  const submitAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /*
    const formData = new FormData(e.currentTarget);

    const street = formData.get('loc-street');
    const house = formData.get('loc-house');
    const postalcode = formData.get('loc-postalcode');
    const city = formData.get('loc-city');
    const longitude = formData.get('loc-longitude');
    const latitude = formData.get('loc-latitude');
    */

    //TODO: @utils/validateInputs

    dispatchLocationForm({ type: 'pendingTrue' });

    await sleep(2000);
    //TODO: send Request

    console.log('Submitted: ');
    dispatchLocationForm({ type: 'pendingFalse' });
  };

  return (
    <section
      id='Location-Form'
      className={`grid lg:grid-cols-2 ${locationform.pending ? 'bg-mt-color-13' : locationform.input === 'address' ? 'bg-mt-color-4' : 'bg-mt-color-20'}`}
    >
      <div id='Location-Form-Image' className='bg-mt-color-5'>
        <div className='form-beside-image h-full w-full'></div>
      </div>

      <div id='Location-Form-Container' className=''>
        <div id='Location-Form-Control-Buttons' className='mb-5 grid grid-cols-2'>
          <button
            type='button'
            className={`btn btn-location-form-control ${locationform.pending ? 'bg-green-100' : locationform.input === 'address' && 'bg-purple-100'}`}
            onClick={() => dispatchLocationForm({ type: 'inputAddress' })}
            disabled={locationform.pending}
          >
            Adresse
          </button>
          <button
            type='button'
            className={`btn btn-location-form-control ${locationform.pending ? 'bg-green-100' : locationform.input === 'coordinates' && 'bg-yellow-100'}`}
            onClick={() => dispatchLocationForm({ type: 'inputCoordinates' })}
            disabled={locationform.pending}
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
            ) : locationform.input === 'address' ? (
              'Ort eingeben:'
            ) : (
              'Punkt eingeben:'
            )}
          </h2>

          <form onSubmit={submitAction} className='grid gap-2'>
            {locationform.input === 'address' && (
              <>
                <div className='grid grid-cols-[75%_1fr] gap-2'>
                  <input
                    name='loc-street'
                    type='text'
                    className='input w-full'
                    placeholder='Strasse'
                    disabled={locationform.pending}
                  />
                  <input
                    name='loc-house'
                    type='text'
                    className='input w-full'
                    placeholder='Nr'
                    disabled={locationform.pending}
                  />
                </div>
                <div className='grid grid-cols-[30%_1fr] gap-2'>
                  <input
                    name='loc-postalcode'
                    type='text'
                    className='input w-full'
                    placeholder='PLZ'
                    disabled={locationform.pending}
                  />
                  <input
                    name='loc-city'
                    type='text'
                    className='input w-full'
                    placeholder='Stadt'
                    disabled={locationform.pending}
                  />
                </div>
              </>
            )}

            {locationform.input === 'coordinates' && (
              <div className='grid gap-2'>
                <input
                  name='loc-longitude'
                  type='number'
                  className='input w-full'
                  placeholder='Längengrad (Longitude)'
                  disabled={locationform.pending}
                />
                <input
                  name='loc-latitude'
                  type='number'
                  className='input w-full'
                  placeholder='Breitengrad (Latitude)'
                  disabled={locationform.pending}
                />
              </div>
            )}

            <div id='Errors-Container' className='min-h-20'></div>

            <button
              className={`btn btn-secondary m-auto mt-2 w-full text-white ${
                locationform.pending ? 'bg-mt-color-11 cursor-not-allowed' : 'bg-mt-color-31'
              }`}
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
