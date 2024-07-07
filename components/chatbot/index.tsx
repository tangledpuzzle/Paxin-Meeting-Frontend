'use client';

import { useState, useRef, useEffect } from 'react';
import ChatLogItem from './ChatLogItem';
import TypingAnimation from './TypingAnimation';
import axiosChat from '@/app/api/axiosChat';
import { ChatCompletion } from './chatData';
import toast from 'react-hot-toast';
import React from 'react';
import { BotMessageSquare, MessageCircle, Send, X } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
interface ChatMessage {
  type: 'user' | 'bot';
  message: string;
}

type ChatBotProps = {
  title: string;
  subtitle: string;
  botName: string;
  welcomeMessage: string;
  aiModel?: string;
};

const ChatBot: React.FC<ChatBotProps> = ({
  title,
  subtitle,
  botName,
  welcomeMessage,
  aiModel,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim() === '') {
      toast.error('Please enter a message');
      return;
    }

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: 'user', message: inputValue },
    ]);

    sendMessage(inputValue);

    setInputValue('');
  };

  const sendMessage = (message: string) => {
    const URL = '/completions';

    const data = {
      model: aiModel ? aiModel : 'mistralai/mistral-7b-instruct:free',
      messages: [{ role: 'user', content: message }],
    };

    setIsLoading(true);

    axiosChat<ChatCompletion>({ method: 'POST', url: URL, data: data })
      .then((response) => {
        console.log(response);
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { type: 'bot', message: response.choices[0].message.content },
        ]);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [isLoading]);
  return (
    <>
      {/* component */}
      <div>
        <button
          id='chatbot'
          className={`fixed bottom-4 right-4 z-[500] m-0 inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-primary bg-none text-sm font-medium  ${
            isChatOpen ? 'chat-open' : 'chat-closed'
          }`}
          type='button'
          aria-haspopup='dialog'
          aria-expanded={isChatOpen}
          onClick={toggleChat}
        >
          <MessageCircle className='size-10 text-primary-foreground' />
        </button>
        {isChatOpen && (
          <div
            id='hs-chatbot-container'
            className={`borrder-r-2 fixed bottom-[calc(4rem+1.5rem)] right-0 z-[500] mr-4 h-[560px] w-[440px] rounded-xl border border-gray-200 bg-muted ${
              isChatOpen ? 'chat-open' : 'chat-closed'
            }`}
          >
            {/* Heading */}
            <div className='flex items-center justify-between space-y-1.5 rounded-t-xl border-b bg-background p-6'>
              <div className='flex flex-row'>
                <span className='mr-4 inline-flex size-14 flex-shrink-0 items-center justify-center rounded-full bg-primary'>
                  <span className='font-medium leading-none text-white'>
                    <BotMessageSquare className='size-10' />
                  </span>
                </span>
                <div>
                  <h2 className='text-xl font-semibold tracking-tight text-primary'>
                    {title}
                  </h2>
                  <p className=' mt-2 text-muted-foreground'>{subtitle}</p>
                </div>
              </div>

              <button
                type='button'
                onClick={toggleChat}
                className='hs-dropdown-toggle inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2  dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800'
                data-hs-overlay='#hs-focus-management-modal'
              >
                <span className='sr-only'>Close</span>
                <X />
              </button>
            </div>
            <div id='hs-message-container' className='px-6 pb-6'>
              {/* Chat Container */}
              <div
                ref={chatContainerRef}
                id='chat-container'
                className='h-[400px] pr-4'
                style={{
                  minWidth: '100%',
                  overflowY: 'scroll',
                }}
              >
                <div className='my-4 flex flex-1 gap-3 text-sm text-gray-600'>
                  <span className='inline-flex h-[2.375rem] w-[2.375rem] flex-shrink-0 items-center justify-center rounded-full bg-primary'>
                    <span className='text-sm font-medium leading-none text-white'>
                      <BotMessageSquare />
                    </span>
                  </span>

                  <p className='leading-relaxed'>
                    <span className='block font-bold text-muted-foreground'>
                      {botName}
                    </span>
                    <p className='text-sm text-foreground'>{welcomeMessage}</p>
                  </p>
                </div>
                {chatLog.map((message, index) => (
                  <ChatLogItem
                    key={index}
                    type={message.type}
                    message={message.message}
                    botName={botName}
                  />
                ))}
                {isLoading && (
                  <div key={chatLog.length} className='flex justify-start'>
                    <div className='max-w-sm rounded-lg bg-gray-200 p-4 text-white'>
                      <TypingAnimation />
                    </div>
                  </div>
                )}
              </div>
              {/* Input box  */}
              <div className='flex items-center pt-0'>
                <form
                  className='flex w-full items-center justify-center space-x-2'
                  onSubmit={handleSubmit}
                >
                  <Input
                    className='flex h-10 w-full rounded-md '
                    placeholder='Type your message'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Button
                    variant={'outline'}
                    className='text-primary'
                    type='submit'
                  >
                    <Send />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBot;
