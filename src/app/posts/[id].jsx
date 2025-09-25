import Sidebar from "../../components/Sidebar"
import Feed from "../../components/Feed"
import Widgets from "../../components/Widgets"
import CommentModal from "../../components/CommentModal";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import Post from "../../../components/Post";
import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Comment from "../../../components/Comment";

export default async function Home({ newsResult, randomUsersResult }) {
    
    newsResult = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/business/us.json').then((res) => res.json());

    randomUsersResult = await fetch('https://randomuser.me/api/?results=30&inc=name,login,picture').then((res) => res.json());
    
    const router = useRouter();
    const { id } = router.query;
    const [post, setPost] = useState()
    const [comments, setComments] = useState();

    useEffect(() => {
        onSnapshot(doc(db, 'Posts', id), (snapshot)=>setPost(snapshot))
    }, [db, id])

    useEffect(() => {
        onSnapshot(query(collection(db, 'Posts', id, 'comments'), orderBy('timestamp', 'desc'), (snapshot)=>setComments(snapshot.docs)))
    }, [])

return (
    <div>
        <main className="flex min-h-screen mx-auto">
            {/* Sidebar Section */}
            <Sidebar/>
            
            {/* Feed Section */}
            <div className='xl:ml-[370px] border-l border-r border-gray-200 xl:min-w-[576px] sm:ml-[73px] max-w-xl flex-grow'>
                <div className='flex item-center space-x-2 py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200'>
                    <div className='hoverEffect flex items-center'>
                        <ArrowLeftIcon className='h-5'/>
                    </div>
                    <h2 className='font-bold text-lg sm:text-xl cursor-pointer flex-grow'>Tweet</h2>
                </div>
                <Post id={id} post={post} />

                {comments.length > 0 && (
                    <div>
                        {comments.map((comment) => {
                            <Comment key={comment.id} id={comment.id} comment={comment.data()} />
                        })}
                    </div>
                )}
            </div>
            
            {/* Widgets Section */}
            <Widgets articles={newsResult.articles} results={ randomUsersResult.results} />

            {/* Modal Section */}
            <CommentModal/>
        </main>        
    </div>
    );
}