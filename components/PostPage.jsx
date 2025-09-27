'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Post from './Post';
import Comment from './Comment';
import Widgets from './Widgets';
import CommentModal from './CommentModal';
import { db } from '../lib/firebase';

export default function PostPage({ postId, newsResult, randomUsersResult }) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  // Listen for the post data
  useEffect(() => {
    if (!postId) return;
    const unsubscribe = onSnapshot(doc(db, 'Posts', postId), (snapshot) => {
      setPost(snapshot);
    });
    return () => unsubscribe();
  }, [postId]);

  // Listen for comments
  useEffect(() => {
    if (!postId) return;
    const commentQuery = query(
      collection(db, 'Posts', postId, 'comments'),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(commentQuery, (snapshot) => {
      setComments(snapshot.docs);
    });
    return () => unsubscribe();
  }, [postId]);
  
  return (
    <AnimatePresence mode='wait'>
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}  
              key={postId}
        >
            <main className="flex min-h-screen mx-auto">
                {/* Sidebar */}
                <Sidebar />

                {/* Feed */}
                <div className="xl:ml-[370px] border-l border-r border-gray-200 xl:min-w-[576px] sm:ml-[73px] max-w-xl flex-grow">
                {/* Header */}
                <div className="flex items-center space-x-2 py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
                    <div
                    className="hoverEffect flex items-center"
                    onClick={() => router.push('/')}
                    >
                    <ArrowLeftIcon className="h-5" />
                    </div>
                    <h2 className="font-bold text-lg sm:text-xl cursor-pointer flex-grow">
                    Tweet
                    </h2>
                </div>

                {/* Post */}
                {post && <Post id={postId} post={post} isSinglePage={true} />}

                {/* Comments */}
                <AnimatePresence>
                    {comments?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div>
                            {comments.map((commentDoc) => {
                                return (
                                <Comment
                                    key={commentDoc.id}
                                    commentId={commentDoc.id}
                                    originalPostId={postId}
                                    comment={commentDoc.data()}
                                />
                                );
                            })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                </div>

                {/* Widgets */}
                <Widgets
                articles={newsResult.articles}
                results={randomUsersResult.results}
                />

                {/* Modal */}
                <CommentModal />
            </main>
        </motion.div>
    </AnimatePresence>
    
  );
}
