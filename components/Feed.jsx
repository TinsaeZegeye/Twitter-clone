'use client'

import { SparklesIcon } from '@heroicons/react/outline';
import Input from './Input';
import Post from './Post';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/router';

export default function Feed() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        onSnapshot(
            query(collection(db, 'Posts'), orderBy('timestamp', 'desc')),
            (snapshot) => {
                setPosts(snapshot.docs);
            }
        );
    }, []);

    return (
        <div className='xl:ml-[370px] border-l border-r border-gray-200 xl:min-w-[576px] sm:ml-[73px] max-w-xl flex-grow pl-1'>
            <div className='flex item-center py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200'>
                <h2 className='font-bold text-lg sm:text-xl cursor-pointer flex-grow'>Home</h2>
                <div className='hoverEffect flex items-center justify-center px-0 ml-auto w-9 h-9'>
                    <SparklesIcon className='h-5' />
                </div>
            </div>

            <Input />

            <AnimatePresence>
                {posts?.map((post) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Post id={post.id} post={post} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
