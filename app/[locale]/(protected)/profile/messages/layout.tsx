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
import ChatNavComponent from '@/components/dialogs/chat-nav';

interface MessagesProps {
  children: React.ReactNode;
}

const ChatSSRSkeleton = dynamic(() => import('@/components/dialogs/skeleton'), {
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
  contactId,
  onSelectContact,
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
            <img
              className='chat-msg-img'
              src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png'
              alt=''
            />
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Предотвращаем стандартное действие (например, переход на новую строку)
      setInputMessage((prevInputMessage) => prevInputMessage + '\n'); // Добавляем перенос строки в текущее значение поля ввода
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
      for (let entry of entries) {
        if (entry.contentBoxSize) {
          const height = entry.contentBoxSize[0].blockSize;
          // Update the style of chat-container
          if (chatContainer) {
            if (height !== prevHeight) {
              if (height > prevHeight) {
                const currentTop = parseInt(
                  chatContainer.style.marginTop || '0'
                );
                const newTop = currentTop - 24;
                chatContainer.style.marginTop = `${newTop}px`;
              } else {
                const currentTop = parseInt(
                  chatContainer.style.marginTop || '0'
                );
                // const newTop = currentTop + 24;
                // chatContainer.style.marginTop = `${newTop}px`;
                // console.log(chatContainer.style.marginTop)
                // chatContainer.style.marginTop = `${newTop}px`;
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
          className={`relative left-[10px] top-[40px] bg-background h-[20px]${isOpen ? '' : ' '}`}
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
          style={{ height: `calc(100vh - ${isOpen ? '10rem' : '10rem'})` }}
          className={`w-full rounded-lg bg-background px-4`}
        >
          <div className='wrapper'>
            <div className='chat-area container !px-0'>
              <div className='chat-area-main'>
                <div className='chat-msg'>
                  <div className='chat-msg-profile'>
                    <img
                      className='chat-msg-img'
                      src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png'
                      alt=''
                    />
                    <div className='chat-msg-date'>Message seen 1.22pm</div>
                  </div>
                  <div className='chat-msg-content'>
                    <div className='chat-msg-text bg-card-gradient-menu'>
                      Luctus et ultrices posuere cubilia curae.
                    </div>
                    <div className='chat-msg-text bg-card-gradient-menu'>
                      <img src='https://media0.giphy.com/media/yYSSBtDgbbRzq/giphy.gif?cid=ecf05e47344fb5d835f832a976d1007c241548cc4eea4e7e&amp;rid=giphy.gif' />
                    </div>
                    <div className='chat-msg-text bg-card-gradient-menu'>
                      Neque gravida in fermentum et sollicitudin ac orci
                      phasellus egestas. Pretium lectus quam id leo.
                    </div>
                  </div>
                </div>
                <div className='chat-msg owner'>
                  <div className='chat-msg-profile'>
                    <img
                      className='chat-msg-img'
                      src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png'
                      alt=''
                    />
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
                    <img
                      className='chat-msg-img'
                      src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png'
                      alt=''
                    />
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
                    <img
                      className='chat-msg-img'
                      src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png'
                      alt=''
                    />
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
                    <img
                      className='chat-msg-img'
                      src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png'
                      alt=''
                    />
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
                    <img
                      className='chat-msg-img'
                      src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png'
                      alt=''
                    />
                    <div className='chat-msg-date'>Message seen 3.16pm</div>
                  </div>
                  <div className='chat-msg-content'>
                    <div className='chat-msg-text chat-msg-text bg-card-gradient-menu'>
                      Consectetur adipiscing elit pellentesque habitant morbi
                      tristique senectus et.
                    </div>
                  </div>
                </div>
                <div className='chat-msg owner'>
                  <div className='chat-msg-profile'>
                    <img
                      className='chat-msg-img'
                      src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png'
                      alt=''
                    />
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
                    <img
                      className='chat-msg-img'
                      src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png'
                      alt=''
                    />
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
          {/* <form onSubmit={sendMessage}> Обработчик отправки формы */}
          <div className='flex'>
            <Button className='h-auto !items-end !rounded-l-none !rounded-r-none bg-card-gradient-menu'>
              <DropdownMenuDemo />
            </Button>

            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={handleInputChange}
              className='mb-[10px] ml-[10px] mr-[40px] mt-[10px] h-[68px] max-h-[200px] w-full rounded-xl bg-card-gradient-menu-on pb-2 pl-[10px] pr-[10px] pt-2'
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
          {/* </form> */}
        </div>
      </div>
    </div>
  );
}

function auto_height(event: React.ChangeEvent<HTMLTextAreaElement>) {
  const textarea = event.currentTarget as HTMLTextAreaElement;
  let prevHeight = textarea.scrollHeight;

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
      const chatContainer = document.querySelector(
        '.new-container'
      ) as HTMLElement | null;
      if (chatContainer) {
        const currentTop = parseInt(chatContainer.style.marginTop || '0');
        if (currentTop === -24) {
        } else {
          const newTop = currentTop + 24;
          chatContainer.style.marginTop = `${newTop}px`;
        }
      }
    }
  }
}

export default function Messages({ children }: MessagesProps) {
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
    return () => {
      eventBus.off('contactId', handleContactSelectWrapper);
      eventBus.off('startChat', handleHideSideBar);
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
          <div className='h-screen w-full overflow-y-auto border-l border-r bg-card-gradient py-2'>
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
                  {/* <NavItem href="/profile/messages/settings" text="Settings" /> */}
                </nav>
              </div>
            </div>
            <ChatNavComponent />
            {/* <ScrollArea className='h-[calc(100vh_-_12rem)] rounded-lg bg-background p-4'>
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  const props = {
                    onSelectContact: handleContactSelect,
                    toggleSidebar,
                  } as ChatWindowProps;
                  return React.cloneElement(child, {
                    ...props,
                    isOpen: isOpen,
                  } as React.ComponentProps<typeof ChatWindow>);
                  // Передаем isOpen как пропс в ChatWindow
                }
                return child;
              })}
            </ScrollArea> */}
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
              /> // Передаем isOpen и toggleSidebar как пропсы в ChatWindow
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
