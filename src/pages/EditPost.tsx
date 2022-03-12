import MyEditor from '../components/NewPost/MyEditor';

const EditPost = () => {
  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      <MyEditor action='edit' />
    </div>
  );
};

export default EditPost;
