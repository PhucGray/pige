import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch } from './app/hooks/reduxHooks';
import { NormalLayout } from './components/Layout';
import Loading from './components/Loading';
import { selectLoading, setLoading, setUser, User } from './features/user/userSlice';
import { auth } from './firebase';
import Home from './pages/Home';
import NewPost from './pages/NewPost';
import Post from './pages/Post';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  const dispatch = useAppDispatch();
  const loading = useSelector(selectLoading)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const user = {
          email: currentUser.email,
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        } as User;
        dispatch(setUser(user));
      } else {
        setUser(null);
      }

      dispatch(setLoading(false));
    });

    return () => unsub();
  }, []);
  return (
    <>
      <Routes>
        <Route path='/' element={<NormalLayout />}>
          <Route index element={<Home />} />
          <Route path='post/:id' element={<Post />} />
        </Route>

        <Route
          path='new-post'
          element={
            <PrivateRoute>
              <NewPost />
            </PrivateRoute>
          }
        />
        <Route path='sign-in' element={<SignIn />} />
        <Route path='sign-up' element={<SignUp />} />
      </Routes>
    </>
  );
};

export default App;
