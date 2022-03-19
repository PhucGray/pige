import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import { BsBookmarkPlus, BsSuitHeartFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks/reduxHooks';
import { selectPosts } from '../../features/post/postSlice';
import {
  selectLoading,
  selectUser,
  setUser,
} from '../../features/user/userSlice';
import { db } from '../../firebase';

const PostFeeds = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const posts = useAppSelector(selectPosts);
  const loading = useAppSelector(selectLoading);
  const user = useAppSelector(selectUser);

  async function handleBookmark(postID: string) {
    if (user?.documentID) {
      const userRef = doc(db, 'users', user.documentID);

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
  }

  if (loading)
    return (
      <div className='flex-1 overflow-auto'>
        {[...Array(3).keys()].map((number) => (
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
            hearts,
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
                      {hearts.length}
                    </div>
                  </div>

                  <BsBookmarkPlus
                    className={`text-[22px] md:text-[25px] hover:scale-125 ${
                      user?.savedPosts.includes(documentID || '??') &&
                      'text-primary'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmark(documentID || '????');
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

export default PostFeeds;
