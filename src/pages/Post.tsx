import { BsBookmarkPlus } from 'react-icons/bs';
import Sidebar from '../components/Post/Sidebar';

const Post = () => {
  return (
    <>
      <div className='mt-[30px] mx-auto flex gap-[30px] px-[20px] max-w-[1200px]'>
        <div>
          <div className='flex items-center gap-[20px]'>
            <img
              src='https://firebasestorage.googleapis.com/v0/b/music-7bb30.appspot.com/o/Anh%20l%C3%A0m%20g%C3%AC%20sai.png?alt=media&token=fdd0c825-6b19-4fd1-bb6a-a06b6b9f1534'
              alt='awf'
              height={40}
              width={40}
              className='rounded-full'
            />

            <div>
              <div className='font-semibold'>Nguyễn Văn A</div>
              <div className='flex items-center gap-[10px]'>
                <div>12/08/2022</div>
                <div>-</div>
                <div>4 phút đọc</div>
              </div>
            </div>

            <BsBookmarkPlus className='ml-auto text-[24px]  hover:scale-125 cursor-pointer' />
          </div>

          <div className='mt-[20px] text-[35px] font-semibold'>
            Bạn nên lưu JSON Web Token (JWT) ở đâu ?
          </div>

          <div className='mb-[20px]'>
            <div className='text-[25px] font-semibold'>
              Lorem Ipsum is simply dummy
            </div>
            <div>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry{'`'}s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged
            </div>
          </div>

          <div className='mb-[20px]'>
            <div className='text-[25px] font-semibold'>
              Lorem Ipsum is simply dummy
            </div>
            <div>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry{'`'}s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged
            </div>
          </div>

          <div className='mb-[20px]'>
            <div className='text-[25px] font-semibold'>
              Lorem Ipsum is simply dummy
            </div>
            <div>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry{'`'}s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged
            </div>
          </div>

          <div className='mb-[20px]'>
            <div className='text-[25px] font-semibold'>
              Lorem Ipsum is simply dummy
            </div>
            <div>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry{'`'}s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged
            </div>
          </div>

          <div className='mb-[20px]'>
            <div className='text-[25px] font-semibold'>
              Lorem Ipsum is simply dummy
            </div>
            <div>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry{'`'}s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged
            </div>
          </div>
        </div>

        <Sidebar />
      </div>
    </>
  );
};

export default Post;
