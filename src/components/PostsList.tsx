import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import { BsBookmarkPlus, BsSuitHeartFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks/reduxHooks';
import { fetchSavedPosts, selectPostLoading } from '../features/post/postSlice';
import {
  selectUserLoading,
  selectUser,
  setUser,
} from '../features/user/userSlice';
import { db } from '../firebase';
import { PostType } from '../types';
import PenLoading from './PenLoading';

interface PostsListProps {
  posts: PostType[];
}

const PostsList = ({ posts }: PostsListProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const userLoading = useAppSelector(selectUserLoading);
  const postLoading = useAppSelector(selectPostLoading);
  const user = useAppSelector(selectUser);

  async function handleBookmark(postID: string) {
    if (user?.documentID) {
      const userRef = doc(db, 'users', user.documentID);

      if (user.savedPosts.includes(postID)) {
        await updateDoc(userRef, {
          savedPosts: arrayRemove(postID),
        });

        dispatch(
          setUser({
            ...user,
            savedPosts: [...user.savedPosts].filter((p) => p !== postID),
          }),
        );
      } else {
        await updateDoc(userRef, {
          savedPosts: arrayUnion(postID),
        });

        dispatch(
          setUser({
            ...user,
            savedPosts: [...user.savedPosts, postID],
          }),
        );
      }

      dispatch(fetchSavedPosts(user.uid));
    }
  }

  if (userLoading || postLoading) return <PenLoading />;

  if (posts.length === 0)
    return <div className='text-center flex-1'>Chưa có bài viết nào</div>;

  return (
    <div className='flex-1 overflow-auto'>
      {posts &&
        posts.map(
          ({
            createdAt,
            readTime,
            title,
            documentID,
            displayName,
            photoURL,
            likes,
          }) => {
            return (
              <div
                key={documentID}
                className='border-b-[1px] mb-[30px] p-[5px] lg:p-[10px] hover:bg-slate-100 cursor-pointer space-y-1'
                onClick={() => navigate(`/post/${documentID}`)}>
                <div className='flex flex-wrap items-center justify-between'>
                  <div className='flex items-center gap-[10px]'>
                    <img
                      src={photoURL || '/default-avatar.jpg'}
                      alt='awf'
                      height={40}
                      width={40}
                      className='rounded-full'
                    />

                    <div className='font-semibold'>{displayName}</div>
                  </div>

                  <div className='text-gray-400'>
                    {moment(createdAt).format('L')}
                  </div>
                </div>

                <div className='text-[20px] font-semibold'>{title}</div>

                <div className='flex justify-between flex-wrap'>
                  <div className='flex flex-wrap'>
                    <div className='font-semibold'>{readTime} phút đọc</div>
                    <div className='ml-[10px] flex items-center gap-[5px]'>
                      <BsSuitHeartFill />
                      {likes.length}
                    </div>
                  </div>

                  <BsBookmarkPlus
                    title={
                      documentID && user?.savedPosts.includes(documentID)
                        ? 'Huỷ lưu bài viêt'
                        : 'Lưu bài viết'
                    }
                    className={`text-[22px] md:text-[25px] hover:scale-125 ${
                      documentID &&
                      user?.savedPosts.includes(documentID) &&
                      'text-primary'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (documentID) handleBookmark(documentID);
                    }}
                  />
                </div>
              </div>
            );
          },
        )}
    </div>
  );
};

export default PostsList;
