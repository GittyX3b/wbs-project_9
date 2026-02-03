export const Narratives = ({ visible }: { visible: boolean }) => {
  return (
    <div id='Narratives' className={`h-200 md:h-280 lg:h-350 ${!visible ? 'hidden' : ''}`}>
      <div id='Narrative-1' className='grid h-1/3 grid-cols-2'>
        <div className='bg-mt-color-20 flex items-center justify-center p-5 text-center'>
          <h3>Finde interresante Orte</h3>
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
          <h3>Plane gemeinsame Abenteuer</h3>
        </div>
      </div>
      <div id='Narrative-3' className='grid h-1/3 grid-cols-2'>
        <div className='bg-mt-color-30 flex items-center justify-center p-5 text-center'>
          <h3>Checke eine neue Wohngegend</h3>
        </div>
        <div className='bg-mt-color-5'>
          <div className='narrative-image-3 h-full w-full'></div>
        </div>
      </div>
    </div>
  );
};
