import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { BsBookmarkPlus } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks/reduxHooks';
import Loading from '../components/Loading';
import Sidebar from '../components/Post/Sidebar';
import {
  fetchPostByID,
  selectCurrentPost,
  setCurrentPost,
} from '../features/post/postSlice';

const Post = () => {
  const dispatch = useAppDispatch();
  const urlParams = useParams() as { id: string };

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    dispatch(fetchPostByID(urlParams.id));
  }, [urlParams.id]);

  const currentPost = useAppSelector(selectCurrentPost);

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

            <div className='mt-[20px] text-[35px] font-semibold mb-[15px]'>
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
          </div>

          <Sidebar />
        </div>
      )}
    </>
  );
};

export default Post;
