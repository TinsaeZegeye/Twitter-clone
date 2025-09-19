import React from 'react'

export default function SidebarMenuItems({text, Icon, active}) {
  return (
    <div className='hoverEffect flex items-center space-x-3 text-gray-700 justify-center xl:justify-start text-lg'>
          <Icon className='h-5 w-5 sm:h-6 sm:w-6' />
          <span className={`${active && 'font-bold'} hidden xl:inline`}>{ text}</span>
    </div>
  )
}
