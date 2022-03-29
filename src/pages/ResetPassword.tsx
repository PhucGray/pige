import {
  confirmPasswordReset,
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

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const confirmRef = useRef() as MutableRefObject<HTMLInputElement>;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!password.trim()) {
      setPasswordError('Vui lòng nhập mật khẩu');
      passwordRef.current.focus();
      return;
    }

    if (!confirmPassword.trim()) {
      setConfirmError('Vui lòng nhập xác nhận mật khẩu');
      confirmRef.current.focus();
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError('Mật khẩu không trùng khớp');
      confirmRef.current.focus();
      return;
    }

    const oobCode = new URLSearchParams(location.search).get('oobCode');

    if (oobCode) {
      try {
        setLoading(true);

        await confirmPasswordReset(auth, oobCode, password);

        dispatch(
          showAlert({
            type: 'success',
            message: 'Lấy lại mật khẩu thành công',
          }),
        );

        navigate('/sign-in');
      } catch (error) {
        console.log(error);
      }
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
          ref={passwordRef}
          className={`form-control w-full ${passwordError && 'input-error'}`}
          type='password'
          placeholder='Mật khẩu'
          value={password}
          autoFocus
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError('');
          }}
        />

        {passwordError && <div className='error-message'>{passwordError}</div>}

        <input
          ref={confirmRef}
          className={`form-control w-full ${confirmError && 'input-error'}`}
          type='password'
          placeholder='Xác nhận mật khẩu'
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setConfirmError('');
          }}
        />

        {confirmError && <div className='error-message'>{confirmError}</div>}

        <div>
          <button
            className={`${
              loading ? 'bg-slate-400' : 'bg-primary'
            } flex justify-center items-center mx-auto gap-2 text-white hover:bg-darkPrimary w-full h-[40px] rounded-[7px]`}>
            {loading && <SiReact fontSize={25} className='animate-spin' />}
            Đổi mật khẩu
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
