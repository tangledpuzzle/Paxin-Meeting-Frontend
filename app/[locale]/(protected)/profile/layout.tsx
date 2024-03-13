import Sidebar from '@/components/profiles/sidebar';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function ProfilePageLayout({ children }: Props) {
  return (
    <div className='absolute top-0 flex w-full'>
      <Sidebar />
      <main className='mb-0 mt-20 w-full bg-secondary/60 md:mb-0'>
        {children}
      </main>
    </div>
  );
}
