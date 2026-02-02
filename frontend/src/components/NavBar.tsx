import { Link } from 'react-router-dom';

import { App_Icon } from '@elements';

export const NavBar = ({ className = '' }: { className?: string }) => {
  return (
    <header className={`navbar bg-mt-color-1 sticky top-0 z-2000 w-full shadow-md ${className}`}>
      <div className='navbar-start h-full'>
        <Link to='/' className='h-[90%]'>
          <App_Icon />
        </Link>
        <Link to='/' className='text-mt-color-3 font-A pl-3 text-2xl font-bold'>
          MapTold
        </Link>
      </div>
      <div className='navbar-end'></div>
    </header>
  );
};
