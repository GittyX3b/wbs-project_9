import { LuSun } from 'react-icons/lu';

import { Hero, LeafletMap, LocationForm, Narratives } from '@components';

export const Home = () => {
  return (
    <>
      <title>MapTold</title>
      <main>
        <Hero />
        <LocationForm />
        <Narratives visible={true} />

        {/* RESPONSE SECTION =========== */}
        <div id='Response' className='hidden'>
          {/* MAP and FILTER =========== */}
          <div id='Map-Section' className='bg-mt-color-1 h-full'>
            <div className='px-5 pt-15 pb-5 lg:px-20'>
              <h2>Ergebnisse:</h2>
            </div>
            <div id='Leaflet-Container' className='h-full'>
              <LeafletMap className='h-200' />
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
                  <LuSun />
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
