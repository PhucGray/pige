import { MdArrowBack } from 'react-icons/md';
import { BsFacebook } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className='pt-[20px] px-[20px] md:px-[40px]'>
      <Link to='/'>
        <a className='flex items-center gap-[10px] w-fit p-[10px] hover:bg-slate-50'>
          <MdArrowBack /> Trở lại trang chủ
        </a>
      </Link>

      <form className='text-center max-w-[400px] mx-auto space-y-[15px]'>
        <div className='text-[27px]'>Đăng ký</div>

        <div className='flex flex-col space-y-[15px]'>
          <input type='text' placeholder='Tên của bạn' autoFocus />
          <input type='text' placeholder='Email' />
          <input type='password' placeholder='Mật khẩu' />
          <input type='password' placeholder='Xác nhận mật khẩu' />
        </div>

        <div>
          <button className='bg-primary text-white hover:bg-darkPrimary w-[80%] h-[40px] rounded-[7px]'>
            Đăng ký
          </button>
        </div>

        <div className='flex items-center gap-[20px] px-[20px]'>
          <div className='bg-slate-400 h-[1px] flex-1'></div>
          <div>hoặc đăng nhập với</div>
          <div className='bg-slate-400 h-[1px] flex-1'></div>
        </div>

        <div className='flex justify-center gap-[10px]'>
          <button
            type='button'
            className='ring-1 ring-slate-400 h-[40px] w-[40px] text-[25px] flex justify-center items-center rounded-full'>
            <BsFacebook />
          </button>
          <button
            type='button'
            className='ring-1 ring-slate-400 h-[40px] w-[40px] text-[25px] flex justify-center items-center rounded-full'>
            <FcGoogle />
          </button>
        </div>

        <div>
          Chưa có tài khoản ?
          <Link to='/sign-in'>
            <a className='ml-[10px] text-primary font-semibold hover:underline'>
              Đăng nhập
            </a>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
