import { signOut } from 'firebase/auth';
import { FormEvent, useEffect, useState } from 'react';
import { BiEdit, BiSearch } from 'react-icons/bi';
import { BsBookmark } from 'react-icons/bs';
import { CgFileDocument } from 'react-icons/cg';
import { MdArrowBack, MdOutlineLogout } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks/reduxHooks';
import { useWindowSize } from '../app/hooks/useWindowSize';
import { setCurrentPost } from '../features/post/postSlice';
import {
  selectUser,
  selectUserLoading,
  setUser,
} from '../features/user/userSlice';
import { auth } from '../firebase';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const userLoading = useAppSelector(selectUserLoading);

  const size = useWindowSize();
  const isLaptopUp = size.width && size.width >= 768;

  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdown, setDropdown] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!search.trim()) return setSearch('');

    navigate(`/search?q=${search}`);
  }

  function closeDropdown() {
    setDropdown(false);
  }

  useEffect(() => {
    if (isLaptopUp) setIsSearching(false);
  }, [isLaptopUp]);

  useEffect(() => {
    if (dropdown) window.addEventListener('click', closeDropdown);
    else window.removeEventListener('click', closeDropdown);

    return () => window.removeEventListener('click', closeDropdown);
  }, [dropdown]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-[60px] 
      z-40 border-b-[1px] bg-white
      ${isLaptopUp ? 'px-[40px] gap-[20px]' : 'px-[20px]'}`}>
      <div className='max-w-[1200px] h-full mx-auto my-auto flex items-center justify-between'>
        {!isSearching && (
          <div
            className='flex text-[20px] cursor-pointer select-none'
            onClick={() => navigate('/')}>
            <div className='text-[#48c2e0] relative font-semibold font-p'>
              <div>p</div>
              <div className='absolute bottom-[8px] left-0 h-[1px]'>^</div>
            </div>
            <div className='font-arial'>ige</div>
          </div>
        )}

        {isSearching && (
          <button
            className='rounded-[10px] text-[24px] h-[45px] flex justify-center items-center w-[45px] hover:bg-slate-100 mr-[3px]'
            onClick={() => setIsSearching(false)}>
            <MdArrowBack />
          </button>
        )}
        <form
          onSubmit={handleSubmit}
          className={`flex flex-1 h-[45px] md:max-w-[500px] mr-[10px]
            ${
              isSearching || isLaptopUp
                ? 'border-[1px] justify-between'
                : 'border-none justify-end'
            }
            `}>
          {(isSearching || isLaptopUp) && (
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type='text'
              placeholder='Nhập từ khoá'
              className='flex-1 form-control'
              autoFocus={isSearching}
            />
          )}

          <button
            className={`w-[45px] text-[24px] ${
              isSearching || isLaptopUp
                ? 'bg-primary text-white ring-primary ring-1'
                : 'hover:bg-slate-100 rounded-[10px]'
            }`}
            onClick={() => {
              if (isLaptopUp) return;
              setIsSearching(true);
            }}>
            <BiSearch className='mx-auto' />
          </button>
        </form>

        {userLoading && (
          <div className='flex items-center gap-[10px]'>
            <button className='rounded-[10px] w-[45px] h-[45px] flex justify-center items-center hover:bg-slate-100'>
              <BsBookmark size={25} />
            </button>
            <button className='rounded-[10px] w-[45px] h-[45px] flex justify-center items-center hover:bg-slate-100'>
              <BiEdit size={30} />
            </button>

            <div className='relative'>
              <img
                src={localStorage.getItem('photoURL') || 'random'}
                alt='avatar'
                className='rounded-full cursor-pointer'
                height={40}
                width={40}
              />
            </div>
          </div>
        )}

        {!isSearching && !userLoading && (
          <>
            {!user && (
              <Link to='/sign-in' className='cursor-pointer hover:text-primary'>
                Đăng nhập/ Đăng ký
              </Link>
            )}

            {user && (
              <>
                <div className='flex items-center gap-[10px]'>
                  <button
                    title='Bài viết đã lưu'
                    onClick={() => navigate('/bookmark')}
                    className='rounded-[10px] w-[45px] h-[45px] flex justify-center items-center hover:bg-slate-100'>
                    <BsBookmark size={25} />
                  </button>
                  <button
                    title='Viết bài'
                    onClick={() => {
                      dispatch(setCurrentPost(null));
                      navigate('/new-post');
                    }}
                    className='rounded-[10px] w-[45px] h-[45px] flex justify-center items-center hover:bg-slate-100'>
                    <BiEdit size={30} />
                  </button>

                  <div className='relative'>
                    <img
                      src={user.photoURL || '/default-avatar.jpg'}
                      alt='avatar'
                      className='rounded-full cursor-pointer'
                      height={40}
                      width={40}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdown(!dropdown);
                      }}
                    />

                    {dropdown && (
                      <>
                        <div className='absolute min-w-[240px] right-0 border bg-white py-[5px] rounded-lg'>
                          <Link
                            to='/my-posts'
                            className={`px-[20px] flex items-center space-x-[5px] text-[18px] h-[40px] cursor-pointer hover:bg-slate-100`}>
                            <span className='min-w-[30px]'>
                              <CgFileDocument />
                            </span>
                            <span>Bài viết của bạn</span>
                          </Link>
                          <div
                            onClick={async () => {
                              localStorage.removeItem('photoURL');
                              await signOut(auth);
                              dispatch(setUser(null));
                              navigate('/sign-in');
                            }}
                            className='px-[20px] flex items-center space-x-[5px] text-[18px] h-[40px] cursor-pointer hover:bg-slate-100'>
                            <span className='min-w-[30px]'>
                              <MdOutlineLogout />
                            </span>
                            <span>Đăng xuất</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
