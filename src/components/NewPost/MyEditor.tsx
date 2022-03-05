import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { addDoc, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { MutableRefObject, useRef, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { MdOutlineDataSaverOff } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks/reduxHooks';
import { fetchPosts } from '../../features/post/postSlice';
import { selectUser } from '../../features/user/userSlice';
import { db, postsCollectionRef } from '../../firebase';
import BoldIcon from '../../images/icons/bold.png';
import CenterIcon from '../../images/icons/center.png';
import EmojiIcon from '../../images/icons/emoji.png';
import ImageIcon from '../../images/icons/image.png';
import ItalicIcon from '../../images/icons/italic.png';
import JustifyIcon from '../../images/icons/justify.png';
import LeftIcon from '../../images/icons/left.png';
import MonospaceIcon from '../../images/icons/monospace.png';
import OrderedIcon from '../../images/icons/ordered.png';
import RightIcon from '../../images/icons/right.png';
import StrikeThroughIcon from '../../images/icons/strikethrough.png';
import SubscriptIcon from '../../images/icons/subscript.png';
import SuperscriptIcon from '../../images/icons/superscript.png';
import UnderlineIcon from '../../images/icons/underline.png';
import UnorderedIcon from '../../images/icons/unordered.png';
import '../../styles/toolbar.css';
import { PostType } from '../../types';

const toolbar = {
  options: [
    'inline',
    'fontSize',
    'list',
    'textAlign',
    'emoji',
    'image',
    'history',
  ],
  inline: {
    inDropdown: false,
    options: [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'monospace',
      'superscript',
      'subscript',
    ],
    bold: {
      icon: BoldIcon,
    },
    italic: { icon: ItalicIcon },
    underline: { icon: UnderlineIcon },
    strikethrough: { icon: StrikeThroughIcon },
    monospace: { icon: MonospaceIcon },
    superscript: { icon: SuperscriptIcon },
    subscript: { icon: SubscriptIcon },
  },
  emoji: {
    icon: EmojiIcon,
  },
  list: {
    unordered: {
      icon: UnorderedIcon,
    },
    ordered: {
      icon: OrderedIcon,
    },
    indent: {
      className: 'd-none',
    },
    outdent: {
      className: 'd-none',
    },
  },
  textAlign: {
    left: {
      icon: LeftIcon,
    },
    right: {
      icon: RightIcon,
    },
    center: {
      icon: CenterIcon,
    },
    justify: {
      icon: JustifyIcon,
    },
  },
  image: {
    icon: ImageIcon,
  },
};

const content = {
  entityMap: {},
  blocks: [
    {
      key: '637gr',
      text: 'Initialized from content state.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
};

const MyEditor = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [postLoading, setPostLoading] = useState(false);
  //

  const textareaRef = useRef() as MutableRefObject<HTMLTextAreaElement>;

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );

  function onEditorStateChange(editorState: EditorState) {
    setEditorState(editorState);
  }

  const [title, setTitle] = useState('');
  const [readTime, setReadTime] = useState(Number.NaN);

  const user = useAppSelector(selectUser);

  async function handlePost() {
    setPostLoading(true);

    if (editorState) {
      console.log(editorState.getCurrentContent());
    }

    const newPost = {
      uid: user?.uid,
      content: textareaRef.current.value,
      createdAt: new Date().toString(),
      readTime,
      title,
    } as PostType;

    const newPostDoc = await addDoc(postsCollectionRef, newPost);

    if (user?.documentID) {
      const userRef = doc(db, 'users', user.documentID);
      await updateDoc(userRef, {
        posts: arrayUnion(newPostDoc.id),
      });
    }

    setEditorState(EditorState.createEmpty());
    setReadTime(NaN);
    setTitle('');

    setPostLoading(false);

    dispatch(fetchPosts());
    navigate('/');
  }

  if (postLoading)
    return (
      <div className='fixed h-screen w-screen grid place-items-center bg-[#000000d1] z-50'>
        <MdOutlineDataSaverOff
          fontSize={40}
          className='text-primary animate-spin'
        />
      </div>
    );

  return (
    <>
      <textarea
        ref={textareaRef}
        className='fixed top-[-9999999999999999px]'
        disabled
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      />

      <div className='flex flex-wrap-reverse justify-between items-center gap-[20px] px-[40px] py-[10px]'>
        <input
          type='number'
          placeholder='Thời gian đọc (phút)'
          className='focus:ring-1 focus:ring-primary flex-1 max-w-[185px]'
          value={readTime}
          onChange={(e) => setReadTime(Number(e.target.value))}
          required
        />

        <input
          type='text'
          placeholder='Tiêu đề của bài viêt'
          className='focus:ring-1 focus:ring-primary flex-1 max-w-[500px]'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className='space-x-4 ml-auto'>
          <button
            onClick={() => navigate('/')}
            className='w-[120px] h-[40px] text-primary ring-1 ring-primary hover:bg-lightPrimary'>
            Thoát
          </button>
          <button
            onClick={handlePost}
            className='w-[120px] h-[40px] bg-primary text-white ring-1 ring-primary hover:bg-darkPrimary hover:ring-darkPrimary'>
            Đăng
          </button>
        </div>
      </div>

      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperStyle={{
          overflow: 'auto',
          height: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
        editorStyle={{ flex: 1 }}
        editorClassName='shadow-sm px-[20px]'
        placeholder='Hãy viết điều gì đó . . . '
        toolbar={toolbar}
        hashtag={{
          trigger: '#',
        }}
      />
    </>
  );
};

export default MyEditor;
