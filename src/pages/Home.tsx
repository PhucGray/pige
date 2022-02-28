import Sidebar from '../components/Home/Sidebar';
import PostFeeds from '../components/PostFeeds';

const Home = () => {
  return (
    <div className='mt-[20px] mx-auto flex gap-[30px] px-[20px] max-w-[1200px]'>
      <PostFeeds />
      <Sidebar />
    </div>
  );
};

export default Home;
