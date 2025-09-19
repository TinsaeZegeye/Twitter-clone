import React from 'react'

export default function SidebarMenuItems({text, Icon, active}) {
  return (
    <div className='hoverEffect flex items-center space-x-3 text-gray-700 justify-center xl:justify-start text-lg'>
          <Icon className = 'h-7' />
          <span className={`${active && 'font-bold'} hidden xl:inline`}>{ text}</span>
    </div>
  )
}
