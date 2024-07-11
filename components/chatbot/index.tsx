"use client";

import { useState, useRef, useEffect } from "react";
import ChatLogItem from "./ChatLogItem";
import TypingAnimation from "./TypingAnimation";
import axiosChat from "@/app/api/axiosChat";
import { ChatCompletion } from "./chatData";
import toast from "react-hot-toast";
import React from "react";
import { BotMessageSquare, MessageCircle, Send, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
interface ChatMessage {
  type: "user" | "bot";
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
  const [inputValue, setInputValue] = useState<string>("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim() === "") {
      toast.error("Please enter a message");
      return;
    }

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: inputValue },
    ]);

    sendMessage(inputValue);

    setInputValue("");
  };

  const sendMessage = (message: string) => {
    const URL = "/completions";

    const data = {
      model: aiModel ? aiModel : "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: message }],
    };

    setIsLoading(true);

    axiosChat<ChatCompletion>({ method: "POST", url: URL, data: data })
      .then((response) => {
        console.log(response);
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { type: "bot", message: response.choices[0].message.content },
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
          id="chatbot"
          className={`z-[500] bg-primary fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium border rounded-full w-16 h-16 m-0 cursor-pointer border-gray-200 bg-none  ${
            isChatOpen ? "chat-open" : "chat-closed"
          }`}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isChatOpen}
          onClick={toggleChat}
        >
          <MessageCircle className="size-10 text-primary-foreground" />
        </button>
        {isChatOpen && (
          <div
            id="hs-chatbot-container"
            className={`fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-muted borrder-r-2 border border-gray-200 rounded-xl w-[440px] h-[560px] z-[500] ${
              isChatOpen ? "chat-open" : "chat-closed"
            }`}
          >
            {/* Heading */}
            <div className="flex justify-between items-center space-y-1.5 p-6 rounded-t-xl bg-background border-b">
              <div className="flex flex-row">
                <span className="flex-shrink-0 mr-4 inline-flex items-center justify-center size-14 rounded-full bg-primary">
                  <span className="font-medium text-white leading-none">
                    <BotMessageSquare className="size-10" />
                  </span>
                </span>
                <div>
                  <h2 className="font-semibold text-xl text-primary tracking-tight">
                    {title}
                  </h2>
                  <p className=" text-muted-foreground mt-2">{subtitle}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleChat}
                className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-primary transition-all  dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                data-hs-overlay="#hs-focus-management-modal"
              >
                <span className="sr-only">Close</span>
                <X />
              </button>
            </div>
            <div id="hs-message-container" className="px-6 pb-6">
              {/* Chat Container */}
              <div
                ref={chatContainerRef}
                id="chat-container"
                className="pr-4 h-[400px]"
                style={{
                  minWidth: "100%",
                  overflowY: "scroll",
                }}
              >
                <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
                  <span className="flex-shrink-0 inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full bg-primary">
                    <span className="text-sm font-medium text-white leading-none">
                      <BotMessageSquare />
                    </span>
                  </span>

                  <p className="leading-relaxed">
                    <span className="block font-bold text-muted-foreground">
                      {botName}
                    </span>
                    <p className="text-sm text-foreground">{welcomeMessage}</p>
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
                  <div key={chatLog.length} className="flex justify-start">
                    <div className="bg-gray-200 rounded-lg p-4 text-white max-w-sm">
                      <TypingAnimation />
                    </div>
                  </div>
                )}
              </div>
              {/* Input box  */}
              <div className="flex items-center pt-0">
                <form
                  className="flex items-center justify-center w-full space-x-2"
                  onSubmit={handleSubmit}
                >
                  <Input
                    className="flex h-10 w-full rounded-md "
                    placeholder="Type your message"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Button
                    variant={"outline"}
                    className="text-primary"
                    type="submit"
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
