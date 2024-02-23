"use client"
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { FaUsersLine } from "react-icons/fa6";
import { ScrollArea } from '@/components/ui/scroll-area';
import { IoIosClose } from "react-icons/io";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import eventBus from '@/eventBus';

interface MessagesProps {
    children: React.ReactNode;
}

const ChatSSRSkeleton = dynamic(
    () => import('@/components/dialogs/skeleton'),
    { ssr: true }
);

interface ChatWindowProps {
    contactId: number;
    onSelectContact: (contactId: number) => void;
}


export default function Messages({ children }: MessagesProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedContact, setSelectedContact] = useState<number | null>(null);
    const pathname = usePathname();
    const router = useRouter(); // Инициализация useRouter

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

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
            setIsOpen(!isOpen);
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
            if (lastSegment !== 'followers') {
                const slug = segments[3]; 
                setSelectedContact(parseInt(slug));
            }
        }
    }, [pathname]);


    return (
        <div>
            <div className={`new-container${isOpen ? ' open' : ''}`}>
                <div className="new-sidebar pt-[70px]">
                    <div className="h-screen w-full py-8 overflow-y-auto bg-card-gradient border-l border-r">
                        <div className="px-5 text-lg font-medium text-gray-800 dark:text-white">
                            <button className="toggle-btn  absolute z-10 top-24 right-4" onClick={toggleSidebar}>
                                <IoIosClose size={24} />
                            </button>
                            <div className="">
                                <nav className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                                    <NavItem href="/profile/messages/followers" text="Followers" />
                                    <NavItem href="/profile/messages" text="Open dialogs" />
                                    {/* <NavItem href="/profile/messages/settings" text="Settings" /> */}
                                </nav>
                            </div>
                        </div>
                        <ScrollArea className="h-[calc(100vh_-_18rem)] rounded-lg bg-background p-4">
                        {React.Children.map(children, child => {
                            if (React.isValidElement(child)) {
                                const props = { onSelectContact: handleContactSelect } as React.ComponentProps<typeof ChatWindow>;
                                return React.cloneElement(child, props);
                            }
                            return child;
                        })}
                        </ScrollArea>
                    </div>
                </div>
                <div className="new-content-container">
                    <div className="new-main-content">
                            
                        {selectedContact !== null ? (
                            <ChatWindow contactId={selectedContact} onSelectContact={handleContactSelect} />
                        ) : (
                            <ChatSSRSkeleton />
                        )}


                        <div className={`bg-background h-[100px]${isOpen ? 'hidden' : ' '}`}>
                            <div className='flex'>
                                <button className="toggle-btn  absolute z-10" onClick={toggleSidebar}>
                                    <FaUsersLine size={24} />
                                    <span className='vertical-text'>nav</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    function NavItem({ href, text }: { href: string, text: string }) {
        const pathname = usePathname();
        const [cleanHref, setCleanHref] = useState('');
    
        useEffect(() => {
            // Удаление языкового префикса из текущего пути
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

function ChatWindow({ contactId, onSelectContact }: ChatWindowProps) {
    return (
        <div>
            <div id="chat-container">
                chat {contactId}
            <div id="chat-input">
                <div id="file-input">
                </div>
                {/* <div className='flex justify-between'>
                    <div>
                        +
                    </div>
                    <div  className='w-full'>
                        <input></input>
                    </div>
                    <div>
                        <div className='btn'></div>
                    </div>

                </div> */}
            </div>
            </div>
        </div>
    );
}
