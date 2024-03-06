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

interface RoomListData {
  id: string;
  lastMessage: {
    id: string;
    message: string;
    time: string;
    user: string;
  };
  user: {
    id: string;
    name: string;
    avatar: string;
    followers: number;
    online: boolean;
  };
  time: string;
}

export default function ChatNavComponent() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState<'MESSAGE_LIST' | 'SETTINGS'>(
    'MESSAGE_LIST'
  );
  const [showNav, setShowNav] = useState(true);
  const { chatRooms, setChatRooms } = useContext(PaxChatContext);
  const [keyword, setKeyword] = useState<string>('');

  const { user } = useContext(PaxContext);

  eventBus.on('startChat', () => {
    setShowNav(!showNav);
  });

  // const getRooms = (data: any) => {
  //   const _rooms: RoomListData[] = [];

  //   for (const room of data) {
  //     const _room = {
  //       id: `${room.ID}`,
  //       lastMessage: {
  //         id: '',
  //         message: '',
  //         time: '',
  //         user: '',
  //       },
  //       user: {
  //         id: '',
  //         name: '',
  //         avatar: '',
  //         followers: 0,
  //         online: false,
  //       },
  //       time: room.CreatedAt,
  //     };

  //     _room.lastMessage.id = `${room.LastMessage.ID}`;
  //     _room.lastMessage.message = room.LastMessage.Content;
  //     _room.lastMessage.time = room.LastMessage.CreatedAt;
  //     _room.lastMessage.user = room.LastMessage.UserID;

  //     for (const member of room.Members) {
  //       if (member.UserID !== user?.id) {
  //         _room.user.id = member.UserID;
  //         _room.user.name = member.User.Name;
  //         _room.user.avatar = `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${member.User.Photo}`;
  //         _room.user.followers = member.User.TotalFollowers;
  //         _room.user.online = member.User.online;
  //       }
  //     }

  //     _rooms.push(_room);
  //   }

  //   return _rooms;
  // };

  // useEffect(() => {
  //   getSubscribedRooms().then((res) => {
  //     const roomList: RoomListData[] = getRooms(res.data);

  //     getUnsubscribedNewRooms().then((res) => {
  //       const _rooms: RoomListData[] = [...roomList, ...getRooms(res.data)];

  //       _rooms.sort(
  //         (a, b) =>
  //           new Date(b.lastMessage.time).getTime() -
  //           new Date(a.lastMessage.time).getTime()
  //       );

  //       setRoomList(_rooms);
  //     });
  //   });
  // }, [user]);

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
          <div className='px-5 bg-card-gradient-menu text-lg font-medium text-gray-800 dark:text-white'>
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
              <div className='my-2 mx-2'>
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
                    .map((room) => (
                      <Link
                        key={room.id}
                        href='/profile/chat/[id]'
                        as={`/profile/chat/${room.id}`}
                        className={cn(
                          'flex w-full items-center gap-x-2 px-5 py-2 transition-colors duration-200 hover:bg-card-gradient-menu focus:outline-none',
                          {
                            'bg-card-gradient-menu':
                              pathname.split('chat/')[1] === room.id,
                          }
                        )}
                      >
                        <div className='relative size-8 min-w-8'>
                          <Image
                            className='size-8 rounded-full'
                            fill
                            style={{ objectFit: 'cover' }}
                            src={room.user.avatar}
                            alt={room.user.name}
                          />
                          {room.user.online && (
                            <span className='absolute bottom-0 right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white'></span>
                          )}
                        </div>

                        <div className='text-left rtl:text-right'>
                          <p className='text-sm font-medium capitalize text-gray-700 dark:text-white'>
                            {room.user.name}
                          </p>
                          <p className='line-clamp-1 text-xs text-gray-500 dark:text-gray-400'>
                            {room.lastMessage}
                          </p>
                        </div>
                      </Link>
                    ))
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
