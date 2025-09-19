import Image from 'next/image'
import React from 'react'
import SidebarMenuItems from './SidebarMenuItems'
import { HomeIcon} from '@heroicons/react/solid'
import { BellIcon, BookmarkIcon, ClipboardIcon, DotsCircleHorizontalIcon, DotsHorizontalIcon, HashtagIcon, InboxIcon, UserIcon} from '@heroicons/react/outline'

export default function Sidebar() {
  return (
      <div className='hidden sm:flex flex-col p-2 xl:items-start fixed h-full'> 
          {/* Logo */}
          <div className='hoverEffect p-1 hover:bg-blue-100 xl:px-1'>
              <Image
                  src='data:image/png;base64,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'
                  alt='Twitter Logo'
                  width='50'
                  height='50'
                  className='rounded-full'
              
              />
          </div>

          {/* Menu */}
          <div className='mt-4 mb-2.5 xl:items-start'>
                <SidebarMenuItems text='Home' Icon={ HomeIcon} active/>
                <SidebarMenuItems text='Explore' Icon={ HashtagIcon}/>
                <SidebarMenuItems text='Notifications' Icon={ BellIcon}/>
                <SidebarMenuItems text='Messages' Icon={ InboxIcon}/>
                <SidebarMenuItems text='Bookmarks' Icon={ BookmarkIcon}/>
                <SidebarMenuItems text='Lists' Icon={ ClipboardIcon}/>
                <SidebarMenuItems text='Profile' Icon={ UserIcon}/>
                <SidebarMenuItems text='More' Icon={ DotsCircleHorizontalIcon}/>
          </div>
          {/* Button */}
          <button className='hoverEffect bg-blue-400 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-85 text-lg hidden xl:inline'>Tweet</button>

          {/* MiniProfile */}
          <div className='hoverEffect text-gray-700 flex items-center justify-center xl:justify-start mt-auto'>
              <img  className='h-10 w-10 rounded-full xl:mr-2' src="/userpro.jpeg" alt="user-profile-image" />
              <div className='leading-5 hidden xl:inline'>
                  <h4 className='font-bold'>Tinsae Zegeye</h4>
                  <p className='text-gray-500'>@YenYoki</p>
              </div>
              <DotsHorizontalIcon className='h-5 xl:ml-8'/>
          </div>
      
    </div>
  )
}
