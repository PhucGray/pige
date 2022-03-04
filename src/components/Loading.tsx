import { FaSpinner } from 'react-icons/fa';

const Loading = () => {
  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center'>
      <FaSpinner className='animate-spin text-primary text-[30px]' />
      <div className='font-semibold text-[20px]'>Đang đăng nhập . . .</div>
    </div>
  );
};

export default Loading;
