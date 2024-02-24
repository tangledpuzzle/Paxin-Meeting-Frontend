"use client"

import React from 'react';
import { CiMenuKebab } from "react-icons/ci";
import eventBus from '@/eventBus';
import Link from 'next/link';


interface FollowersPageProps {
  onSelectContact: (contactId: number) => void;
  }

  const FollowersPage = () => {
    const handleContactSelect = (contactId: number) => {
        eventBus.emit('contactId', contactId);
    };
    
  return (
    
    <div className="mt-0 mb-[20%] space-y-2">
    {/* <h1>Dialogs</h1> */}
    <div className='my-0'>
        <input className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8 pr-4 dark:bg-input" placeholder="Search by name" type="text" value=""></input>
    </div>
    <Link href='/profile/messages/23' onClick={() => handleContactSelect(23)}   className="flex items-center w-full px-5 py-2 transition-colors duration-200 hover:bg-card-gradient-menu gap-x-2 focus:outline-none">
        <img className="object-cover w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100" alt="" />
    
        <div className="text-left rtl:text-right">
            <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">Mia John</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">11.2 Followers</p>
        </div>
    </Link>

 
    <Link href='/profile/messages/3' onClick={() => handleContactSelect(3)}  className="flex items-center w-full px-5 py-2 transition-colors duration-200 hover:bg-card-gradient-menu gap-x-2 focus:outline-none">
        <div className="relative">
            <img className="object-cover w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&h=764&q=100" alt="" />
            <span className="h-2 w-2 rounded-full bg-emerald-500 absolute right-0.5 ring-1 ring-white bottom-0"></span>
        </div>

        <div className="text-left rtl:text-right">
            <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">Jane Doe</h1>

            <p className="text-xs text-gray-500 dark:text-gray-400">15.6 Followers</p>
        </div>
        <div>
        <CiMenuKebab />
        </div>
    </Link>

    <Link  href='/profile/messages/4'  onClick={() => handleContactSelect(4)}  className="flex items-center w-full px-5 py-2 transition-colors duration-200 hover:bg-card-gradient-menu gap-x-2 focus:outline-none">
        <div className="relative">
            <img className="object-cover w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1608174386344-80898cec6beb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&h=687&q=80" alt="" />
            <span className="h-2 w-2 rounded-full bg-emerald-500 absolute right-0.5 ring-1 ring-white bottom-0"></span>
        </div>

        <div className="text-left rtl:text-right">
            <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">Junior REIS</h1>

            <p className="text-xs text-gray-500 dark:text-gray-400">56.6 Followers</p>
        </div>
    </Link>
    
</div>

  );
};

export default FollowersPage;