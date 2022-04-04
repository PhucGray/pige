import Sidebar from '../components/Home/Sidebar';
import PostsList from '../components/PostsList';

const Home = () => {
  return (
    <div className='mt-[20px] mx-auto  flex-1 flex gap-[30px] px-[20px] w-full max-w-[1200px]'>
      <PostsList />
      <Sidebar />
    </div>
  );
};

export default Home;
