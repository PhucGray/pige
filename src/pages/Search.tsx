import { getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks/reduxHooks';
import PostsList from '../components/PostsList';
import { selectUser } from '../features/user/userSlice';
import { postsCollectionRef } from '../firebase';
import { PostType } from '../types';

const Search = () => {
  const user = useAppSelector(selectUser);

  const [params] = useSearchParams();
  const keyword = params.get('q');
  const [posts, setPosts] = useState([] as PostType[]);

  async function getPosts() {
    const q = query(
      postsCollectionRef,
      where('searchKeywords', 'array-contains', keyword?.toLocaleLowerCase()),
    );
    const postsDocs = await getDocs(q);

    if (postsDocs.empty) {
      setPosts([]);
    } else {
      const posts = [] as PostType[];

      postsDocs.docs.forEach((doc) => {
        const postData = doc.data() as PostType;
        const postID = doc.id;

        posts.push({
          ...postData,
          documentID: postID,
          displayName: user?.displayName,
          photoURL: user?.photoURL,
        });
      });

      setPosts(posts);
    }
  }

  useEffect(() => {
    if (keyword) {
      getPosts();
    }
  }, [params]);

  return (
    <div className='w-full max-w-[1200px] mx-auto'>
      <p className='mt-[20px] text-[30px]'>
        Tìm kiếm cho: <span className='font-bold'>{keyword}</span>
      </p>

      <div>
        <PostsList postsProps={posts} />
      </div>
    </div>
  );
};

export default Search;
