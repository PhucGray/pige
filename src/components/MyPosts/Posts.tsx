import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks/reduxHooks';
import { showAlert } from '../../features/alert/alertSlice';
import {
  selectPostsByUserID,
  setPosts,
  setPostsByUserID,
} from '../../features/post/postSlice';
import { selectLoading, selectUser } from '../../features/user/userSlice';
import { db, getUserWithUID } from '../../firebase';

const Posts = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const posts = useAppSelector(selectPostsByUserID);
  const loading = useAppSelector(selectLoading);
  const user = useAppSelector(selectUser);

  async function handleDeleteClick(postID?: string) {
    if (confirm(`Bạn có chắc chắn muốn xoá bài viết`)) {
      const userData = await getUserWithUID(user?.uid || '');

      const newPosts = userData?.posts?.filter((postID) => postID !== postID);

      if (newPosts && postID && user?.documentID) {
        await updateDoc(doc(db, 'users', user.documentID), {
          posts: newPosts,
        });

        await deleteDoc(doc(db, 'posts', postID));

        dispatch(
          setPostsByUserID([...posts].filter((p) => p.documentID !== postID)),
        );

        dispatch(
          showAlert({ type: 'success', message: 'Xoá bài viết thành công' }),
        );
      }
    }
  }

  if (loading)
    return (
      <div>
        {[...Array(4).keys()].map((number) => (
          <div
            key={number}
            className='border-b-[1px] mb-[30px] p-[5px] lg:p-[10px] space-y-1'>
            <div className='flex flex-wrap items-center justify-between'>
              <div className='flex items-center gap-[10px]'>
                <div className='animate-pulse bg-gray-400 h-[40px] w-[40px] rounded-full'></div>

                <div className='animate-pulse bg-gray-400 h-[24px] w-[250px]'></div>
              </div>

              <div className='animate-pulse bg-gray-400 h-[24px] w-[100px]'></div>
            </div>

            <div className='animate-pulse bg-gray-400 h-[30px] w-full'></div>

            <div className='flex justify-between flex-wrap'>
              <div className='animate-pulse bg-gray-400 h-[25px] w-[80px]'></div>

              <div className='animate-pulse bg-gray-400 h-[25px] w-[25px]'></div>
            </div>
          </div>
        ))}
      </div>
    );

  if (!user?.posts || user?.posts?.length === 0)
    return <div className='text-center'>Bạn chưa có bài viết nào</div>;

  return (
    <div className='flex-1 overflow-auto'>
      {posts &&
        posts.map(({ createdAt, readTime, title, documentID }) => {
          return (
            <div
              key={documentID}
              className='border-b-[1px] mb-[30px] p-[5px] lg:p-[10px] hover:bg-slate-100 cursor-pointer space-y-1'
              onClick={() => navigate(`/post/${documentID}`)}>
              <div className='flex flex-wrap items-center justify-between'>
                <div className='text-gray-400'>
                  {moment(createdAt).format('L')}
                </div>

                <div className='flex'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/edit-post', { state: { id: documentID } });
                    }}
                    className='rounded-[10px] w-[45px] h-[45px] flex justify-center items-center hover:bg-slate-300'>
                    <AiOutlineEdit size={30} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(documentID);
                    }}
                    className='rounded-[10px] w-[45px] h-[45px] flex justify-center items-center hover:bg-slate-300'>
                    <AiOutlineDelete size={30} />
                  </button>
                </div>
              </div>

              <div className='text-[20px] font-semibold'>{title}</div>

              <div className='font-semibold'>{readTime} phút đọc</div>
            </div>
          );
        })}
    </div>
  );
};

export default Posts;
