import { signInWithPopup } from 'firebase/auth';
import { addDoc } from 'firebase/firestore';
import React from 'react';
import { BsFacebook } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks/reduxHooks';
import { showAlert } from '../features/alert/alertSlice';
import { setUser, User } from '../features/user/userSlice';
import {
  auth,
  facebookProvider,
  getUserWithUID,
  googleProvider,
  usersCollectionRef,
} from '../firebase';

const SignInWithSocial = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const signInWithSocial = async (provider: 'facebook' | 'google') => {
    const socialProvider =
      provider === 'facebook' ? facebookProvider : googleProvider;

    signInWithPopup(auth, socialProvider)
      .then(async (res) => {
        if (res.user) {
          const { uid, displayName, email, photoURL } = res.user;

          const userFromDB = await getUserWithUID(uid);

          if (!userFromDB) {
            const newUser = {
              uid,
              displayName,
              email,
              photoURL,
              posts: [],
              likes: [],
              savedPosts: [],
            } as User;

            const { id } = await addDoc(usersCollectionRef, newUser);

            dispatch(setUser({ ...newUser, documentID: id }));
            dispatch(
              showAlert({
                type: 'success',
                message: `Chào mừng ${displayName} đến với pige`,
              }),
            );
          } else {
            dispatch(setUser(userFromDB));
            dispatch(
              showAlert({ type: 'success', message: 'Chào mừng trở lại' }),
            );
          }
          navigate('/');
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.code === 'auth/account-exists-with-different-credential') {
          dispatch(
            showAlert({
              type: 'error',
              message:
                'Email đã được đăng ký. Vui lòng đăng nhập lại bằng cách khác.',
            }),
          );
        }
      });
  };

  return (
    <div className='flex justify-center gap-[10px]'>
      <button
        onClick={() => signInWithSocial('facebook')}
        type='button'
        className='ring-1 ring-slate-400 h-[40px] w-[40px] text-[25px] flex justify-center items-center rounded-full'>
        <BsFacebook color='#4267B2' />
      </button>
      <button
        onClick={() => signInWithSocial('google')}
        type='button'
        className='ring-1 ring-slate-400 h-[40px] w-[40px] text-[25px] flex justify-center items-center rounded-full'>
        <FcGoogle />
      </button>
    </div>
  );
};

export default SignInWithSocial;
