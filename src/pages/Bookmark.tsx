import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks/reduxHooks';
import { selectPopularPosts } from '../features/post/postSlice';

const Bookmark = () => {
  const navigate = useNavigate();
  const popularPosts = useAppSelector(selectPopularPosts);
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
        {popularPosts &&
          popularPosts.map((p) => (
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
