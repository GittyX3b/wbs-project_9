import { GoLocation, GoSearch } from 'react-icons/go';

import { App_Logo } from '@/components/elements';

export const Home = () => {
  return (
    <>
      <title>MapTold - Home</title>
      <main className=''>
        {/* HERO SECTION ============== */}
        <div id='Hero' className='hero bg-base-200 hero-bg-image min-h-screen'>
          <div className='hero-content h-full pt-10 pb-20 text-center'>
            <div className='flex h-[80%] max-w-md flex-col items-center justify-between'>
              <App_Logo className='w-[40%]'></App_Logo>
              <h1 className='px-6 text-5xl font-bold'>Dein virtueller Aussichtsturm</h1>
              <p className='px-10 py-8 italic'>
                Gib einen geografischen Punkt an und erhalte relevante Informationen zu seiner
                Umgebung, serviert von unserer Standort-KI.
              </p>
              <button className='btn btn-primary'>
                <GoLocation />
                Aktuellen Standort zeigen
              </button>
            </div>
          </div>
        </div>

        {/* FORM SECTION ============== */}
        <div id='Location-Form' className='bg-mt-color-1 flex flex-col justify-center p-10'>
          <h2>Zielort eingeben:</h2>
          <form className='location-form-grid'>
            <input type='text' className='input' placeholder='Strasse' />
            <div className='grid grid-cols-[30%_1fr] gap-2'>
              <input type='text' className='input' placeholder='PLZ' />
              <input type='text' className='input' placeholder='Stadt' />
            </div>
            <div className='grid grid-cols-2 gap-2 pt-2'>
              <input type='number' className='input' placeholder='Longitude' />
              <input type='number' className='input' placeholder='Latitude' />
            </div>

            <button className='btn btn-secondary m-auto mt-4 w-30' type='button'>
              <GoSearch />
              Suchen
            </button>
          </form>
        </div>
      </main>
    </>
  );
};
