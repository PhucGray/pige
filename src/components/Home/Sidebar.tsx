import { useEffect } from 'react';
import { BsSuitHeartFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks/reduxHooks';
import {
  fetchPopularPosts,
  selectPopularPosts,
  selectPostLoading,
} from '../../features/post/postSlice';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const polularPosts = useAppSelector(selectPopularPosts);
  const postLoading = useAppSelector(selectPostLoading);

  useEffect(() => {
    dispatch(fetchPopularPosts());
  }, []);

  if (postLoading)
    return (
      <div className='w-[320px] hidden lg:block'>
        <div className='text-[20px] font-semibold flex items-center gap-[20px]'>
          <div>Bài viết phổ biến</div>
          <div className='h-[2px] flex-1 bg-gray-300'></div>
        </div>

        <div className='group cursor-pointer border-b-[1px] mt-[20px] pl-[10px] space-y-2'>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className='space-y-[2px]'>
              <div className='animate-pulse bg-slate-400 h-[24px] w-full'></div>
              <div className='animate-pulse bg-slate-400 h-[24px] w-[70px]'></div>
              <div className='animate-pulse bg-slate-400 h-[24px] w-[120px]'></div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className='w-[320px] hidden lg:block'>
      <div className='text-[20px] font-semibold flex items-center gap-[20px]'>
        <div>Bài viết phổ biến</div>
        <div className='h-[2px] flex-1 bg-gray-300'></div>
      </div>

      <div className='group cursor-pointer border-b-[1px] mt-[20px] pl-[10px]'>
        {polularPosts &&
          polularPosts.map((p) => (
            <div
              key={p.documentID}
              onClick={() => navigate(`/post/${p.documentID}`)}>
              <div className='font-semibold group-hover:text-primary'>
                {p.title}
              </div>
              <div className='flex items-center space-x-2'>
                <BsSuitHeartFill />
                <div>{p.likes.length}</div>
              </div>
              <div>{p.displayName}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
