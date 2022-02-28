import { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { MdArrowBack } from 'react-icons/md';
import { useWindowSize } from '../app/hooks/useWindowSize';
import { BsBookmark } from 'react-icons/bs';
import { BiEdit } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isSearching, setIsSearching] = useState(false);

  const size = useWindowSize();
  const isLaptopUp = size.width && size.width >= 768;

  useEffect(() => {
    if (isLaptopUp) setIsSearching(false);
  }, [isLaptopUp]);

  return (
    <div
      className={`flex items-center justify-between min-h-[57px] border-b-[1px] ${
        isLaptopUp ? 'px-[40px] gap-[20px]' : 'px-[20px]'
      }`}>
      {!isSearching && <Link to='/'>pige</Link>}

      {isSearching && (
        <button
          className='text-[24px] h-[45px] flex justify-center items-center w-[45px] hover:bg-slate-50'
          onClick={() => setIsSearching(false)}>
          <MdArrowBack />
        </button>
      )}

      <div
        className={`flex flex-1 h-[45px] max-w-[500px] mr-[10px]
            ${
              isSearching || isLaptopUp
                ? 'border-[1px] justify-between'
                : 'border-none justify-end'
            }
            `}>
        {(isSearching || isLaptopUp) && (
          <input
            type='text'
            placeholder='Nhập từ khoá'
            className='flex-1'
            autoFocus={isSearching}
          />
        )}

        <button
          className={`w-[45px] text-[24px] ${
            isSearching || isLaptopUp
              ? 'bg-primary text-white ring-primary ring-1'
              : 'hover:bg-slate-50'
          }`}
          onClick={() => {
            if (isLaptopUp) return;
            setIsSearching(true);
          }}>
          <BiSearch className='mx-auto' />
        </button>
      </div>

      {!isSearching && (
        <>
          <Link to='/sign-in' className='cursor-pointer hover:text-primary'>
            Đăng nhập/ Đăng ký
          </Link>

          <div className='flex items-center gap-[10px]'>
            <button className='w-[45px] h-[45px] flex justify-center items-center hover:bg-slate-50'>
              <BsBookmark size={25} />
            </button>
            <button className='w-[45px] h-[45px] flex justify-center items-center hover:bg-slate-50'>
              <Link to='/new-post'>
                <BiEdit size={30} />
              </Link>
            </button>
            <img
              src='https://firebasestorage.googleapis.com/v0/b/music-7bb30.appspot.com/o/Anh%20l%C3%A0m%20g%C3%AC%20sai.png?alt=media&token=fdd0c825-6b19-4fd1-bb6a-a06b6b9f1534'
              alt='awf'
              height={40}
              width={40}
              className='rounded-full'
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
