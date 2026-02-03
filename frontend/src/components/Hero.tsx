import { GoLocation } from 'react-icons/go';

import { App_Logo } from '@/components/elements';
import { scrollToElementID } from '@utils';

export const Hero = () => {
  return (
    <div id='Hero' className='hero hero-bg-image h-fit min-h-screen pb-15'>
      <div className='hero-content h-full pb-20 text-center lg:mb-40 lg:h-[80%]'>
        <div className='flex h-[85%] max-w-md flex-col items-center justify-between lg:h-full lg:max-w-xl'>
          <App_Logo className='w-[40%]'></App_Logo>
          <h1 className='px-6 font-bold'>Dein virtueller Aussichtsturm</h1>
          <p className='px-10 py-8 italic'>
            Gib einen geografischen Punkt an und erhalte relevante Informationen zu seiner Umgebung,
            serviert von unserer Standort-KI.
          </p>
          <button
            onClick={() => scrollToElementID('Location-Form')}
            className='btn btn-primary w-70 lg:w-fit'
          >
            <GoLocation />
            Zielort eingeben
          </button>
        </div>
      </div>
    </div>
  );
};
