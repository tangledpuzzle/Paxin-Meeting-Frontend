import React from "react";
import toast from "react-hot-toast";
interface ChatMessage {
  type: "user" | "bot";
  message: string;
}

const ChatLogItem: React.FC<ChatMessage> = ({ type, message }) => {
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
        <span className="flex-shrink-0 inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full bg-gray-600">
          <span className="text-sm font-medium text-white leading-none">
            <i className="bi bi-person text-white  text-lg"></i>
          </span>
        </span>
        <p className="leading-relaxed">
          <span className="block font-bold text-gray-700">You </span>
          <p className="text-sm">{message}</p>
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
        <span className="flex-shrink-0 inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full bg-rose-800">
          <span className="text-sm font-medium text-white leading-none">
            <i className="bi bi-robot text-white  text-lg"></i>
          </span>
        </span>

        <p className="leading-relaxed">
          <span className="block font-bold text-gray-700">Tailbot </span>
          <p className="text-sm">{message}</p>
          <div className="sm:flex sm:justify-between pt-2">
            <div>
              <div className="inline-flex border border-gray-200 rounded-full p-0.5 dark:border-gray-700">
                <button
                  onClick={handleLikeClick}
                  type="button"
                  className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  <svg
                    className="flex-shrink-0 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleUnlikeClick}
                  className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  <svg
                    className="flex-shrink-0 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 14V2" />
                    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                  </svg>
                </button>
              </div>
              <button
                type="button"
                onClick={handleCopyClick}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              >
                <i className="bi bi-clipboard-check"></i>
                Copy
              </button>
            </div>
            <div className="mt-1 sm:mt-0">
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              >
                <i className="bi bi-share"></i>
                Share
              </button>
            </div>
          </div>
        </p>
      </div>
    );
  }
};

export default ChatLogItem;
