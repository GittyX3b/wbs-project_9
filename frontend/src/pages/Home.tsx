import { GoLocation, GoSearch, GoSun } from 'react-icons/go';

import { App_Logo } from '@/components/elements';
import { LeafletMap } from '@components';

export const Home = () => {
  return (
    <>
      <title>MapTold - Home</title>
      <main className=''>
        {/* HERO SECTION ============== */}
        <div id='Hero' className='hero hero-bg-image h-screen'>
          <div className='hero-content h-full pb-20 text-center lg:mb-40 lg:h-[80%]'>
            <div className='flex h-[85%] max-w-md flex-col items-center justify-between lg:h-full lg:max-w-xl'>
              <App_Logo className='w-[40%]'></App_Logo>
              <h1 className='px-6 font-bold'>Dein virtueller Aussichtsturm</h1>
              <p className='px-10 py-8 italic'>
                Gib einen geografischen Punkt an und erhalte relevante Informationen zu seiner
                Umgebung, serviert von unserer Standort-KI.
              </p>
              <a href='#Location-Form' className='btn btn-primary w-70 lg:w-fit'>
                <GoLocation />
                Zielort eingeben
              </a>
            </div>
          </div>
        </div>

        {/* FORM SECTION =============== */}
        <div id='Location-Form' className='bg-mt-color-4 flex flex-col justify-center lg:flex-row'>
          <div className='bg-mt-color-5 hidden h-150 w-[50%] xl:flex'>
            <div className='form-beside-image h-full w-full'></div>
          </div>
          <form className='location-form-grid p-5 pt-10 pb-25 lg:px-10'>
            <h2>Zielort eingeben:</h2>
            <input type='text' className='input' placeholder='Strasse' />
            <div className='grid grid-cols-[30%_1fr] gap-2'>
              <input type='text' className='input' placeholder='PLZ' />
              <input type='text' className='input' placeholder='Stadt' />
            </div>
            <div className='grid grid-cols-2 gap-2 pt-2'>
              <input type='number' className='input' placeholder='Longitude' />
              <input type='number' className='input' placeholder='Latitude' />
            </div>

            <button className='btn btn-secondary m-auto mt-14 w-full' type='button'>
              <GoSearch />
              Suchen
            </button>
          </form>
        </div>
        {/* NARRATIVE SECTION ========== */}
        <div id='Narratives' className='h-200 md:h-280 lg:h-350'>
          <div id='Narrative-1' className='grid h-1/3 grid-cols-2'>
            <div className='bg-mt-color-20 flex items-center justify-center p-5 text-center'>
              <h3>
                Finde kurzfristig<br></br> interresante Orte
              </h3>
            </div>
            <div className='bg-mt-color-5'>
              <div className='narrative-image-1 h-full'></div>
            </div>
          </div>
          <div id='Narrative-2' className='grid h-1/3 grid-cols-2'>
            <div className='bg-mt-color-5'>
              <div className='narrative-image-2 h-full w-full'></div>
            </div>
            <div className='bg-mt-color-13 flex items-center justify-center p-5 text-center'>
              <h3>
                Plane gemeinsame <br></br> Abenteuer
              </h3>
            </div>
          </div>
          <div id='Narrative-3' className='grid h-1/3 grid-cols-2'>
            <div className='bg-mt-color-30 flex items-center justify-center p-5 text-center'>
              <h3>
                Checke eine neue<br></br> Wohngegend
              </h3>
            </div>
            <div className='bg-mt-color-5'>
              <div className='narrative-image-3 h-full w-full'></div>
            </div>
          </div>
        </div>

        {/* RESPONSE SECTION =========== */}
        <div id='Response' className='hidden'>
          {/* MAP and FILTER =========== */}
          <div id='Map-Section' className='bg-mt-color-1 h-full'>
            <div className='px-5 pt-15 pb-5 lg:px-20'>
              <h2>Ergebnisse:</h2>
            </div>
            <div id='Leaflet-Container' className='h-full'>
              <LeafletMap className='h-200'></LeafletMap>
            </div>
          </div>

          {/* RESULTS ================== */}
          <div
            id='Results'
            className='grid grid-rows-[min-content_min-content_1fr] gap-10 p-5 pb-35 lg:p-20 lg:pb-40'
          >
            <div id='Weather' className='grid grid-cols-[33%_1fr] gap-5'>
              <div>
                <b>Aktuelles Wetter:</b>
              </div>
              <div className='flex justify-between'>
                <span id='Weather-Icon' className='text-2xl text-yellow-500'>
                  <GoSun />
                </span>
                <span id='Temperature'>12°C</span>
                <span id='Wind-Description'>windy</span>
              </div>
            </div>
            <div id='Geo-Info' className='grid grid-cols-[33%_1fr] gap-5'>
              <div>
                <b>Geografische Informationen:</b>
              </div>
              <div className='flex items-center justify-between'>
                <span id='Geo-Info-1'>84m üNN</span>
                <span id='Geo-Info-2'>something else</span>
              </div>
            </div>
            <div id='AI-Text' className='grid grid-cols-[1fr] gap-5'>
              <div className='lg:text-2xl'>
                <b>Umgebung:</b>
              </div>
              <div className='text-justify'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus aliquid excepturi
                maxime eligendi ullam repellendus, dolorem explicabo blanditiis laboriosam molestias
                assumenda alias, illum expedita, quibusdam doloremque consectetur? Accusamus
                voluptatem quia, laboriosam illum quisquam, commodi voluptate reiciendis, aliquam
                laudantium officia quas dolores dicta eveniet eius sunt! Nobis delectus ipsa,
                debitis porro asperiores tenetur perspiciatis architecto nulla ut quaerat ratione
                quo atque, excepturi fugiat hic unde, dolore ducimus esse quae. Repellendus atque
                veritatis hic, necessitatibus totam quidem labore provident, animi suscipit quam
                quis sint sunt reiciendis corporis fugiat facilis tempore earum non ad beatae
                mollitia rem. Minima molestiae doloribus aliquam provident soluta!
                <span id='Geo-Info-2'>something else</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
