import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks/reduxHooks';
import { selectLoading, selectUser } from '../features/user/userSlice';

const PrivateRoute: FC = ({ children }) => {
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectLoading);

  if (!user && !loading) return <Navigate to='/sign-in' />;

  return <>{children}</>;
};

export default PrivateRoute;
