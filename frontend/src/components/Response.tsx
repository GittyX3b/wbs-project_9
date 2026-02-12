import { LeafletMap } from '@components';
import { Chat } from '@components';
import { AiText, GeoInfo, Weather } from '@elements';

export const Response = () => {
  return (
    <div id='Response'>
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
        className='grid p-5 pb-35 lg:grid-cols-[470px_1fr] lg:gap-15 lg:px-20 lg:pt-10 lg:pb-40 xl:grid-cols-[600px_1fr] xl:gap-30'
      >
        <AiText />
        <div>
          <GeoInfo />
          <Weather />
        </div>
      </div>

      <Chat />
    </div>
  );
};
