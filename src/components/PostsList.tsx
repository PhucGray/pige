import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { BsBookmarkPlus, BsSuitHeartFill } from 'react-icons/bs';
import { CgSearchLoading } from 'react-icons/cg';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks/reduxHooks';
import { POST_PER_PAGE } from '../constant';
import {
  fetchPosts,
  fetchSavedPosts,
  selectLastPostDoc,
  selectPostLoading,
  selectPosts,
  setPostLoading,
} from '../features/post/postSlice';
import { selectUser, setUser } from '../features/user/userSlice';
import { db } from '../firebase';

const PostsList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const posts = useAppSelector(selectPosts);
  const postLoading = useAppSelector(selectPostLoading);
  const lastPostDoc = useAppSelector(selectLastPostDoc);
  const user = useAppSelector(selectUser);

  const [dataLength, setDataLength] = useState(POST_PER_PAGE);

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

  async function fetchMorePosts() {
    dispatch(fetchPosts({ lastPostDoc, currentPosts: posts }));
    setDataLength(dataLength + POST_PER_PAGE);
  }

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  useEffect(() => {
    if (posts) dispatch(setPostLoading(false));
  }, [posts]);

  if (postLoading)
    return (
      <div className='flex-1 overflow-hidden'>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='border-b-[1px] mb-[30px] p-[5px] lg:p-[10px] space-y-1'>
            <div className='flex flex-wrap items-center justify-between'>
              <div className='flex items-center gap-[10px]'>
                <div className='animate-pulse bg-slate-400 w-[40px] h-[40px] rounded-full'></div>

                <div className='animate-pulse bg-slate-400 h-[24px] w-[150px]'></div>
              </div>

              <div className='animate-pulse bg-slate-400 h-[24px] w-[70px]'></div>
            </div>

            <div className='animate-pulse bg-slate-400 h-[24px] w-full max-w-[600px]'></div>

            <div className='flex justify-between flex-wrap'>
              <div className='flex flex-wrap'>
                <div className='animate-pulse bg-slate-400 h-[25px] w-[80px]'></div>

                <div className='animate-pulse bg-slate-400 h-[25px] w-[30px] ml-[5px]'></div>
              </div>

              <div className='animate-pulse bg-slate-400 h-[25px] w-[25px]'></div>
            </div>
          </div>
        ))}
      </div>
    );

  if (posts.length === 0)
    return <div className='text-center flex-1'>Chưa có bài viết nào</div>;

  return (
    <div className='flex-1 overflow-auto'>
      <InfiniteScroll
        dataLength={dataLength}
        next={fetchMorePosts}
        hasMore={true}
        loader={
          <div className='flex justify-center mt-[10px]'>
            <CgSearchLoading size={35} />
          </div>
        }>
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
                        if (!user) return navigate('/sign-in');

                        if (documentID) handleBookmark(documentID);
                      }}
                    />
                  </div>
                </div>
              );
            },
          )}
      </InfiniteScroll>
    </div>
  );
};

export default PostsList;
