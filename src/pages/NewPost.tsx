import { useEffect } from 'react';
import MyEditor from '../components/NewPost/MyEditor';

const NewPost = () => {
  useEffect(() => {
    document.title = 'Viết bài';
  }, []);
  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      <MyEditor action='add' />
    </div>
  );
};

export default NewPost;
