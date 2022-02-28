import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export const NormalLayout: FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
