import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks/reduxHooks';
import Loading from '../components/Loading';
import { selectLoading, selectUser } from '../features/user/userSlice';

const PrivateRoute: FC = ({ children }) => {
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectLoading);

  if (loading)
    return (
      <div className='h-screen w-screen grid place-items-center'>
        <Loading />
      </div>
    );

  if (!user) return <Navigate to='/sign-in' />;

  return <>{children}</>;
};

export default PrivateRoute;
