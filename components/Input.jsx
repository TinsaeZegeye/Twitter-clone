'use client'

import { EmojiHappyIcon, PhotographIcon, XIcon } from '@heroicons/react/outline'
import React, { useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { db } from '../lib/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

export default function Input() {
  const { data: session } = useSession();
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
    const [input, setInput] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const addImageToPost = (e) => {
      
        if (!e.target.files[0]) return;

        const file = e.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (readerEvent) => {
            setImagePreview(readerEvent.target.result);
        }
  }

    const handleUpload = async () => {
        if (!input || !selectedFile) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('upload_preset', 'twitter-clone');
        formData.append('userId', session.user.uid);
        formData.append('user', session.user.name);
        formData.append('userName', session.user.username);
        formData.append('userImg', session.user.image);
        formData.append('text', input);
        formData.append('file', selectedFile);
        formData.append('timestamp', new Date().toISOString());

        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST', 
            body: formData, 
        });

        const data = await res.json(); 
        
        await addDoc(collection(db, 'Posts'), {
            userID: session.user.uid, 
            name: session.user.name, 
            username: session.user.username, 
            userImg: session.user.image, 
            text: input, 
            imageUrl: data.secure_url, 
            timestamp: serverTimestamp(), 
        })

        setInput('');
        setSelectedFile(null);
        setImagePreview(null);
        setLoading(false);

  }
 
      
  return (
    <div className='flex border-b border-gray-200 p-3 space-x-3'>
      {session && (
        <>
          <img className='h-11 w-11 rounded-full cursor-pointer hover:brightness-90' src={session.user.image} alt="User-Profile-Image" />
          <div className='w-full divide-y divide-gray-200'>
              <div>
              <textarea
                className='focus:outline-none w-full border-none text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700' rows='2' placeholder='What is happening?'
                value={input}
                onChange={(e)=> setInput(e.target.value)}
              />
            </div>

            {selectedFile && (
              <>
                <div className='flex justify-center relative mt-2 pb-3'>
                   <XIcon onClick={()=> setSelectedFile(null)} className={` ${loading && 'hidden'} h-7 cursor-pointer text-gray-800 absolute shadow-md shadow-white border p-1 rounded-full right-10 top-2 hover:scale-105 transition-transform duration-200`}/>               
                    <img src={imagePreview} width='250' className={`${loading && 'animate-pulse'} rounded-2xl object-cover`} />
                </div>
              </>
            )}
            
            <div className='flex items-center justify-between pt-2.5'>
              <div className='hidden'>
                <input type="file" ref={filePickerRef} onChange={addImageToPost} />
            </div>
                {!loading && (
                    <>       
                        <div className='flex items-center'>
                            <PhotographIcon onClick={()=> filePickerRef.current?.click()}  className='h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100'/>
                            <EmojiHappyIcon className='h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100'/>
                        </div>
                        <button onClick={handleUpload} disabled = {!input && !selectedFile} className={`${input && 'hover:brightness-90 cursor-pointer'} bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md disabled:opacity-50`}>Tweet</button>
                    </> 
                )}
              </div>
          </div>
        </>
        )}
    </div>
  )
}
