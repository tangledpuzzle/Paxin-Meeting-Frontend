'use client';

import { usePathname, useRouter } from 'next/navigation';
import eventBus from '@/eventBus';
import { TiMessages } from 'react-icons/ti';

export default function AlarmNav() {
  const pathname = usePathname();
  const router = useRouter();

  const checkMessagesInPathname = () => {
    if (pathname.includes('messages')) {
      eventBus.emit('startChat', '0');
    } else {
      router.push('/profile/messages');
    }
  };

  return (
    <div>
      <button onClick={checkMessagesInPathname}>
        <div className='flex items-center justify-center'>
          <span className='relative -top-2 left-12 rounded-full bg-card-gradient-menu px-2 text-center text-xs'>
            10
          </span>
          <TiMessages size={32} />
        </div>
      </button>
    </div>
  );
}
