'user client'

import { ChartBarIcon, ChatIcon, DotsHorizontalIcon, HeartIcon, ShareIcon, TrashIcon } from '@heroicons/react/outline'
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { collection, deleteDoc, doc, onSnapshot, setDoc, snapshotEqual } from 'firebase/firestore';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid';
import { useDispatch } from 'react-redux';
import { openModal, toggleModal } from '../store/modalSlice';
import { Poltawski_Nowy } from 'next/font/google';
import { useRouter } from 'next/router';


dayjs.extend(relativeTime)

export default function Comment({ comment, commentId, originalPostId }) {
  const timestamp = post.data().timestamp?.toDate();
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);
    const { data: session } = useSession();
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const unSubscribe = onSnapshot(
            collection(db, 'Posts', originalPostId, "comments", commentId, 'likes'), (snapshot)=>setLikes(snapshot.docs)
        )
    }, [db, originalPostId, commentId])

    useEffect(() => {
        setHasLiked(likes.findIndex((like)=>like.id == session?.user.uid) !== -1)
    }, [likes])

    async function likeComment() {
        if (session) {
            if (hasLiked) {
                  await deleteDoc(doc(db, 'Posts', originalPostId, 'comments', commentId, 'likes', session?.user.uid))
            } else {
                await setDoc(doc(db, 'Posts', post.id, 'comments', commentId, 'likes', session?.user.uid), {
                    username: session?.user.username
                }) 
            }
        } else {
            signIn();
        }
    }

    async function deleteComment() {
        if (window.confirm('Are you sure you want to delete this Comment?')) {
            await deleteDoc(doc(db, 'Posts', post.id, 'comments', commentId))
        }
    }

    function commentOnPost() {
        const plainPost = {
            id: post?.id, 
            name: post?.data()?.name, 
            username: post?.data()?.username,
            timestamp: post?.data()?.timestamp ? post.data()?.timestamp.toDate()?.toISOString() : null, 
            text: post?.data()?.text, 
            userImg: post?.data()?.userImg, 

        }
        dispatch(openModal(plainPost));
    }
  
  return (
    <div className='flex p-3 cursor-pointer border-b border-gray-200'>
          {/* Main div for post section */}

          <img className='h-11 w-11 rounded-full mr-4' src={comment?.userImg} alt="User-Profile-Image" />
          
          <div >
              {/* Right section */}

              <div className='flex items-center justify-between'>
                  {/* Post header part */}

                    <div className='flex space-x-2 items-center whitespace-nowrap'>
                        {/* User Info part */}
                        <h4 className='font-bold text-[15px] sm:text-[16px] hover:underline'>{comment?.name}</h4>
                        <span className='text-sm sm:text-[15px]'>@{comment?.username} -</span>
                        <span className='text-sm sm:text-[15px] hover:underline'>
                        {timestamp ? dayjs(timestamp).fromNow() : ""}
                        </span>
                    </div>
                        <DotsHorizontalIcon className='h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2' />
                    </div>      
              
                    {/* Comment Text */}
                    <p className='text-gray-800 text-[15px] sm:text-[16px] mb-2'>{comment?.comment}</p>
                    
                    <div className='flex justify-between text-gray-500 p-2'>
                  {/* comment Reaction icons */}
                        <div className='flex items-center select-none'>
                            <ChatIcon onClick={commentOnPost} className='h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100' />
                        </div>
                        
                        {session?.user.uid === comment?.userId && (
                            <TrashIcon onClick={deleteComment} className='h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100' />
                        )}
                        
                        <div className='flex items-center'>
                                {hasLiked ? (
                                    <HeartIconFilled onClick={likeComment} className='h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100'/>
                                ) : (
                                    <HeartIcon onClick={likeComment} className='h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100'/>     
                            )}
                            {
                                likes.length > 0 && <span className={`${hasLiked && 'text-red-500'} text-sm`}>{likes.length}</span>
                            }
                        </div>
                        <ShareIcon className='h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100'/>
                        <ChartBarIcon className='h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100'/>
                        
                    </div>
                </div>
    </div>
  )
}