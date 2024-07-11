'use client';
import eventBus from '@/eventBus';
import BackButton from '@/components/home/back-button';

const MessageWithCatchAll = () => {
  const handleContactSelect = (contactId: number) => {
    eventBus.emit('startChat', contactId);
  };

  return (
    <div className='mx-auto max-w-sm overflow-hidden rounded-lg bg-white shadow-lg dark:bg-card-gradient-menu'>
      <div className='border-b px-4 pb-6'>
        <BackButton callback='' />
        <div className='my-4 text-center'>
          <img
            className='mx-auto my-4 h-32 w-32 rounded-full border-4 border-white hover:!border-[#00B887] dark:border-gray-800'
            src='https://randomuser.me/api/portraits/women/21.jpg'
            alt=''
          />
          <div className='py-2'>
            <h3 className='mb-1 text-2xl font-bold text-gray-800 dark:text-white'>
              Cait Genevieve
            </h3>
            <div className='inline-flex items-center text-gray-700 dark:text-gray-300'>
              <svg
                className='mr-1 h-5 w-5 text-gray-400 dark:text-gray-600'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                width='24'
                height='24'
              >
                <path
                  className=''
                  d='M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'
                />
              </svg>
              New York, NY
            </div>
          </div>
        </div>
        <div className='flex gap-2 px-2'>
          <button className='flex-1 rounded-md border-2  border-gray-400 px-4 py-2 font-semibold text-black hover:!border-[#00B887] dark:border-gray-700  dark:text-white'>
            Follow
          </button>
          <button
            onClick={() => handleContactSelect(3)}
            className='flex-1 rounded-md border-2  border-gray-400 px-4 py-2 font-semibold text-black hover:!border-[#00B887] dark:border-gray-700  dark:text-white'
          >
            Message
          </button>
        </div>
      </div>
      <div className='px-4 py-4'>
        <div className='mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-300'>
          <svg
            className='h-6 w-6 text-gray-600 dark:text-gray-400'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            width='24'
            height='24'
          >
            <path
              className=''
              d='M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z'
            />
          </svg>
          <span>
            <strong className='text-black dark:text-white'>12</strong> Followers
            you know
          </span>
        </div>
        <div className='flex'>
          <div className='mr-2 flex justify-end'>
            <img
              className='-mr-2 h-10 w-10 rounded-full border-2 border-white dark:border-gray-800'
              src='https://randomuser.me/api/portraits/men/32.jpg'
              alt=''
            />
            <img
              className='-mr-2 h-10 w-10 rounded-full border-2 border-white dark:border-gray-800'
              src='https://randomuser.me/api/portraits/women/31.jpg'
              alt=''
            />
            <img
              className='-mr-2 h-10 w-10 rounded-full border-2 border-white dark:border-gray-800'
              src='https://randomuser.me/api/portraits/men/33.jpg'
              alt=''
            />
            <img
              className='-mr-2 h-10 w-10 rounded-full border-2 border-white dark:border-gray-800'
              src='https://randomuser.me/api/portraits/women/32.jpg'
              alt=''
            />
            <img
              className='-mr-2 h-10 w-10 rounded-full border-2 border-white dark:border-gray-800'
              src='https://randomuser.me/api/portraits/men/44.jpg'
              alt=''
            />
            <img
              className='-mr-2 h-10 w-10 rounded-full border-2 border-white dark:border-gray-800'
              src='https://randomuser.me/api/portraits/women/42.jpg'
              alt=''
            />
            <span className='flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-sm font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white'>
              +999
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageWithCatchAll;
