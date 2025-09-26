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
  setDoc
} from 'firebase/firestore';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid';
import { useDispatch } from 'react-redux';
import { openModal } from '../store/modalSlice';
import { useRouter } from 'next/navigation';

dayjs.extend(relativeTime);

export default function Comment({ comment, commentId, originalPostId }) {
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const timestamp = comment?.timestamp?.toDate
    ? comment.timestamp.toDate()
    : comment?.timestamp || null;

  // Listen for likes on this comment
  useEffect(() => {
    if (!commentId || !originalPostId) return;

    const unSubscribe = onSnapshot(
      collection(db, 'Posts', originalPostId, 'comments', commentId, 'likes'),
      (snapshot) => setLikes(snapshot.docs)
    );

    return () => unSubscribe();
  }, [originalPostId, commentId]);

  // Track if current user liked this comment
  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user.uid) !== -1
    );
  }, [likes, session?.user.uid]);

  // Like / Unlike comment
  async function likeComment() {
    if (!session) {
      signIn();
      return;
    }

    if (!commentId || !originalPostId) return;

    if (hasLiked) {
      await deleteDoc(
        doc(db, 'Posts', originalPostId, 'comments', commentId, 'likes', session.user.uid)
      );
    } else {
      await setDoc(
        doc(db, 'Posts', originalPostId, 'comments', commentId, 'likes', session.user.uid),
        { username: session.user.username }
      );
    }
  }

  // Delete comment
  async function deleteComment() {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteDoc(doc(db, 'Posts', originalPostId, 'comments', commentId));
    }
  }

  // Open modal for replying
  function commentOnPost() {
    const plainPost = {
      id: originalPostId,
      name: comment?.name,
      username: comment?.username,
      timestamp: comment?.timestamp
        ? comment.timestamp.toDate()?.toISOString()
        : null,
      text: comment?.comment,
      userImg: comment?.userImg
    };
    dispatch(openModal(plainPost));
  }

  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200 pl-20">
      {/* User image */}
      <img
        className="h-11 w-11 rounded-full mr-4"
        src={comment?.userImg}
        alt="User-Profile-Image"
      />

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 items-center whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
              {comment?.name}
            </h4>
            <span className="text-sm sm:text-[15px]">@{comment?.username} -</span>
            <span className="text-sm sm:text-[15px] hover:underline">
              {timestamp ? dayjs(timestamp).fromNow() : ''}
            </span>
          </div>
          <DotsHorizontalIcon className="h-10 w-10 hoverEffect p-2 hover:bg-sky-100 hover:text-sky-500" />
        </div>

        {/* Comment text */}
        <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
          {comment?.comment}
        </p>

        {/* Actions */}
        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center select-none">
            <ChatIcon
              onClick={commentOnPost}
              className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
            />
          </div>

          {session?.user.uid === comment?.userId && (
            <TrashIcon
              onClick={deleteComment}
              className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
            />
          )}

          <div className="flex items-center">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likeComment}
                className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"
              />
            ) : (
              <HeartIcon
                onClick={likeComment}
                className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
              />
            )}
            {likes?.length > 0 && (
              <span className={`${hasLiked && 'text-red-500'} text-sm`}>
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
