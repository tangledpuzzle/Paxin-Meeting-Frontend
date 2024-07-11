'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IoIosClose } from 'react-icons/io';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import eventBus from '@/eventBus';
import { MoveLeft } from 'lucide-react';
import useOutsideClick from '@/lib/outsideclick';
import { Button } from '@/components/ui/button';
import { IoSendOutline } from 'react-icons/io5';
import DropdownMenuDemo from '@/components/ui/chatmenu';
import ChatNavComponent from '@/components/chat/chat-nav';

const ChatSSRSkeleton = dynamic(() => import('@/components/chat/skeleton'), {
  ssr: true,
});

interface ChatWindowProps {
  isOpen: boolean;
  contactId: number;
  onSelectContact: (contactId: number) => void;
  toggleSidebar: () => void;
  autoHeightFunc: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function ChatWindow({
  isOpen,
  toggleSidebar,
}: ChatWindowProps) {
  type Message = string | JSX.Element;

  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null = null
  ) => {
    if (e) {
      const chatContainer = document.querySelector(
        '.new-container'
      ) as HTMLElement | null;
      if (chatContainer) {
        chatContainer.style.marginTop = `${-24}px`;
      }
      e.preventDefault();
    }

    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    const trimmedMessage = inputMessage.trim();
    if (trimmedMessage !== '') {
      const newMessage = (
        <div className='chat-msg' style={{ overflowWrap: 'anywhere' }}>
          <div className='chat-msg-profile'>
            <div className='chat-msg-date'>Message not seen yet</div>
          </div>
          <div className='chat-msg-content'>
            <div
              className='chat-msg-text bg-card-gradient-menu'
              style={{ whiteSpace: 'pre-line' }}
            >
              {trimmedMessage}
            </div>
          </div>
        </div>
      );

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage('');
      const chatContainer = document.querySelector(
        '.new-container'
      ) as HTMLElement | null;
      if (chatContainer) {
        chatContainer.style.top = `${-24}px`;
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = '68px';
      }
    }
    if (e) {
      const submitButton = e.currentTarget.querySelector<HTMLButtonElement>(
        'button[type="submit"]'
      );
      if (submitButton) {
        submitButton.focus();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
  };

  useEffect(() => {
    const chatInput = document.querySelector('.chatInput');
    const chatContainer = document.querySelector(
      '.new-container'
    ) as HTMLElement | null;
    let prevHeight = 0;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          const height = entry.contentBoxSize[0].blockSize;
          if (chatContainer) {
            if (height !== prevHeight) {
              if (height > prevHeight) {
                const currentTop = parseInt(
                  chatContainer.style.marginTop || '0'
                );
                const newTop = currentTop - 24;
                chatContainer.style.marginTop = `${newTop}px`;
              } else {
                parseInt(chatContainer.style.marginTop || '0');
              }
              prevHeight = height;
            }
          }
        }
      }
    });

    if (chatInput) {
      resizeObserver.observe(chatInput);
    }

    return () => {
      if (chatInput) {
        resizeObserver.unobserve(chatInput);
      }
    };
  }, []);

  return (
    <div>
      <div id='chat-container' className='h-auto'>
        <div
          className={`relative left-[10px] top-[40px] h-[20px] bg-background${isOpen ? '' : ' '}`}
        >
          {!isOpen && (
            <div className='flex'>
              <div
                className='left-0 top-0 z-10 cursor-pointer px-7 md:left-2 md:top-4'
                onClick={toggleSidebar}
              >
                <MoveLeft size='24' />
              </div>
            </div>
          )}
        </div>

        <ScrollArea
          ref={scrollAreaRef}
          style={{ height: `calc(100dvh - ${isOpen ? '10rem' : '10rem'})` }}
          className={`w-full rounded-lg bg-background px-4`}
        >
          <div className='wrapper'>
            <div className='chat-area container !px-0'>
              <div className='chat-area-main'>
                <div className='chat-msg'>
                  <div className='chat-msg-profile'>
                    <div className='chat-msg-date'>Message seen 1.22pm</div>
                  </div>
                  <div className='chat-msg-content'>
                    <div className='chat-msg-text bg-card-gradient-menu'>
                      Luctus et ultrices posuere cubilia curae.
                    </div>
                    <div className='chat-msg-text bg-card-gradient-menu'>
                    </div>
                    <div className='chat-msg-text bg-card-gradient-menu'>
                      Neque gravida in fermentum et sollicitudin ac orci
                      phasellus egestas. Pretium lectus quam id leo.
                    </div>
                  </div>
                </div>
                <div className='chat-msg owner'>
                  <div className='chat-msg-profile'>
                    <div className='chat-msg-date'>Message seen 1.22pm</div>
                  </div>
                  <div className='chat-msg-content'>
                    <div className='chat-msg-text'>
                      Sit amet risus nullam eget felis eget. Dolor sed viverra
                      ipsum😂😂😂
                    </div>
                    <div className='chat-msg-text'>
                      Cras mollis nec arcu malesuada tincidunt.
                    </div>
                  </div>
                </div>
                <div className='chat-msg'>
                  <div className='chat-msg-profile'>
                    <div className='chat-msg-date'>Message seen 2.45pm</div>
                  </div>
                  <div className='chat-msg-content'>
                    <div className='chat-msg-text bg-card-gradient-menu'>
                      Aenean tristique maximus tortor non tincidunt. Vestibulum
                      ante ipsum primis in faucibus orci luctus et ultrices
                      posuere cubilia curae😊
                    </div>
                    <div className='chat-msg-text bg-card-gradient-menu'>
                      Ut faucibus pulvinar elementum integer enim neque
                      volutpat.
                    </div>
                  </div>
                </div>
                <div className='chat-msg owner'>
                  <div className='chat-msg-profile'>
                    <div className='chat-msg-date'>Message seen 2.50pm</div>
                  </div>
                  <div className='chat-msg-content'>
                    <div className='chat-msg-text'>
                      posuere eget augue sodales, aliquet posuere eros.
                    </div>
                    <div className='chat-msg-text'>
                      Cras mollis nec arcu malesuada tincidunt.
                    </div>
                  </div>
                </div>
                <div className='chat-msg'>
                  <div className='chat-msg-profile'>
                    <div className='chat-msg-date'>Message seen 3.16pm</div>
                  </div>
                  <div className='chat-msg-content'>
                    <div className='chat-msg-text bg-card-gradient-menu'>
                      Egestas tellus rutrum tellus pellentesque
                    </div>
                  </div>
                </div>
                <div className='chat-msg'>
                  <div className='chat-msg-profile'>
                    <div className='chat-msg-date'>Message seen 3.16pm</div>
                  </div>
                  <div className='chat-msg-content'>
                    <div className='chat-msg-text bg-card-gradient-menu'>
                      Consectetur adipiscing elit pellentesque habitant morbi
                      tristique senectus et.
                    </div>
                  </div>
                </div>
                <div className='chat-msg owner'>
                  <div className='chat-msg-profile'>
                    <div className='chat-msg-date'>Message seen 2.50pm</div>
                  </div>
                  <div className='chat-msg-content'>
                    <div className='chat-msg-text'>
                      Tincidunt arcu non sodales😂
                    </div>
                  </div>
                </div>
                <div className='chat-msg'>
                  <div className='chat-msg-profile'>
                    <div className='chat-msg-date'>Message seen 3.16pm</div>
                  </div>
                  <div className='chat-msg-content'>
                    <div className='chat-msg-text bg-card-gradient-menu'>
                      Consectetur adipiscing elit pellentesque habitant morbi
                      tristique senectus et🥰
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container bottom-0  mx-auto  w-auto !px-0'>
            {messages.map((message, index) =>
              typeof message === 'string' ? (
                <div className='' key={index}>
                  {message}
                </div>
              ) : (
                <div className='' key={index}>
                  {message}
                </div>
              )
            )}
          </div>
        </ScrollArea>
        <div className='chatInput'>
          <div className='flex'>
            <Button className='h-auto !items-end !rounded-none bg-card-gradient-menu'>
              <DropdownMenuDemo />
            </Button>

            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={handleInputChange}
              className='my-[10px] ml-[10px] mr-[40px] h-[68px] max-h-[200px] w-full rounded-xl bg-card-gradient-menu-on px-[10px] py-2'
              onInput={auto_height}
            ></textarea>
            <button
              type='button'
              onClick={sendMessage}
              className='absolute right-0 flex h-full cursor-pointer items-end justify-center pb-6 pr-3'
            >
              <IoSendOutline color='gray' size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function auto_height(event: React.ChangeEvent<HTMLTextAreaElement>) {
  const textarea = event.currentTarget as HTMLTextAreaElement;
  const prevHeight = textarea.scrollHeight;

  textarea.style.height = '68px';
  textarea.style.height = `${textarea.scrollHeight}px`;
  if (textarea.scrollHeight === 68) {
    const chatContainer = document.querySelector(
      '.new-container'
    ) as HTMLElement | null;
    if (chatContainer) {
      chatContainer.style.marginTop = `${-24}px`;
    }
  }

  if (prevHeight > textarea.scrollHeight) {
    const chatContainer = document.querySelector(
      '.new-container'
    ) as HTMLElement | null;
    if (chatContainer) {
      const currentTop = parseInt(chatContainer.style.marginTop || '0');
      if (currentTop !== -24) {
        const newTop = currentTop + 24;
        chatContainer.style.marginTop = `${newTop}px`;
      }
    }
  }
}

export default function Messages() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  const [isOpen, setIsOpen] = useState(true);
  const sidebarRef = useRef(null);

  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  const pathname = usePathname();
  const [mode] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleOutsideClick = () => {
    if (isOpen) {
      //setIsOpen(false);
    }
  };

  useOutsideClick(sidebarRef, handleOutsideClick);

  const handleContactSelect = (contactId: number) => {
    setSelectedContact(contactId);
  };

  useEffect(() => {
    const handleContactSelectWrapper = (contactId: unknown) => {
      if (typeof contactId === 'number') {
        setSelectedContact(contactId);
      } else {
        console.error('wrong type contactId');
      }
    };

    const handleHideSideBar = () => {
      setIsOpen((prevIsOpen) => !prevIsOpen);
    };

    eventBus.on('startChat', handleHideSideBar);
    eventBus.on('contactId', handleContactSelectWrapper);
    eventBus.on('scrollToMessage', () => alert(10));
    return () => {
      eventBus.off('contactId', handleContactSelectWrapper);
      eventBus.off('startChat', handleHideSideBar);
      eventBus.off('scrollToMessage', () => alert(10));
    };
  }, []);

  useEffect(() => {
    const cleanPathname = pathname.replace(/^\/(ru|ka|es)\//, '/');
    if (
      cleanPathname.includes('/profile/messages/') &&
      cleanPathname.split('/').length > 3
    ) {
      const segments = cleanPathname.split('/');
      const lastSegment = segments[segments.length - 1];
      if (lastSegment !== 'settings') {
        const slug = segments[3];
        setSelectedContact(parseInt(slug));
      }
    }
  }, [pathname]);

  return (
    <div>
      <div className={`new-container${isOpen ? ' open' : ''}`}>
        <div
          ref={sidebarRef}
          className='new-sidebar w-full pt-[70px] md:w-[300px]'
        >
          <div className='h-screen w-full overflow-y-auto border-x bg-card-gradient py-2'>
            <div className='px-5 text-lg font-medium text-gray-800 dark:text-white'>
              <button
                className='toggle-btn  absolute right-4 top-[92px] z-10'
                onClick={toggleSidebar}
              >
                <IoIosClose size={24} />
              </button>
              <div className=''>
                <nav className='-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500 dark:text-gray-400'>
                  <NavItem href='/profile/messages' text='Followers' />
                  <NavItem href='/profile/messages/settings' text='Settings' />
                </nav>
              </div>
            </div>
            <ChatNavComponent mode={mode} />
          </div>
        </div>
        <div className='new-content-container'>
          <div className='new-main-content'>
            {selectedContact !== null ? (
              <ChatWindow
                isOpen={isOpen}
                contactId={selectedContact}
                onSelectContact={handleContactSelect}
                autoHeightFunc={auto_height}
                toggleSidebar={toggleSidebar}
              />
            ) : (
              <ChatSSRSkeleton />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function NavItem({ href, text }: { href: string; text: string }) {
    const pathname = usePathname();
    const [cleanHref, setCleanHref] = useState('');

    useEffect(() => {
      const cleanPathname = pathname.replace(/^\/(ru|ka|es)\//, '/');
      setCleanHref(cleanPathname);
    }, [pathname]);

    return (
      <div className='me-2'>
        <Link href={href}>
          <div
            className={`inline-flex items-center justify-center rounded-t-lg border-b-2 p-4 ${cleanHref === href ? 'border-primary text-primary' : 'group hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'}`}
          >
            <span>{text}</span>
          </div>
        </Link>
      </div>
    );
  }
}
