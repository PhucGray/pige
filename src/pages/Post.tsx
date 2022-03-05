import moment from 'moment';
import { useEffect, useState } from 'react';
import { BsBookmarkPlus } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks/reduxHooks';
import Sidebar from '../components/Post/Sidebar';
import { fetchPostByID, selectCurrentPost } from '../features/post/postSlice';
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromRaw,
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const Post = () => {
  const dispatch = useAppDispatch();
  const urlParams = useParams() as { id: string };

  useEffect(() => {
    dispatch(fetchPostByID(urlParams.id));
  }, [urlParams.id]);

  const currentPost = useAppSelector(selectCurrentPost);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );

  useEffect(() => {
    if (currentPost?.content) {
      console.log(currentPost.content);
    }
  }, [currentPost]);

  return (
    <>
      {currentPost && (
        <div className='mt-[30px] mx-auto flex gap-[30px] px-[20px] w-full max-w-[1200px]'>
          <div className='flex-1'>
            <div className='flex items-center gap-[20px]'>
              <img
                src={currentPost.photoURL}
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

            <div className='mt-[20px] text-[35px] font-semibold'>
              {currentPost.title}
            </div>

            {/* {editorState && <Editor editorState={editorState} />} */}
            <div
              dangerouslySetInnerHTML={{ __html: currentPost?.content }}></div>
          </div>

          <Sidebar />
        </div>
      )}
    </>
  );
};

export default Post;
