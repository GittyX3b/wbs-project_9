import { Outlet } from 'react-router-dom';

import { Footer, NavBar } from '@components';

export const MainLayout = () => {
  return (
    <div className='relative flex min-h-screen w-full flex-col justify-between'>
      <NavBar className='h-14 px-3'></NavBar>
      <Outlet></Outlet>
      <Footer className='h-20'></Footer>
    </div>
  );
};
