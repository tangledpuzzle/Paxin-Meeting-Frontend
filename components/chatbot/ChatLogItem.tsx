import {
  BotMessageSquare,
  Copy,
  ThumbsDown,
  ThumbsUp,
  User,
} from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';
interface ChatMessage {
  type: 'user' | 'bot';
  message: string;
  botName: string;
}

const ChatLogItem: React.FC<ChatMessage> = ({ type, message, botName }) => {
  const handleLikeClick = () => {
    toast.success('Liked!');
  };
  const handleUnlikeClick = () => {
    toast.success('Disliked!');
  };
  const handleCopyClick = () => {
    const textToCopy = message;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // Handle successful copy
        toast.success('Text copied to clipboard');
        console.log('Text copied to clipboard');
      })
      .catch((error) => {
        // Handle error
        console.error('Copy to clipboard failed', error);
      });
  };

  if (type === 'user') {
    return (
      <div className='my-4 flex flex-1 gap-3 text-sm text-gray-600'>
        <span className='inline-flex size-[2.375rem] shrink-0 items-center justify-center rounded-full bg-secondary-foreground'>
          <span className='text-sm font-medium leading-none text-white'>
            <User />
          </span>
        </span>
        <p className='leading-relaxed'>
          <span className='block font-bold text-muted-foreground'>You </span>
          <p className='text-sm text-foreground'>{message}</p>
        </p>
      </div>
    );
  } else {
    return (
      <div className='my-4 flex flex-1 gap-3 text-sm text-gray-600'>
        <span className='inline-flex size-[2.375rem] shrink-0 items-center justify-center rounded-full bg-primary'>
          <span className='text-sm font-medium leading-none text-white'>
            <BotMessageSquare />
          </span>
        </span>

        <p className='leading-relaxed'>
          <span className='block font-bold text-muted-foreground'>
            {botName}
          </span>
          <p className='text-sm text-foreground'>{message}</p>
          <div className='pt-2 sm:flex sm:justify-between'>
            <div>
              <div className='inline-flex rounded-full border border-gray-200 p-0.5 dark:border-gray-700'>
                <button
                  onClick={handleLikeClick}
                  type='button'
                  className='inline-flex size-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
                >
                  <ThumbsUp className='size-4' />
                </button>
                <button
                  type='button'
                  onClick={handleUnlikeClick}
                  className='inline-flex size-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
                >
                  <ThumbsDown className='size-4' />
                </button>
              </div>
              <button
                type='button'
                onClick={handleCopyClick}
                className='inline-flex items-center gap-x-2 rounded-full border border-transparent px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
              >
                <Copy className='size-4' />
                Copy
              </button>
            </div>
          </div>
        </p>
      </div>
    );
  }
};

export default ChatLogItem;
