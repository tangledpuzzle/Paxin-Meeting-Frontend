'use client';

import { HiUserGroup } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { RiArticleLine, RiUserSettingsFill } from 'react-icons/ri';
import { usePathname } from 'next/navigation';

import { NavItem } from '@/types/nav';
import { cn } from '@/lib/utils';

import { ProfileNav } from './profile-nav';

const navItems: NavItem[] = [
  {
    title: 'dashboard',
    href: '/profile/messages',
    disabled: false,
    external: false,
    icon: MdDashboard,
    label: 'Dashboard',
    description: '',
  },
  {
    title: 'my_posts',
    href: '/profile/posts',
    disabled: false,
    external: false,
    icon: RiArticleLine,
    label: 'My Posts',
    description: '',
  },
  {
    title: 'settings',
    href: '/profile/setting',
    disabled: false,
    external: false,
    icon: RiUserSettingsFill,
    label: 'Setting',
    description: '',
  },
  {
    title: 'conference',
    href: '/profile/conference',
    external: false,
    disabled: false,
    icon: HiUserGroup,
    label: 'Conference',
    description: '',
  },
];

export default function Sidebar() {
  const router = usePathname();

  let pathWithoutLanguagePrefix;
  if (router.startsWith('/ru/')) {
    console.log(router.startsWith('/ru/'))
    pathWithoutLanguagePrefix = router.slice(3);
    console.log(pathWithoutLanguagePrefix)
  } else if (router.startsWith('/ka/')) {
    pathWithoutLanguagePrefix = router.slice(3); 
  } else if (router.startsWith('/es/')) {
    pathWithoutLanguagePrefix = router.slice(3); 
  } else {
    pathWithoutLanguagePrefix = router; 
  }
  
  const isMessagesPage = pathWithoutLanguagePrefix === '/profile/messages';

  return (
    <div>
    { !isMessagesPage && (
    <nav
      className={cn(
        `fixed bottom-0 z-30 w-full border-t bg-background sm:relative sm:h-screen sm:w-auto sm:border-r sm:pt-16 lg:w-72`
      )}
    >
      <div className='sm:space-y-4 sm:py-4'>
        <div className='px-3 py-0'>
          <div className='space-y-1'>
            <ProfileNav items={navItems} hideSidebar={isMessagesPage}  />
          </div>
        </div>
      </div>

    </nav>
    )}
    </div>
      

  );
}
