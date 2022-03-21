import { useEffect } from 'react';
import { RiCheckFill, RiCloseFill } from 'react-icons/ri';
import { useAppDispatch, useAppSelector } from '../app/hooks/reduxHooks';
import { closeAlert, selectAlert } from '../features/alert/alertSlice';

const Alert = () => {
  const dispatch = useAppDispatch();
  const alert = useAppSelector(selectAlert);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(closeAlert());
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div
        className={`fixed top-[40px] left-[50%] translate-x-[-50%] w-[90%] max-w-[500px] z-50 
        ${alert.alert?.type === 'success' ? 'bg-green-600' : 'bg-red-500'}
        text-white animate-disappear`}>
        <div
          className={`${
            alert.alert?.type === 'success' ? 'bg-green-800' : 'bg-red-700'
          }
        h-[40px] w-[40px] rounded-full text-[30px] absolute top-[-20px] left-[10px] grid place-items-center`}>
          {alert.alert?.type === 'success' ? <RiCheckFill /> : <RiCloseFill />}
        </div>
        <div className='px-[60px] py-[10px]'>
          <div className='text-[25px] font-bold'>
            {alert.alert?.type === 'success' && 'Thông báo !'}
            {alert.alert?.type === 'error' && 'Lỗi !'}
          </div>
          <div>{alert.alert?.message}</div>
        </div>

        <RiCloseFill
          onClick={() => dispatch(closeAlert())}
          className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer'
        />

        <div
          className={`
        ${alert.alert?.type === 'success' ? 'bg-green-300' : 'bg-red-300'}
        h-[8px] w-full absolute bottom-0 left-0 animate-count-down`}
        />
      </div>
    </>
  );
};

export default Alert;
