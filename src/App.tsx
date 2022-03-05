import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks/reduxHooks';
import { NormalLayout } from './components/Layout';
import { fetchPosts } from './features/post/postSlice';
import { selectLoading, setLoading, setUser } from './features/user/userSlice';
import { auth, getUserWithUID } from './firebase';
import Home from './pages/Home';
import NewPost from './pages/NewPost';
import Post from './pages/Post';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = await getUserWithUID(currentUser.uid);

        dispatch(setUser(userData));
        dispatch(fetchPosts());
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
