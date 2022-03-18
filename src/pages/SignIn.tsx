import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';
import SignInWithSocial from '../components/SignInWithSocial';

const SignIn = () => {
  return (
    <div className='pt-[20px] px-[20px] md:px-[40px]'>
      <Link
        to='/'
        className='flex items-center gap-[10px] w-fit p-[10px] hover:bg-slate-100'>
        <MdArrowBack /> Trở lại trang chủ
      </Link>

      <form className='text-center max-w-[400px] mx-auto space-y-[15px]'>
        <div className='text-[27px]'>Đăng nhập</div>

        <div className='flex flex-col space-y-[15px]'>
          <input type='text' placeholder='Email' autoFocus />
          <input type='password' placeholder='Mật khẩu' />
        </div>

        <Link
          to='forgot-password'
          className='mt-[10px] flex justify-end hover:text-primary'>
          Quên mật khẩu ?
        </Link>

        <div>
          <button className='bg-primary text-white hover:bg-darkPrimary w-[80%] h-[40px] rounded-[7px]'>
            Đăng nhập
          </button>
        </div>

        <div className='flex items-center gap-[20px] px-[20px]'>
          <div className='bg-slate-400 h-[1px] flex-1'></div>
          <div>hoặc đăng nhập với</div>
          <div className='bg-slate-400 h-[1px] flex-1'></div>
        </div>

        <SignInWithSocial />

        <div>
          Chưa có tài khoản ?
          <Link
            to='/sign-up'
            className='ml-[10px] text-primary font-semibold hover:underline'>
            Đăng ký
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
