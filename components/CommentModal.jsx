'use client'

import {  useState } from 'react';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, toggleModal } from '../store/modalSlice';
import { EmojiHappyIcon, PhotographIcon, XIcon } from '@heroicons/react/outline';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from 'next-auth/react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion  } from 'framer-motion';

dayjs.extend(relativeTime);

export default function CommentModal() {
    const user = useSelector((state) => state.auth?.user);
    const modalState = useSelector((state) => state.modal || {});
    const { isOpen, post } = modalState;
    const dispatch = useDispatch();
    const [input, setInput] = useState();
    const router = useRouter();

    async function sendComment() {
        dispatch(toggleModal());

        await addDoc(collection(db, 'Posts', post.id, 'comments'), {
            comment: input,
            name: user?.name || 'Anonymous',
            username: user?.username || 'anonymous',
            userImg: user?.userImg || '/fallback.webp',
            timestamp: serverTimestamp(),
            userId: user?.uid,
        });

        setInput('');
        router.push(`/posts/${post.id}`);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <ReactModal
                    isOpen={isOpen}
                    onRequestClose={() => dispatch(closeModal())}
                    shouldCloseOnOverlayClick={true}
                    shouldCloseOnEsc={true}
                    ariaHideApp={false}
                    className="outline-none"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className='max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 rounded-xl shadow-md h-[300px] border-gray-400'
                    >
                        <div className='p-1'>
                            <div className='border-b border-gray-200 py-2 px-1.5'>
                                <div onClick={() => dispatch(toggleModal())} className='flex items-center justify-center w-10 h-10 hoverEffect'>
                                    <XIcon className='h-[22px] text-gray-700' />
                                </div>
                            </div>

                            <div className='p-2 flex items-center space-x-2 relative'>
                                <span className='w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-300' />
                                <img className='h-11 w-11 rounded-full mr-4 cursor-pointer' src={post?.userImg} alt="User-Profile-Image" />
                                <h4 className='font-bold text-[15px] sm:text-[16px] hover:underline cursor-pointer'>{post?.name}</h4>
                                <span className='text-sm sm:text-[15px]'>@{post?.username} -</span>
                                <span className='text-sm sm:text-[15px] hover:underline cursor-pointer'>
                                    {dayjs(post?.timestamp)?.fromNow() || ""}
                                </span>
                            </div>

                            <p className='text-gray-500 text-[15px] sm:text-[16px] ml-16 mb-2'>{post?.text}</p>

                            <div className='flex border-b border-gray-200 p-3 space-x-3'>
                                <img className='h-11 w-11 rounded-full cursor-pointer hover:brightness-90' src={user?.userImg} alt="User-Profile-Image" />

                                <div className='w-full divide-y divide-gray-200'>
                                    <div>
                                        <textarea
                                            className='focus:outline-none w-full border-none text-lg placeholder-gray-700 tracking-wide min-h-[50px] max-h-[200px] text-gray-700'
                                            rows='2'
                                            placeholder='Tweet you reply'
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                        />
                                    </div>

                                    <div className='flex items-center justify-between pt-2.5'>
                                        
                                        <div className='flex items-center'>
                                            <PhotographIcon className='h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100' />
                                            <EmojiHappyIcon className='h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100' />
                                        </div>

                                        <button
                                            onClick={sendComment}
                                            disabled={!input}
                                            className={`${input && 'hover:brightness-90 cursor-pointer'} bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md disabled:opacity-50`}
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </ReactModal>
            )}
        </AnimatePresence>
    );
}
