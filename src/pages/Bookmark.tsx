import moment from 'moment';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks/reduxHooks';
import {
  selectPostLoading,
  selectSavedPosts,
  setPostLoading,
} from '../features/post/postSlice';
import { selectUser } from '../features/user/userSlice';

const Bookmark = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const savedPosts = useAppSelector(selectSavedPosts);
  const user = useAppSelector(selectUser);

  const postLoading = useAppSelector(selectPostLoading);

  useEffect(() => {
    if (savedPosts) dispatch(setPostLoading(false));
  }, [savedPosts]);

  useEffect(() => {
    document.title = 'Bài viết đã lưu';
  }, []);

  if (postLoading)
    return (
      <div>
        <div className='text-[40px] font-bold text-center mt-[20px]'>
          Bài viết đã lưu
        </div>

        <div
          className='grid gap-[20px] pt-[40px] px-[40px] overflow-hidden'
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='animate-pulse bg-slate-400 rounded-[10px] px-[20px] py-[10px] h-[100px]'></div>
          ))}
        </div>
      </div>
    );

  if (savedPosts.length === 0)
    return (
      <div>
        <div className='text-[40px] font-bold text-center mt-[20px]'>
          Bài viết đã lưu
        </div>

        <div className='text-center mt-[20px]'>Chưa có bài viết nào</div>
      </div>
    );

  return (
    <div>
      <div className='text-[40px] font-bold text-center mt-[20px]'>
        Bài viết đã lưu
      </div>

      <div
        className='grid gap-[20px] pt-[40px] px-[40px]'
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
        }}>
        {savedPosts &&
          savedPosts
            .filter(
              (p) => p.documentID && user?.savedPosts.includes(p.documentID),
            )
            .map((p) => (
              <div
                onClick={() => navigate(`/post/${p.documentID}`)}
                key={p.documentID}
                className='border rounded-[10px] px-[20px] py-[10px] cursor-pointer
              hover:bg-slate-50'>
                <div className='font-bold'>{p.title}</div>
                <div>Tác giả: {p.displayName}</div>
                <div>Ngày: {moment(p.createdAt).format('L')}</div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Bookmark;
