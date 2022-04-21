import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks/reduxHooks';
import { showAlert } from '../../features/alert/alertSlice';
import {
  selectMyPostLoading,
  selectPosts,
  selectPostsByUserID,
  setPostLoading,
  setPosts,
  setPostsByUserID,
} from '../../features/post/postSlice';
import { selectUser } from '../../features/user/userSlice';
import { db, getUserWithUID } from '../../firebase';
import { formatTime } from '../../utils/customMoment';

const Posts = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const postsByUserID = useAppSelector(selectPostsByUserID);
  const posts = useAppSelector(selectPosts);

  const myPostLoading = useAppSelector(selectMyPostLoading);
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
          setPostsByUserID(
            [...postsByUserID].filter((p) => p.documentID !== postID),
          ),
        );

        dispatch(setPosts([...posts].filter((p) => p.documentID !== postID)));

        dispatch(
          showAlert({ type: 'success', message: 'Xoá bài viết thành công' }),
        );
      }
    }
  }

  useEffect(() => {
    if (postsByUserID) dispatch(setPostLoading(false));
  }, [postsByUserID]);

  if (myPostLoading)
    return (
      <div className='overflow-hidden'>
        {[0, 1, 2].map((i) => {
          return (
            <div
              key={i}
              className='border-b-[1px] mb-[30px] p-[5px] lg:p-[10px] space-y-1'>
              <div className='animate-pulse bg-slate-400 h-[24px] w-[80px]'></div>

              <div className='animate-pulse bg-slate-400 h-[30px] w-[80%]'></div>

              <div className='animate-pulse bg-slate-400 h-[24px] w-[75px]'></div>
            </div>
          );
        })}
      </div>
    );

  if (postsByUserID.length === 0)
    return <div className='text-center'>Bạn chưa có bài viết nào</div>;

  return (
    <div className='flex-1 overflow-auto'>
      {postsByUserID &&
        postsByUserID.map(({ createdAt, readTime, title, documentID }) => {
          return (
            <div
              key={documentID}
              className='border-b-[1px] mb-[30px] p-[5px] lg:p-[10px] hover:bg-slate-100 cursor-pointer space-y-1'
              onClick={() => navigate(`/post/${documentID}`)}>
              <div className='flex flex-wrap items-center justify-between'>
                <div className='text-gray-400'>{formatTime(createdAt)}</div>

                <div className='flex'>
                  <button
                    title='Sửa bài viết'
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/edit-post', { state: { id: documentID } });
                    }}
                    className='rounded-[10px] w-[45px] h-[45px] flex justify-center items-center hover:bg-slate-300'>
                    <AiOutlineEdit size={30} />
                  </button>

                  <button
                    title='Xoá bài viết'
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
