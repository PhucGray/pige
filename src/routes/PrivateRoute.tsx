import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks/reduxHooks';
import { selectUserLoading, selectUser } from '../features/user/userSlice';

const PrivateRoute: FC = ({ children }) => {
  const user = useAppSelector(selectUser);
  const userLoading = useAppSelector(selectUserLoading);

  if (!user && !userLoading) return <Navigate to='/sign-in' />;

  return <>{children}</>;
};

export default PrivateRoute;
