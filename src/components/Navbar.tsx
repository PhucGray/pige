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
import { selectLoading, selectUser, setUser } from '../features/user/userSlice';
import { auth } from '../firebase';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectLoading);

  const size = useWindowSize();
  const isLaptopUp = size.width && size.width >= 768;

  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!search.trim()) return setSearch('');

    navigate(`/search?q=${search}`);
  }

  useEffect(() => {
    if (isLaptopUp) setIsSearching(false);
  }, [isLaptopUp]);

  return (
    <div
      className={`flex items-center justify-between min-h-[57px] z-50 border-b-[1px] ${
        isLaptopUp ? 'px-[40px] gap-[20px]' : 'px-[20px]'
      } sticky top-0 bg-white`}>
      {!isSearching && <Link to='/'>pige</Link>}
      {isSearching && (
        <button
          className='rounded-[10px] text-[24px] h-[45px] flex justify-center items-center w-[45px] hover:bg-slate-100 mr-[3px]'
          onClick={() => setIsSearching(false)}>
          <MdArrowBack />
        </button>
      )}
      <form
        onSubmit={handleSubmit}
        className={`flex flex-1 h-[45px] max-w-[500px] mr-[10px]
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

      {loading && <>.</>}

      {!isSearching && !loading && (
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
                  onClick={() => navigate('/bookmark')}
                  className='rounded-[10px] w-[45px] h-[45px] flex justify-center items-center hover:bg-slate-100'>
                  <BsBookmark size={25} />
                </button>
                <button
                  onClick={() => {
                    dispatch(setCurrentPost(null));
                    navigate('/new-post');
                  }}
                  className='rounded-[10px] w-[45px] h-[45px] flex justify-center items-center hover:bg-slate-100'>
                  <BiEdit size={30} />
                </button>

                <div className='relative group'>
                  <img
                    src={user.photoURL || '/default-avatar.jpg'}
                    alt='awf'
                    height={40}
                    width={40}
                    className='rounded-full'
                  />

                  <div className='absolute min-w-[240px] right-0 border bg-white py-[5px] rounded-lg hidden group-hover:block'>
                    <Link
                      to='/my-posts'
                      className='px-[20px] flex items-center space-x-[5px] text-[18px] h-[40px] cursor-pointer hover:bg-slate-100'>
                      <span className='min-w-[30px]'>
                        <CgFileDocument />
                      </span>
                      <span>Bài viết của bạn</span>
                    </Link>
                    <div
                      onClick={async () => {
                        await signOut(auth);
                        navigate('/sign-in');
                        dispatch(setUser(null));
                      }}
                      className='px-[20px] flex items-center space-x-[5px] text-[18px] h-[40px] cursor-pointer hover:bg-slate-100'>
                      <span className='min-w-[30px]'>
                        <MdOutlineLogout />
                      </span>
                      <span>Đăng xuất</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Navbar;
