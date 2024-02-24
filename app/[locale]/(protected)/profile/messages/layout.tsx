"use client"

import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IoIosClose } from "react-icons/io";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import eventBus from '@/eventBus';
import { MoveLeft } from 'lucide-react';
import useOutsideClick from '@/lib/outsideclick';
import { Button } from '@/components/ui/button';
import { IoSendOutline } from "react-icons/io5";
import  DropdownMenuDemo  from "@/components/ui/chatmenu";

  
interface MessagesProps {
    children: React.ReactNode;
}

const ChatSSRSkeleton = dynamic(
    () => import('@/components/dialogs/skeleton'),
    { ssr: true }
);

interface ChatWindowProps {
    isOpen: boolean;
    contactId: number;
    onSelectContact: (contactId: number) => void;
    toggleSidebar: () => void;
}

function ChatWindow({ isOpen, contactId, onSelectContact, toggleSidebar }: ChatWindowProps) {
    type Message = string | JSX.Element;

    const [inputMessage, setInputMessage] = useState(""); // Состояние для хранения введенного сообщения
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollAreaRef = useRef<HTMLDivElement>(null); // Создаем ссылку на область прокрутки

    useEffect(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, [messages]); // Scroll to bottom whenever messages change


    // Функция для отправки сообщения
    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault(); 
        if (inputMessage.trim() !== "") { 
            const newMessage = (
                <div className="chat-msg">
                    <div className="chat-msg-profile">
                        <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png" alt="" />
                        <div className="chat-msg-date">Message not seen yet</div>
                    </div>
                    <div className="chat-msg-content">
                        <div className="chat-msg-text bg-card-gradient-menu">{inputMessage}</div>
                    </div>
                </div>
            );
    
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setInputMessage(""); 
        }
    };

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
    };
    

    return (
        <div>
            <div id="chat-container">
            {!isOpen && (
                <div className={`bg-background h-[20px]${isOpen ? 'hidden' : ' '}`}>
                    <div className='flex'>
                        <div className=" left-0 absolute z-10 cursor-pointer px-7" onClick={toggleSidebar}>
                        <MoveLeft size="24" />
                        </div>
                    </div>
                </div>)}

                <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh_-_9rem)] w-full rounded-lg bg-background p-4">
                <div className="wrapper">
                <div className="chat-area container !px-0">

                <div className="chat-area-main">
                    <div className="chat-msg">
                    <div className="chat-msg-profile">
                    <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png" alt="" />
                    <div className="chat-msg-date">Message seen 1.22pm</div>
                    </div>
                    <div className="chat-msg-content">
                    <div className="chat-msg-text bg-card-gradient-menu">Luctus et ultrices posuere cubilia curae.</div>
                    <div className="chat-msg-text bg-card-gradient-menu">
                    <img src="https://media0.giphy.com/media/yYSSBtDgbbRzq/giphy.gif?cid=ecf05e47344fb5d835f832a976d1007c241548cc4eea4e7e&amp;rid=giphy.gif" /></div>
                    <div className="chat-msg-text bg-card-gradient-menu">Neque gravida in fermentum et sollicitudin ac orci phasellus egestas. Pretium lectus quam id leo.</div>
                    </div>
                    </div>
                    <div className="chat-msg owner">
                    <div className="chat-msg-profile">
                    <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png" alt="" />
                    <div className="chat-msg-date">Message seen 1.22pm</div>
                    </div>
                    <div className="chat-msg-content">
                    <div className="chat-msg-text">Sit amet risus nullam eget felis eget. Dolor sed viverra ipsum😂😂😂</div>
                    <div className="chat-msg-text">Cras mollis nec arcu malesuada tincidunt.</div>
                    </div>
                    </div>
                    <div className="chat-msg">
                    <div className="chat-msg-profile">
                    <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png" alt="" />
                    <div className="chat-msg-date">Message seen 2.45pm</div>
                    </div>
                    <div className="chat-msg-content">
                    <div className="chat-msg-text bg-card-gradient-menu">Aenean tristique maximus tortor non tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae😊</div>
                    <div className="chat-msg-text bg-card-gradient-menu">Ut faucibus pulvinar elementum integer enim neque volutpat.</div>
                    </div>
                    </div>
                    <div className="chat-msg owner">
                    <div className="chat-msg-profile">
                    <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png" alt="" />
                    <div className="chat-msg-date">Message seen 2.50pm</div>
                    </div>
                    <div className="chat-msg-content">
                    <div className="chat-msg-text">posuere eget augue sodales, aliquet posuere eros.</div>
                    <div className="chat-msg-text">Cras mollis nec arcu malesuada tincidunt.</div>
                    </div>
                    </div>
                    <div className="chat-msg">
                    <div className="chat-msg-profile">
                    <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png" alt="" />
                    <div className="chat-msg-date">Message seen 3.16pm</div>
                    </div>
                    <div className="chat-msg-content">
                    <div className="chat-msg-text bg-card-gradient-menu">Egestas tellus rutrum tellus pellentesque</div>
                    </div>
                    </div>
                    <div className="chat-msg">
                    <div className="chat-msg-profile">
                    <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png" alt="" />
                    <div className="chat-msg-date">Message seen 3.16pm</div>
                    </div>
                    <div className="chat-msg-content">
                    <div className="chat-msg-text chat-msg-text bg-card-gradient-menu">Consectetur adipiscing elit pellentesque habitant morbi tristique senectus et.</div>
                    </div>
                    </div>
                    <div className="chat-msg owner">
                    <div className="chat-msg-profile">
                    <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png" alt="" />
                    <div className="chat-msg-date">Message seen 2.50pm</div>
                    </div>
                    <div className="chat-msg-content">
                    <div className="chat-msg-text">Tincidunt arcu non sodales😂</div>
                    </div>
                    </div>
                    <div className="chat-msg">
                    <div className="chat-msg-profile">
                    <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png" alt="" />
                    <div className="chat-msg-date">Message seen 3.16pm</div>
                    </div>
                    <div className="chat-msg-content">
                    <div className="chat-msg-text bg-card-gradient-menu">Consectetur adipiscing elit pellentesque habitant morbi tristique senectus et🥰</div>
                    </div>
                    </div>
                </div>
                </div>

                </div>
                <div className='container !px-0  bottom-0  w-auto mx-auto'>
                {messages.map((message, index) => (
                    typeof message === 'string' ? (
                    <div className='' key={index}>{message}</div>
                    ) : (
                    <div className='' key={index}>{message}</div>
                    )
                ))}
                </div>
                </ScrollArea>
                <div className='chatInput'>
                    <form onSubmit={sendMessage}> {/* Обработчик отправки формы */}
                        <div className='flex justify-between'>
                            <Button className='rounded-r-none'>
                                <DropdownMenuDemo/>
                            </Button>
                            <input 
                                value={inputMessage} 
                                onChange={handleInputChange} 
                                className='w-full px-4 mx-0 rounded-r-md pr-8 text-sm focus:text-sm' 
                                placeholder='Message' 
                            />
                            <button type="submit" className='absolute right-0 flex justify-center items-center h-full pr-2 cursor-pointer'>
                                <IoSendOutline color='gray' size={18} />
                            </button>
                        </div>
                    </form>
                </div>                
            </div>
        </div>
    );
}

  
export default function Messages({ children }: MessagesProps) {
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
            setIsOpen(prevIsOpen => !prevIsOpen); 
        }
        eventBus.on('startChat', handleHideSideBar);
        eventBus.on('contactId', handleContactSelectWrapper);
        return () => {
            eventBus.off('contactId', handleContactSelectWrapper);
            eventBus.off('startChat', handleHideSideBar);
        };
    }, []);

    useEffect(() => {
        const cleanPathname = pathname.replace(/^\/(ru|ka|es)\//, '/');
        if (cleanPathname.includes('/profile/messages/')  && cleanPathname.split('/').length > 3) {
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
                <div ref={sidebarRef} className="new-sidebar pt-[70px] w-full md:w-[300px]">
                    <div className="h-screen w-full py-2 overflow-y-auto bg-card-gradient border-l border-r">
                        <div className="px-5 text-lg font-medium text-gray-800 dark:text-white">
                            <button className="toggle-btn  absolute z-10 top-[92px] right-4" onClick={toggleSidebar}>
                                <IoIosClose size={24} />
                            </button>
                            <div className="">
                                <nav className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                                    <NavItem href="/profile/messages" text="Followers" />
                                    <NavItem href="/profile/messages/settings" text="Settings" />
                                    {/* <NavItem href="/profile/messages/settings" text="Settings" /> */}
                                </nav>
                            </div>
                        </div>
                        <ScrollArea className="h-[calc(100vh_-_12rem)] rounded-lg bg-background p-4">
                        {React.Children.map(children, child => {
                            if (React.isValidElement(child)) {
                                const props = { onSelectContact: handleContactSelect, toggleSidebar } as ChatWindowProps;
                                return React.cloneElement(child, { ...props, isOpen: isOpen } as React.ComponentProps<typeof ChatWindow>);
                                // Передаем isOpen как пропс в ChatWindow
                            }
                            return child;
                        })}
                        </ScrollArea>
                    </div>
                </div>
                <div className="new-content-container">
                    <div className="new-main-content">
                        {selectedContact !== null ? (
                            <ChatWindow isOpen={isOpen} contactId={selectedContact} onSelectContact={handleContactSelect} toggleSidebar={toggleSidebar} /> // Передаем isOpen и toggleSidebar как пропсы в ChatWindow
                        ) : (
                            <ChatSSRSkeleton />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    function NavItem({ href, text }: { href: string, text: string }) {
        const pathname = usePathname();
        const [cleanHref, setCleanHref] = useState('');
    
        useEffect(() => {
            const cleanPathname = pathname.replace(/^\/(ru|ka|es)\//, '/');
            setCleanHref(cleanPathname);
        }, [pathname]);
    
        return (
            <div className="me-2">
                <Link href={href}>
                    <div className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${cleanHref === href ? 'border-primary text-primary' : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group'}`}>
                        <span>{text}</span> 
                    </div>
                </Link>
            </div>
        );
    }
}