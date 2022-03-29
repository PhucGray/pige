import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FormEvent, MutableRefObject, useRef, useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { SiReact } from 'react-icons/si';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks/reduxHooks';
import SignInWithSocial from '../components/SignInWithSocial';
import { showAlert } from '../features/alert/alertSlice';
import { setUser } from '../features/user/userSlice';
import { auth, checkEmail, getUserWithUID } from '../firebase';

const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError('Vui lòng nhập email');
      emailRef.current.focus();
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, email, {
        url: window.location.href,
      });

      dispatch(
        showAlert({
          type: 'success',
          message: `Yêu cầu đã được gửi. Vui lòng kiểm tra lại email: ${email}`,
        }),
      );

      navigate('/sign-in');
    } catch (error) {
      console.log(error);
      setEmailError('Email không tồn tại');
      emailRef.current.focus();
    }

    setLoading(false);
  }

  return (
    <div className='pt-[20px] px-[20px] md:px-[40px]'>
      <Link
        to='/'
        className='flex items-center gap-[10px] w-fit p-[10px] hover:bg-slate-100'>
        <MdArrowBack /> Trở lại trang chủ
      </Link>

      <form
        onSubmit={handleSubmit}
        className='text-center max-w-[400px] mx-auto space-y-[15px]'>
        <div className='text-[27px]'>Quên mật khẩu</div>

        <input
          autoFocus
          ref={emailRef}
          className={`form-control w-full ${emailError && 'input-error'}`}
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
          }}
        />

        {emailError && <div className='error-message'>{emailError}</div>}

        <div>
          <button
            className={`${
              loading ? 'bg-slate-400' : 'bg-primary'
            } flex justify-center items-center mx-auto gap-2 text-white hover:bg-darkPrimary w-full h-[40px] rounded-[7px]`}>
            {loading && <SiReact fontSize={25} className='animate-spin' />}
            Gửi yêu cầu
          </button>
        </div>

        <div className='flex items-center gap-[20px] px-[20px]'>
          <div className='bg-slate-400 h-[1px] flex-1'></div>
          <div>hoặc đăng nhập với</div>
          <div className='bg-slate-400 h-[1px] flex-1'></div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
