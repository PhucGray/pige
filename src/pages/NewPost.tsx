import { useEffect } from 'react';
import MyEditor from '../components/NewPost/MyEditor';

const NewPost = () => {
  useEffect(() => {
    document.title = 'Viết bài';
  }, []);
  return (
    <>
      <MyEditor action='add' />
    </>
  );
};

export default NewPost;
