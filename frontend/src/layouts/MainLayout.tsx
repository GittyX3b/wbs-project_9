import { Outlet } from 'react-router-dom';

import { Footer, NavBar } from '@components';

export const MainLayout = () => {
  return (
    <div className='grid min-h-screen grid-rows-[auto_1fr_auto]'>
      <NavBar className='h-14 px-3'></NavBar>
      <Outlet></Outlet>
      <Footer className='bg-green-200'></Footer>
    </div>
  );
};
