"use client";

import { useState } from "react";
import ChatLogItem from "./ChatLogItem";
import TypingAnimation from "./TypingAnimation";
import axiosChat from "@/app/api/axiosChat";
import { ChatCompletion } from "./chatData";
import toast from "react-hot-toast";
import React from "react";
interface ChatMessage {
  type: "user" | "bot";
  message: string;
}

const ChatBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      model: "mistralai/mistral-7b-instruct:free",
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
  return (
    <>
      {/* component */}
      <div>
        <button
          id="chatbot"
          className={`z-[500] fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium border rounded-full w-14 h-14 bg-rose-900 hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900 ${
            isChatOpen ? "chat-open" : "chat-closed"
          }`}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isChatOpen}
          onClick={toggleChat}
        >
          <svg
            xmlns=" http://www.w3.org/2000/svg"
            width={30}
            height={40}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white block border-gray-200 align-middle"
          >
            <path
              d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"
              className="border-gray-200"
            ></path>
          </svg>
        </button>
        {isChatOpen && (
          <div
            id="hs-chatbot-container"
            className={`fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white  rounded-lg border border-[#e5e7eb] w-[440px] h-[560px] z-[500] ${
              isChatOpen ? "chat-open" : "chat-closed"
            }`}
          >
            {/* Heading */}
            <div className="flex justify-between items-center space-y-1.5 p-6 bg-slate-700  border-b">
              <div>
                <h2 className="font-semibold text-white text-lg tracking-tight">
                  Tailbot
                </h2>
                <p className="text-sm text-gray-300 mt-2">
                  Your friendly chat bot.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleChat}
                className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-white hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all  dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                data-hs-overlay="#hs-focus-management-modal"
              >
                <span className="sr-only">Close</span>
                <i className="bi bi-x-lg text-xl"></i>
              </button>
            </div>
            <div id="hs-message-container" className="px-6 pb-6">
              {/* Chat Container */}
              <div
                id="chat-container"
                className="pr-4 h-[400px]"
                style={{
                  minWidth: "100%",
                  overflowY: "scroll",
                }}
              >
                <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
                  <span className="flex-shrink-0 inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full bg-rose-800">
                    <span className="text-sm font-medium text-white leading-none">
                      <i className="bi bi-robot text-white  text-lg"></i>
                    </span>
                  </span>

                  <p className="leading-relaxed">
                    <span className="block font-bold text-gray-700">
                      Tailbot
                    </span>
                    <p className="text-sm">
                      Welcome to Tailchat bot AI.How can we help you?
                    </p>
                  </p>
                </div>
                {chatLog.map((message, index) => (
                  <ChatLogItem
                    key={index}
                    type={message.type}
                    message={message.message}
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
                  <input
                    className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                    placeholder="Type your message"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-slate-700 hover:bg-[#111827E6] h-10 px-4 py-2"
                    type="submit"
                  >
                    <i className="bi bi-send"></i>
                  </button>
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
