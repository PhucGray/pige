import { FaSpinner } from 'react-icons/fa';

const Loading = () => {
  return (
    <FaSpinner className={`animate-spin text-primary mx-auto text-[40px]`} />
  );
};

export default Loading;
