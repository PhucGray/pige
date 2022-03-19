import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks/reduxHooks';
import Alert from './components/Alert';
import { NormalLayout } from './components/Layout';
import { selectAlert } from './features/alert/alertSlice';
import { fetchPosts } from './features/post/postSlice';
import { setLoading, setUser } from './features/user/userSlice';
import { auth, getUserWithUID } from './firebase';
import Bookmark from './pages/Bookmark';
import EditPost from './pages/EditPost';
import Home from './pages/Home';
import MyPost from './pages/MyPosts';
import NewPost from './pages/NewPost';
import Post from './pages/Post';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  const dispatch = useAppDispatch();
  const alert = useAppSelector(selectAlert);

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = await getUserWithUID(currentUser.uid);

        dispatch(setUser(userData));
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
      </Routes>

      {alert.show && <Alert />}
    </>
  );
};

export default App;
