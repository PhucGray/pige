const Sidebar = () => {
  return (
    <div className='min-w-[300px] hidden lg:block'>
      <div className='text-[20px] font-semibold flex items-center gap-[20px]'>
        <div>Mục lục</div>
        <div className='h-[2px] flex-1 bg-gray-300'></div>
      </div>

      <div className='pl-[10px] mt-[15px]'>
        <div className='font-semibold cursor-pointer hover:text-primary'>
          Lorem Ipsum is simply dummy
        </div>

        <div className='font-semibold cursor-pointer hover:text-primary'>
          Lorem Ipsum is simply dummy
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
