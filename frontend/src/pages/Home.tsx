import { GoSearch, GoSun } from 'react-icons/go';

import { Hero, LeafletMap, Narratives } from '@components';

export const Home = () => {
  return (
    <>
      <title>MapTold - Home</title>
      <main className=''>
        {/* HERO SECTION ============== */}
        <Hero></Hero>

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
        <Narratives visible={true}></Narratives>

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
