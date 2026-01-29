import { Link } from 'react-router-dom';

import { App_Icon } from '@elements';

export const NavBar = ({ className = '' }: { className?: string }) => {
  return (
    <header className={`navbar bg-mt-color-1 shadow-md ${className}`}>
      <div className='navbar-start h-full'>
        <App_Icon />
        <Link to='/' className='text-mt-color-2 font-A pl-3 text-2xl font-bold'>
          MapTold
        </Link>
      </div>
    </header>
  );
};
