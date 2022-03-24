import Sidebar from '../components/Home/Sidebar';
import PostsList from '../components/PostsList';
import { useAppDispatch, useAppSelector } from '../app/hooks/reduxHooks';
import { selectPosts, setPostLoading } from '../features/post/postSlice';
import { useEffect } from 'react';

const Home = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);

  useEffect(() => {
    if (posts) dispatch(setPostLoading(false));
  }, [posts]);

  return (
    <div className='mt-[20px] mx-auto flex-1 flex gap-[30px] overflow-y-auto px-[20px] w-full max-w-[1200px]'>
      <PostsList posts={posts} />
      <Sidebar />
    </div>
  );
};

export default Home;
