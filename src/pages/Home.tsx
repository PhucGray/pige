import Sidebar from '../components/Home/Sidebar';
import PostsList from '../components/PostsList';
import { useAppSelector } from '../app/hooks/reduxHooks';
import { selectPosts } from '../features/post/postSlice';

const Home = () => {
  const posts = useAppSelector(selectPosts);
  return (
    <div className='mt-[20px] mx-auto flex-1 flex gap-[30px] overflow-y-auto px-[20px] w-full max-w-[1200px]'>
      <PostsList posts={posts} />
      <Sidebar />
    </div>
  );
};

export default Home;
