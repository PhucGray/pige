import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks/reduxHooks';
import Alert from './components/Alert';
import { NormalLayout } from './components/Layout';
import { selectAlert } from './features/alert/alertSlice';
import {
  fetchPosts,
  fetchSavedPosts,
  setPostLoading,
} from './features/post/postSlice';
import { setLoading, setUser } from './features/user/userSlice';
import { auth, getUserWithUID } from './firebase';
import Bookmark from './pages/Bookmark';
import EditPost from './pages/EditPost';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import MyPost from './pages/MyPosts';
import NewPost from './pages/NewPost';
import Post from './pages/Post';
import ResetPassword from './pages/ResetPassword';
import Search from './pages/Search';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  const dispatch = useAppDispatch();
  const alert = useAppSelector(selectAlert);

  useEffect(() => {
    dispatch(setPostLoading(true));
    dispatch(fetchPosts());
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = await getUserWithUID(currentUser.uid);

        if (userData) {
          dispatch(setUser(userData));
          dispatch(setPostLoading(true));
          dispatch(fetchSavedPosts(userData.uid));
        }
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

          <Route
            path='my-posts'
            element={
              <PrivateRoute>
                <MyPost />
              </PrivateRoute>
            }
          />
          <Route
            path='bookmark'
            element={
              <PrivateRoute>
                <Bookmark />
              </PrivateRoute>
            }
          />
          <Route path='search' element={<Search />} />
        </Route>

        <Route
          path='new-post'
          element={
            <PrivateRoute>
              <NewPost />
            </PrivateRoute>
          }
        />

        <Route
          path='edit-post'
          element={
            <PrivateRoute>
              <EditPost />
            </PrivateRoute>
          }
        />

        <Route path='sign-in' element={<SignIn />} />
        <Route path='sign-up' element={<SignUp />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='reset-password' element={<ResetPassword />} />
      </Routes>

      {alert.show && <Alert />}
    </>
  );
};

export default App;
