interface SidebarProps {
  tableOfContents: string[];
}

const Sidebar = ({ tableOfContents }: SidebarProps) => {
  return (
    <div className='min-w-[300px] hidden lg:block sticky top-[57px] h-full max-h-[80vh] overflow-y-auto pb-[100px]'>
      <div className='text-[20px] font-semibold flex items-center gap-[20px]'>
        <div>Mục lục</div>
        <div className='h-[2px] flex-1 bg-gray-300'></div>
      </div>

      <div className='pl-[10px] mt-[15px]'>
        {tableOfContents &&
          tableOfContents.map((i, index) => (
            <div>
              <a
                href={`#${i}`}
                key={i + index}
                className='font-semibold cursor-pointer hover:text-primary'>
                {i}
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
