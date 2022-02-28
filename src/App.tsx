import { Route, Routes } from 'react-router-dom';
import { NormalLayout } from './components/Layout';
import Home from './pages/Home';
import NewPost from './pages/NewPost';
import Post from './pages/Post';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<NormalLayout />}>
          <Route index element={<Home />} />
          <Route path='post/:id' element={<Post />} />
        </Route>

        <Route path='new-post' element={<NewPost />} />
        <Route path='sign-in' element={<SignIn />} />
        <Route path='sign-up' element={<SignUp />} />
      </Routes>
    </>
  );
};

export default App;
