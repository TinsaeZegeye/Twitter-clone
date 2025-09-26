'use client';

import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon
} from '@heroicons/react/outline';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid';
import { useDispatch } from 'react-redux';
import { openModal } from '../store/modalSlice';
import { useRouter } from 'next/navigation';

dayjs.extend(relativeTime);

export default function Post({ post, id, isSinglePage }) {
  const timestamp = post?.data()?.timestamp?.toDate();
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const likesUnsubscribe = onSnapshot(
      collection(db, 'Posts', id, 'likes'),
      (snapshot) => setLikes(snapshot.docs)
    );

    return () => likesUnsubscribe();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const commentsQuery = query(
      collection(db, 'Posts', id, 'comments'),
      orderBy('timestamp', 'desc')
    );

    const commentsUnsubscribe = onSnapshot(commentsQuery, (snapshot) =>
      setComments(snapshot.docs)
    );

    return () => commentsUnsubscribe();
  }, [id]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === session?.user.uid) !== -1);
  }, [likes, session]);

  async function likePost() {
    if (!session) {
      signIn();
      return;
    }

    if (!id) return;

    if (hasLiked) {
      await deleteDoc(doc(db, 'Posts', id, 'likes', session?.user.uid));
    } else {
      await setDoc(doc(db, 'Posts', id, 'likes', session?.user.uid), {
        username: session?.user.username
      });
    }
  }

  async function deletePost() {
    if (window.confirm('Are you sure you want to delete the post?')) {
      await deleteDoc(doc(db, 'Posts', id));
      router.push('/');
    }
  }

  function commentOnPost() {
    if (!session) {
      signIn();
      return;
    }

    const plainPost = {
      id: post?.id,
      name: post?.data()?.name,
      username: post?.data()?.username,
      timestamp: post?.data()?.timestamp
        ? post.data()?.timestamp.toDate()?.toISOString()
        : null,
      text: post?.data()?.text,
      userImg: post?.data()?.userImg
    };

    dispatch(openModal(plainPost));
  }

  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200">
      {/* Main div for post section */}
      <img
        className="h-11 w-11 rounded-full mr-4"
        src={post?.data()?.userImg}
        alt="User-Profile-Image"
      />

      <div>
        {/* Right section */}
        <div className="flex items-center justify-between">
          {/* Post header part */}
          <div className="flex space-x-2 items-center whitespace-nowrap">
            {/* User Info part */}
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
              {post?.data()?.name}
            </h4>
            <span className="text-sm sm:text-[15px]">@{post?.data()?.username} -</span>
            <span className="text-sm sm:text-[15px] hover:underline">
              {timestamp ? dayjs(timestamp).fromNow() : ''}
            </span>
          </div>

          <DotsHorizontalIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2" />
        </div>

        {/* Post Text */}
        <p
          onClick={() => router.push(`/posts/${id}`)}
          className="text-gray-800 text-[15px] sm:text-[16px] mb-2"
        >
          {post?.data()?.text}
        </p>

        {/* Post image */}
        {post?.data()?.imageUrl && (
          <img
            onClick={() => router.push(`/posts/${id}`)}
            className="rounded-2xl mr-4 aspect-square "
            src={post?.data()?.imageUrl}
            alt="Post image"
          />
        )}

        <div className="flex justify-between text-gray-500 p-2">
          {/* Post Reaction icons */}
          <div className="flex items-center select-none">
            <ChatIcon
              onClick={()=>commentOnPost()}
              className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
            />
            {!isSinglePage && comments?.length > 0 && <span className="text-sm">{comments.length}</span>}
          </div>

          {session?.user.uid === post?.data()?.userID && (
            <TrashIcon
              onClick={deletePost}
              className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
            />
          )}

          <div className="flex items-center">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likePost}
                className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"
              />
            ) : (
              <HeartIcon
                onClick={likePost}
                className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
              />
            )}
            {likes?.length > 0 && (
              <span className={`${hasLiked ? 'text-red-500' : ''} text-sm`}>
                {likes.length}
              </span>
            )}
          </div>

          <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
          <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
        </div>
      </div>
    </div>
  );
}
