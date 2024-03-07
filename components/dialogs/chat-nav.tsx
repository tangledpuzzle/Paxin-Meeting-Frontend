'use client';

import { PaxContext } from '@/context/context';
import getSubscribedRooms from '@/lib/server/chat/getSubscribedRooms';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { ScrollArea } from '../ui/scroll-area';
import ChatListSkeleton from './chat-list-skeleton';
import { usePathname } from '@/navigation';
import getUnsubscribedNewRooms from '@/lib/server/chat/getUnsubscribedNewRooms';
import eventBus from '@/eventBus';
import { PaxChatContext } from '@/context/chat-context';
import ChatRoom from './chat-room';

export default function ChatNavComponent() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState<'MESSAGE_LIST' | 'SETTINGS'>(
    'MESSAGE_LIST'
  );
  const [showNav, setShowNav] = useState(true);
  const { chatRooms } = useContext(PaxChatContext);
  const [keyword, setKeyword] = useState<string>('');

  eventBus.on('startChat', () => {
    setShowNav(!showNav);
  });

  return (
    <div
      className={cn('new-container', {
        open: showNav,
      })}
    >
      <div
        ref={sidebarRef}
        className='new-sidebar w-full pt-[70px] md:w-[300px]'
      >
        <div className='h-screen w-full overflow-y-auto border-l border-r bg-card-gradient py-2'>
          <div className='bg-card-gradient-menu px-5 text-lg font-medium text-gray-800 dark:text-white'>
            <button
              className='toggle-btn  absolute right-4 top-[92px] z-10'
              onClick={() => setShowNav(!showNav)}
            >
              <IoIosClose size={24} />
            </button>
            <div className=''>
              <nav className='-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500 dark:text-gray-400'>
                <div
                  className='me-2 cursor-pointer'
                  onClick={() => setCurrentTab('MESSAGE_LIST')}
                >
                  <div
                    className={`inline-flex items-center justify-center rounded-t-lg border-b-2 p-4 ${currentTab === 'MESSAGE_LIST' ? 'border-primary text-primary' : 'group hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  >
                    <span>Dialogs</span>
                  </div>
                </div>
                <div
                  className='me-2 cursor-pointer'
                  onClick={() => setCurrentTab('SETTINGS')}
                >
                  <div
                    className={`inline-flex items-center justify-center rounded-t-lg border-b-2 p-4 ${currentTab === 'SETTINGS' ? 'border-primary text-primary' : 'group hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  >
                    <span>Settings</span>
                  </div>
                </div>
              </nav>
            </div>
          </div>
          {currentTab === 'MESSAGE_LIST' && (
            <div className='mb-[20%]'>
              <div className='mx-2 my-2'>
                <input
                  className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-8 pr-4 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input'
                  placeholder='Search by name'
                  type='text'
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <ScrollArea className='h-[calc(100vh_-_14.5rem)] rounded-lg bg-background p-4'>
                {chatRooms.length > 0 ? (
                  chatRooms
                    .filter((room) => room.user.name.includes(keyword))
                    .map((room) => <ChatRoom key={room.id} room={room} />)
                ) : (
                  <>
                    <ChatListSkeleton />
                    <ChatListSkeleton />
                    <ChatListSkeleton />
                  </>
                )}
              </ScrollArea>
            </div>
          )}
          {currentTab === 'SETTINGS' && <div>Settings</div>}
        </div>
      </div>
    </div>
  );
}
