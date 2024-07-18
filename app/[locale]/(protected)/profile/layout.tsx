"use client"
import Sidebar from '@/components/profiles/sidebar';
import { ReactNode } from 'react';
import CTASection from '@/components/profiles/cta';
import { MdDashboard, MdSettings, MdPostAdd } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import { GiVideoConference } from "react-icons/gi";
import { IoIosNotifications } from "react-icons/io";


type ProfileConfig = {
  [key: string]: {
    icon: IconType;
    titleKey: string;
    descriptionKey: string;
  };
};

const profileConfig: ProfileConfig = {
  '/profile/posts': {
    icon: MdPostAdd,
    titleKey: 'my_posts',
    descriptionKey: 'my_posts_description',
  },
  '/profile/setting': {
    icon: MdSettings,
    titleKey: 'settings',
    descriptionKey: 'setting_description',
  },
  '/profile': {
    icon: MdDashboard,
    titleKey: 'dashboard',
    descriptionKey: 'dashboard_description',
  },
  '/profile/conference': {
    icon: GiVideoConference,
    titleKey: 'conference',
    descriptionKey: 'conference_description',
  },
  '/profile/notifications': {
    icon: IoIosNotifications,
    titleKey: 'notifications',
    descriptionKey: 'conference_description',
  }
};

type Props = {
  children: ReactNode;
};

export default function ProfilePageLayout({ children }: Props) {
  const pathname = usePathname();
  const t = useTranslations('main');

  const getConfigForPath = (path: string) => {
    // Удаляем префикс локали из пути
    const pathWithoutLocale = path.replace(/^\/(ru|es|ka)/, '');

    return profileConfig[pathWithoutLocale] || profileConfig['/profile'];
  };

  const config = getConfigForPath(pathname);

  return (
    <div className='absolute top-0 flex w-full'>
      <Sidebar />
      <main className='mb-0 mt-20 w-full bg-secondary/60 md:mb-0'>
        <div className='px-4 py-4'>
          <CTASection
            //@ts-ignore
            title={t(config.titleKey)}
            //@ts-ignore
            description={t(config.descriptionKey)}
            icon={config.icon}
          />
        </div>
        {children}
      </main>
    </div>
  );
}
