import { SparklesIcon } from '@heroicons/react/outline'
import Input from './Input'
import Post from './Post'

export default function Feed() {
    const posts = [
        {
            id: '1', 
            name: 'Tinsae Zegeye', 
            username: 'YenYoki', 
            userImg: '/userpro.jpeg', 
            postImg: 'https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlfGVufDB8fDB8fHww', 
            text: 'Nice View!', 
            timestamp: '2 hours ago', 
        }, 
        {
            id: '2', 
            name: 'Estifanos Zegeye', 
            username: 'EstifZ', 
            userImg: '/userpro2.jpeg', 
            postImg: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D', 
            text: 'Amazing View!!!', 
            timestamp: '2 days ago', 
        }
    ]
  return (
    <div className='xl:ml-[370px] border-l border-r border-gray-200 xl:min-w-[576px] sm:ml-[73px] max-w-xl flex-grow'>
          <div className='flex item-center py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200'>
              <h2 className='font-bold text-lg sm:text-xl cursor-pointer flex-grow'>Home</h2>
              <div className='hoverEffect flex items-center justify-center px-0 ml-auto w-9 h-9'>
                  <SparklesIcon className='h-5'/>
              </div>
          </div>
      <Input />
          {posts.map((post) => (
              <Post key={post.id} post={post} />
      ))}
    </div>
  )
}
