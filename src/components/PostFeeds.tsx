import { BsBookmarkPlus } from 'react-icons/bs';
import { useAppSelector } from '../app/hooks/reduxHooks';
import { selectPosts } from '../features/post/postSlice';
import moment from 'moment';
import { getUserWithUID } from '../firebase';
import { selectLoading } from '../features/user/userSlice';
import Loading from './Loading';

const PostFeeds = () => {
  const posts = useAppSelector(selectPosts);
  const loading = useAppSelector(selectLoading);

  if (loading)
    return (
      <div className='flex-1 overflow-auto'>
        <Loading />
      </div>
    );

  return (
    <div className='flex-1 overflow-auto'>
      {posts &&
        posts.map(
          ({
            createdAt,
            readTime,
            title,
            documentID,
            displayName,
            photoURL,
          }) => {
            return (
              <div
                key={documentID}
                className='border-b-[1px] mb-[30px] p-[10px] hover:shadow-md cursor-pointer'
                onClick={() => {}}>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-[10px]'>
                    <img
                      src={photoURL}
                      alt='awf'
                      height={40}
                      width={40}
                      className='rounded-full'
                    />

                    <div className='font-semibold'>{displayName}</div>

                    <div>-</div>

                    <div className='text-gray-400'>
                      {moment(createdAt).format('L')}
                    </div>
                  </div>

                  <BsBookmarkPlus
                    className='text-[22px] md:text-[25px] hover:scale-125'
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </div>

                <div className='text-[20px] font-semibold'>{title}</div>

                {/* <div>
                  I have been designing and developing web applications for more
                  than 7 years. Through these years, I have been seen a lot of
                  authentication
                </div> */}

                <div className='font-semibold'>{readTime} phút đọc</div>
              </div>
            );
          },
        )}

      {/* <div
        className='border-b-[1px] mb-[30px] p-[10px] hover:shadow-md cursor-pointer'
        onClick={() => {}}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-[10px]'>
            <img
              src='https://firebasestorage.googleapis.com/v0/b/music-7bb30.appspot.com/o/Anh%20l%C3%A0m%20g%C3%AC%20sai.png?alt=media&token=fdd0c825-6b19-4fd1-bb6a-a06b6b9f1534'
              alt='awf'
              height={40}
              width={40}
              className='rounded-full'
            />

            <div className='font-semibold'>Nguyễn Văn A</div>

            <div>-</div>

            <div className='text-gray-400'>12/08/2022</div>
          </div>

          <BsBookmarkPlus
            className='text-[22px] md:text-[25px] hover:scale-125'
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>

        <div className='text-[20px] font-semibold'>
          Bạn nên lưu JSON Web Token (JWT) ở đâu ?
        </div>

        <div>
          I have been designing and developing web applications for more than 7
          years. Through these years, I have been seen a lot of authentication
        </div>

        <div className='font-semibold'>4 phút đọc</div>
      </div>

      <div
        className='border-b-[1px] mb-[30px] p-[10px] hover:shadow-md cursor-pointer'
        onClick={() => {}}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-[10px]'>
            <img
              src='https://firebasestorage.googleapis.com/v0/b/music-7bb30.appspot.com/o/Anh%20l%C3%A0m%20g%C3%AC%20sai.png?alt=media&token=fdd0c825-6b19-4fd1-bb6a-a06b6b9f1534'
              alt='awf'
              height={40}
              width={40}
              className='rounded-full'
            />

            <div className='font-semibold'>Nguyễn Văn A</div>

            <div>-</div>

            <div className='text-gray-400'>12/08/2022</div>
          </div>

          <BsBookmarkPlus
            className='text-[22px] md:text-[25px] hover:scale-125'
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>

        <div className='text-[20px] font-semibold'>
          Bạn nên lưu JSON Web Token (JWT) ở đâu ?
        </div>

        <div>
          I have been designing and developing web applications for more than 7
          years. Through these years, I have been seen a lot of authentication
        </div>

        <div className='font-semibold'>4 phút đọc</div>
      </div>

      <div
        className='border-b-[1px] mb-[30px] p-[10px] hover:shadow-md cursor-pointer'
        onClick={() => {}}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-[10px]'>
            <img
              src='https://firebasestorage.googleapis.com/v0/b/music-7bb30.appspot.com/o/Anh%20l%C3%A0m%20g%C3%AC%20sai.png?alt=media&token=fdd0c825-6b19-4fd1-bb6a-a06b6b9f1534'
              alt='awf'
              height={40}
              width={40}
              className='rounded-full'
            />

            <div className='font-semibold'>Nguyễn Văn A</div>

            <div>-</div>

            <div className='text-gray-400'>12/08/2022</div>
          </div>

          <BsBookmarkPlus
            className='text-[22px] md:text-[25px] hover:scale-125'
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>

        <div className='text-[20px] font-semibold'>
          Bạn nên lưu JSON Web Token (JWT) ở đâu ?
        </div>

        <div>
          I have been designing and developing web applications for more than 7
          years. Through these years, I have been seen a lot of authentication
        </div>

        <div className='font-semibold'>4 phút đọc</div>
      </div> */}
    </div>
  );
};

export default PostFeeds;
