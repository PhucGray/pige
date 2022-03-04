import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export const NormalLayout = () => {
  return (
    <div className='h-screen flex flex-col'>
      <Navbar />
      <Outlet />
      {/* <footer>Footer</footer> */}
    </div>
  );
};
