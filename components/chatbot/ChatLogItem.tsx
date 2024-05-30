import {
    BotMessageSquare,
    Copy,
    ThumbsDown,
    ThumbsUp,
    User,
  } from "lucide-react";
  import React from "react";
  import toast from "react-hot-toast";
  interface ChatMessage {
    type: "user" | "bot";
    message: string;
    botName: string;
  }
  
  const ChatLogItem: React.FC<ChatMessage> = ({ type, message, botName }) => {
    const handleLikeClick = () => {
      toast.success("Liked!");
    };
    const handleUnlikeClick = () => {
      toast.success("Disliked!");
    };
    const handleCopyClick = () => {
      const textToCopy = message;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          // Handle successful copy
          toast.success("Text copied to clipboard");
          console.log("Text copied to clipboard");
        })
        .catch((error) => {
          // Handle error
          console.error("Copy to clipboard failed", error);
        });
    };
  
    if (type === "user") {
      return (
        <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
          <span className="flex-shrink-0 inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full bg-secondary-foreground">
            <span className="text-sm font-medium text-white leading-none">
              <User />
            </span>
          </span>
          <p className="leading-relaxed">
            <span className="block font-bold text-muted-foreground">You </span>
            <p className="text-sm text-foreground">{message}</p>
          </p>
        </div>
      );
    } else {
      return (
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
            <p className="text-sm text-foreground">{message}</p>
            <div className="sm:flex sm:justify-between pt-2">
              <div>
                <div className="inline-flex border border-gray-200 rounded-full p-0.5 dark:border-gray-700">
                  <button
                    onClick={handleLikeClick}
                    type="button"
                    className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  >
                    <ThumbsUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleUnlikeClick}
                    className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  >
                    <ThumbsDown className="size-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleCopyClick}
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-xs rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  <Copy className="size-4" />
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
  