import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc } from 'firebase/firestore';
import { FormEvent, MutableRefObject, useRef, useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { SiReact } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks/reduxHooks';
import SignInWithSocial from '../components/SignInWithSocial';
import { showAlert } from '../features/alert/alertSlice';
import { setUser, User } from '../features/user/userSlice';
import { auth, checkEmail, usersCollectionRef } from '../firebase';

const SignUp = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [displayNameError, setDisplayNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const displayNameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const confirmRef = useRef() as MutableRefObject<HTMLInputElement>;

  function resetError() {
    setDisplayNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
  }

  function checkEmpty() {
    let isValid = true;

    if (!displayName) {
      setDisplayNameError('Vui lòng nhập họ và tên');
      displayNameRef.current.focus();
      isValid = false;
    }

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

    if (!confirmPassword) {
      setConfirmError('Vui lòng nhập xác nhận mật khẩu');
      confirmRef.current.focus();
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmError('Mật khẩu không trùng khớp');
      confirmRef.current.focus();
      isValid = false;
    }

    return isValid;
  }

  function checkCondition() {
    let isValid = true;

    if (displayName.trim().length < 3) {
      setDisplayNameError('Vui lòng nhập họ và tên từ 3 ký tự trở lên');
      displayNameRef.current.focus();
      isValid = false;
    }

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

    if (await checkEmail(email)) {
      isValid = false;
      setEmailError('Email đã được đăng ký.');
      emailRef.current.focus();
    }

    if (isValid) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (res) => {
          if (res.user) {
            const { uid } = res.user;

            const newUser = {
              uid,
              displayName,
              email,
              posts: [],
            } as User;

            const { id } = await addDoc(usersCollectionRef, newUser);

            dispatch(setUser({ ...newUser, documentID: id }));
            dispatch(
              showAlert({
                type: 'success',
                message: `Chào mừng ${displayName} đến với pige`,
              }),
            );

            navigate('/');
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
        <div className='text-[27px]'>Đăng ký</div>

        <div className='flex flex-col space-y-[10px]'>
          <input
            ref={displayNameRef}
            className={`form-control ${displayNameError && 'input-error'}`}
            type='text'
            placeholder='Họ và tên của bạn'
            autoFocus
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              setDisplayNameError('');
            }}
          />

          {displayNameError && (
            <div className='error-message'>{displayNameError}</div>
          )}

          <input
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

          <input
            ref={confirmRef}
            className={`form-control ${confirmError && 'input-error'}`}
            type='password'
            placeholder='Xác nhận mật khẩu'
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmError('');
            }}
          />

          {confirmError && <div className='error-message'>{confirmError}</div>}
        </div>

        <div>
          <button
            className={`${
              loading ? 'bg-slate-400' : 'bg-primary'
            } flex justify-center items-center mx-auto gap-2 text-white hover:bg-darkPrimary w-[80%] h-[40px] rounded-[7px]`}>
            {loading && <SiReact fontSize={25} className='animate-spin' />}
            Đăng ký
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
            to='/sign-in'
            className='ml-[10px] text-primary font-semibold hover:underline'>
            Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
