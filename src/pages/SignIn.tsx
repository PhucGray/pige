import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { addDoc } from 'firebase/firestore';
import { FormEvent, MutableRefObject, useRef, useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { SiReact } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks/reduxHooks';
import SignInWithSocial from '../components/SignInWithSocial';
import { showAlert } from '../features/alert/alertSlice';
import { setUser, User } from '../features/user/userSlice';
import {
  auth,
  checkEmail,
  getUserWithUID,
  usersCollectionRef,
} from '../firebase';

const SignIn = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;

  function resetError() {
    setEmailError('');
    setPasswordError('');
  }

  function checkEmpty() {
    let isValid = true;

    if (!email) {
      setEmailError('Vui lòng nhập email');
      emailRef.current.focus();
      isValid = false;
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      passwordRef.current.focus();
      isValid = false;
    }

    return isValid;
  }

  function checkCondition() {
    let isValid = true;

    if (password.trim().length < 6) {
      setPasswordError('Vui lòng nhập mật khẩu từ 6 ký tự trở lên');
      passwordRef.current.focus();
      isValid = false;
    }

    return isValid;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    resetError();

    let isValid: boolean;

    isValid = checkEmpty();
    isValid = checkCondition();

    if (isValid) {
      signInWithEmailAndPassword(auth, email, password)
        .then(async (res) => {
          if (res.user) {
            const { uid } = res.user;

            const userFromDB = await getUserWithUID(uid);

            dispatch(setUser(userFromDB));

            dispatch(
              showAlert({
                type: 'success',
                message: `Chào mừng trở lại`,
              }),
            );

            navigate('/');
          }
        })
        .catch((error) => {
          console.log(error);
          if (
            error.code === 'auth/user-not-found' ||
            error.code === 'auth/wrong-password'
          ) {
            setPasswordError('Email hoặc mật khẩu không chính xác');
            passwordRef.current.focus();
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
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
        <div className='text-[27px]'>Đăng nhập</div>

        <div className='flex flex-col space-y-[15px]'>
          <input
            autoFocus
            ref={emailRef}
            className={`form-control ${emailError && 'input-error'}`}
            type='text'
            placeholder='Email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
          />

          {emailError && <div className='error-message'>{emailError}</div>}

          <input
            ref={passwordRef}
            className={`form-control ${passwordError && 'input-error'}`}
            type='password'
            placeholder='Mật khẩu'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError('');
            }}
          />

          {passwordError && (
            <div className='error-message'>{passwordError}</div>
          )}
        </div>

        <Link
          to='forgot-password'
          className='mt-[10px] flex justify-end hover:text-primary'>
          Quên mật khẩu ?
        </Link>

        <div>
          <button
            className={`${
              loading ? 'bg-slate-400' : 'bg-primary'
            } flex justify-center items-center mx-auto gap-2 text-white hover:bg-darkPrimary w-[80%] h-[40px] rounded-[7px]`}>
            {loading && <SiReact fontSize={25} className='animate-spin' />}
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
