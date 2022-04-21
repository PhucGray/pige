import { ContentState, EditorState } from 'draft-js';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import htmlToDraft from 'html-to-draftjs';
import { FormEvent, useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { AiOutlineClose } from 'react-icons/ai';
import { BsBookmarkPlus, BsChat, BsHeart } from 'react-icons/bs';
import { HiOutlineBookOpen } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks/reduxHooks';
import {
  fetchPostByID,
  fetchSavedPosts,
  selectCurrentPost,
  setCurrentPost,
} from '../features/post/postSlice';
import { selectUser, setUser } from '../features/user/userSlice';
import { db } from '../firebase';
import { CommentType } from '../types';
import { formatTime } from '../utils/customMoment';

const Post = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const urlParams = useParams() as { id: string };

  const currentPost = useAppSelector(selectCurrentPost);
  const user = useAppSelector(selectUser);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);

  async function handleLike() {
    if (user?.documentID && currentPost?.documentID) {
      const userRef = doc(db, 'users', user.documentID);
      const postRef = doc(db, 'posts', currentPost.documentID);

      if (currentPost.likes.includes(user.uid)) {
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid),
        });

        await updateDoc(userRef, {
          likes: arrayRemove(currentPost.documentID),
        });

        dispatch(
          setUser({
            ...user,
            likes: [...user.likes].filter((i) => i !== currentPost.documentID),
          }),
        );

        dispatch(
          setCurrentPost({
            ...currentPost,
            likes: currentPost.likes.filter((i) => i !== user.uid),
          }),
        );
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid),
        });

        await updateDoc(userRef, {
          likes: arrayUnion(currentPost.documentID),
        });

        dispatch(
          setUser({
            ...user,
            likes: [...user.likes, currentPost.documentID],
          }),
        );
        dispatch(
          setCurrentPost({
            ...currentPost,
            likes: [...currentPost.likes, user.uid],
          }),
        );
      }
    }
  }

  async function handleComment(e: FormEvent) {
    e.preventDefault();

    if (!comment.trim()) return setComment('');

    if (user?.documentID && currentPost?.documentID) {
      const userRef = doc(db, 'users', user.documentID);
      const postRef = doc(db, 'posts', currentPost.documentID);

      const commentID = user.uid + new Date().toISOString();

      const newComment = {
        commentID,
        userID: user.uid,
        content: comment,
        displayName: user.displayName,
        photoURL: user.photoURL || null,
        createdAt: new Date().toString(),
      } as CommentType;

      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });

      await updateDoc(userRef, {
        comments: arrayUnion(commentID),
      });

      dispatch(
        setUser({
          ...user,
          comments: [...user.comments, commentID],
        }),
      );

      dispatch(fetchPostByID(currentPost.documentID));

      setComment('');
    } else {
    }
  }

  async function handleDeleteComment(commentID: string) {
    if (user?.documentID && currentPost?.documentID) {
      const userRef = doc(db, 'users', user.documentID);
      const postRef = doc(db, 'posts', currentPost.documentID);

      await updateDoc(postRef, {
        comments: currentPost.comments.filter((c) => c.commentID !== commentID),
      });

      await updateDoc(userRef, {
        comments: arrayRemove(commentID),
      });

      dispatch(
        setUser({
          ...user,
          comments: user.comments.filter((c) => c !== commentID),
        }),
      );

      dispatch(fetchPostByID(currentPost.documentID));
    }
  }

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

  useEffect(() => {
    dispatch(fetchPostByID(urlParams.id));
  }, [urlParams.id]);

  useEffect(() => {
    return () => {
      dispatch(setCurrentPost(null));
    };
  }, []);

  useEffect(() => {
    if (currentPost?.content) {
      const contentBlock = htmlToDraft(currentPost.content);

      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks,
      );

      const editorState = EditorState.createWithContent(contentState);

      setEditorState(editorState);

      document.title = currentPost.title;
    }
  }, [currentPost]);

  useEffect(() => {
    return () => {
      document.title = 'pige';
    };
  }, []);

  if (!currentPost)
    return (
      <div className='flex relative justify-center items-center h-[calc(100vh-60px)]'>
        <HiOutlineBookOpen size={45} className='animate-bounce' />
      </div>
    );

  return (
    <>
      {currentPost && (
        <>
          <div className='mt-[30px] mx-auto px-[20px] w-full max-w-[900px]'>
            <div className='flex items-center gap-[20px]'>
              <img
                src={currentPost.photoURL || '/default-avatar.jpg'}
                alt='awf'
                height={40}
                width={40}
                className='rounded-full'
              />

              <div>
                <div className='font-semibold'>{currentPost.displayName}</div>
                <div className='flex items-center gap-[10px]'>
                  <div>{formatTime(currentPost.createdAt)}</div>
                  <div>-</div>
                  <div>{currentPost.readTime} phút đọc</div>
                </div>
              </div>

              <BsBookmarkPlus
                title={
                  currentPost.documentID &&
                  user?.savedPosts.includes(currentPost.documentID)
                    ? 'Huỷ lưu bài viêt'
                    : 'Lưu bài viết'
                }
                onClick={() => {
                  if (!user) return navigate('/sign-in');

                  if (currentPost.documentID)
                    handleBookmark(currentPost.documentID);
                }}
                className={`ml-auto text-[24px] hover:scale-125 cursor-pointer ${
                  currentPost.documentID &&
                  user?.savedPosts.includes(currentPost.documentID) &&
                  'text-primary'
                }`}
              />
            </div>
            <div className='mt-[20px] text-[40px] font-bold mb-[15px]'>
              {currentPost.title}
            </div>
            {editorState && (
              <Editor
                toolbarHidden
                readOnly
                editorState={editorState}
                hashtag={{
                  separator: ' ',
                  trigger: '#',
                }}
              />
            )}
            <div className='flex gap-2 mb-2'>
              <div
                onClick={() => {
                  if (!user) return navigate('/sign-in');

                  handleLike();
                }}
                className={` ${
                  user?.uid &&
                  currentPost.likes.includes(user.uid) &&
                  'bg-slate-300'
                }
                  flex items-center w-fit rounded-[10px] gap-2 px-[20px] py-[10px]
                cursor-pointer`}>
                <BsHeart />
                {currentPost.likes.length}
                <div>Yêu thích</div>
              </div>

              <div
                onClick={() => {
                  if (!user) return navigate('/sign-in');
                  setShowComment(!showComment);
                }}
                className='flex items-center w-fit rounded-[10px] gap-2 px-[20px] py-[10px]
                cursor-pointer'>
                <BsChat />
                <div>Bình luận</div>
              </div>
            </div>

            {showComment && (
              <form onSubmit={handleComment} className='mb-[20px]'>
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  type='text'
                  className='form-control w-full'
                  placeholder='Viết bình luận . . .'
                  autoFocus
                />

                {comment.trim() && (
                  <div className='mt-3 text-center'>
                    <button
                      type='button'
                      onClick={() => setComment('')}
                      className='text-slate-600 font-bold w-[111px] py-[10px] '>
                      Huỷ
                    </button>
                    <button
                      type='submit'
                      className='bg-primary text-white font-bold px-[20px] py-[10px]'>
                      Bình luận
                    </button>
                  </div>
                )}
              </form>
            )}

            <div className='mb-[50px] mt-[20px]'>
              {currentPost.comments &&
                currentPost.comments
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((comment, index) => (
                    <div
                      key={comment.userID + index}
                      className='flex gap-[20px] group'>
                      <img
                        className='rounded-full h-[35px] w-[35px]'
                        src={comment.photoURL || '/default-avatar.jpg'}
                      />

                      <div>
                        <div className='font-bold'>{comment.displayName}</div>
                        <div>{comment.content}</div>
                      </div>

                      {user?.comments.includes(comment.commentID) && (
                        <div
                          onClick={() => handleDeleteComment(comment.commentID)}
                          className='text-[25px] cursor-pointer hidden group-hover:block'>
                          <AiOutlineClose />
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Post;
