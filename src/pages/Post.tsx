import { ContentState, EditorState } from 'draft-js';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import htmlToDraft from 'html-to-draftjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { BsBookmarkPlus, BsChat, BsHeart } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks/reduxHooks';
import Loading from '../components/Loading';
import {
  fetchPostByID,
  selectCurrentPost,
  setCurrentPost,
} from '../features/post/postSlice';
import { selectUser, setUser } from '../features/user/userSlice';
import { db } from '../firebase';

const Post = () => {
  const dispatch = useAppDispatch();
  const urlParams = useParams() as { id: string };

  const currentPost = useAppSelector(selectCurrentPost);
  const user = useAppSelector(selectUser);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [comment, setComment] = useState('');

  async function handleLike() {
    if (user?.documentID && currentPost?.documentID) {
      const userRef = doc(db, 'users', user.documentID);
      const postRef = doc(db, 'posts', currentPost.documentID);

      if (user.likes.includes(currentPost.documentID)) {
        await updateDoc(postRef, {
          hearts: currentPost.hearts - 1,
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
          setCurrentPost({ ...currentPost, hearts: currentPost.hearts - 1 }),
        );
      } else {
        await updateDoc(postRef, {
          hearts: currentPost.hearts + 1,
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
          setCurrentPost({ ...currentPost, hearts: currentPost.hearts + 1 }),
        );
      }
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
    }
  }, [currentPost]);

  if (!currentPost)
    return (
      <div className='mt-[40px]'>
        <Loading />
      </div>
    );

  return (
    <>
      {currentPost && (
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
                <div>{moment(currentPost.createdAt).format('L')}</div>
                <div>-</div>
                <div>{currentPost.readTime} phút đọc</div>
              </div>
            </div>

            <BsBookmarkPlus className='ml-auto text-[24px]  hover:scale-125 cursor-pointer' />
          </div>

          <div className='mt-[20px] text-[40px] font-bold mb-[15px]'>
            {currentPost.title}
          </div>

          {editorState && (
            <Editor
              toolbarHidden
              readOnly
              toolbar={{
                image: {
                  alignmentEnabled: false,
                },
              }}
              editorState={editorState}
              hashtag={{
                separator: ' ',
                trigger: '#',
              }}
            />
          )}

          <div className='flex gap-2 mb-2'>
            <div
              onClick={handleLike}
              className={` ${
                user?.likes.includes(currentPost.documentID || '???') &&
                'bg-slate-300'
              }
                  flex items-center w-fit rounded-[10px] gap-2 px-[20px] py-[10px]
                cursor-pointer`}>
              <BsHeart />
              {currentPost.hearts}
              <div>Yêu thích</div>
            </div>

            <div
              className='flex items-center w-fit rounded-[10px] gap-2 px-[20px] py-[10px]
                cursor-pointer'>
              <BsChat />
              <div>Bình luận</div>
            </div>
          </div>

          <div className='mb-[50px]'>
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              type='text'
              className='form-control w-full'
              placeholder='Viết bình luận . . .'
            />
            {comment.trim() && (
              <div className='mt-3 text-center'>
                <button
                  onClick={() => setComment('')}
                  className='text-slate-600 font-bold w-[111px] py-[10px] '>
                  Huỷ
                </button>
                <button className='bg-primary text-white font-bold px-[20px] py-[10px]'>
                  Bình luận
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
