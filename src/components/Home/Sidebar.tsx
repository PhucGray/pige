import { BsSuitHeartFill } from 'react-icons/bs';

const Sidebar = () => {
  return (
    <div className='w-[320px] hidden lg:block'>
      <div className='text-[20px] font-semibold flex items-center gap-[20px]'>
        <div>Bài viết phổ biến</div>
        <div className='h-[2px] flex-1 bg-gray-300'></div>
      </div>

      <div className='group cursor-pointer border-b-[1px] mt-[20px] pl-[10px]'>
        <div>
          <div className='font-semibold group-hover:text-primary'>
            Triển khai chức năng đăng nhập với React.js và Firebase
          </div>
          <div className='flex items-center space-x-2'>
            <BsSuitHeartFill />
            <div>220</div>
          </div>
          <div>Trần Văn B</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
