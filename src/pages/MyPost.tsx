// import PostFeeds from '../components/PostFeeds';

import Posts from '../components/MyPost/Posts';

const MyPost = () => {
  return (
    <div>
      <div className='text-[30px] font-bold pt-[20px] px-[20px] lg:px-[40px]'>
        Bài viết của bạn
      </div>

      <div className='px-[10px] lg:px-[20px]'>
        <Posts />
      </div>
    </div>
  );
};

export default MyPost;
