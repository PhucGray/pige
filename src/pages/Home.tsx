import Sidebar from '../components/Home/Sidebar';
import PostFeeds from '../components/PostFeeds';

const Home = () => {
  return (
    <div className='mt-[20px] mx-auto flex-1 flex gap-[30px] overflow-y-auto px-[20px] w-full max-w-[1200px]'>
      <PostFeeds />
      <Sidebar />
    </div>
  );
};

export default Home;
