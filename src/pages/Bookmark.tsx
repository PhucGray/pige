import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks/reduxHooks';
import { selectSavedPosts } from '../features/post/postSlice';
import { selectUser } from '../features/user/userSlice';

const Bookmark = () => {
  const navigate = useNavigate();
  const posts = useAppSelector(selectSavedPosts);
  const user = useAppSelector(selectUser);

  if (posts.length === 0)
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
        {posts &&
          posts
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
