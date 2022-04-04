import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks/reduxHooks';
import Posts from '../components/MyPosts/Posts';
import { fetchPostsByUserID, setPostLoading } from '../features/post/postSlice';
import { selectUser } from '../features/user/userSlice';

const MyPosts = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchPostsByUserID(user));
    }
  }, [user]);

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

export default MyPosts;
