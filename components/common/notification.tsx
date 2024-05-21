'use client'
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client"; // Ensure correct imports

interface Notification {
  name: string;
  message: string;
}

export default function NotificationMessage() {
  // Directly use `io` to get a `Socket` instance
  const socket: Socket = io("http://localhost:4000");
  alert('sdfs')

  // Using TypeScript to specify the state's structure
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen]=useState<boolean>(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connected to server`);
    });

    socket.on('notification', (data: Notification) => {
      console.log(`Notification from server`, data);
      alert('dsfdfs')
      setNotifications((prevNotifications) => [...prevNotifications, data]);
    });

    socket.on('disconnect', () => {
      console.log(`Disconnected from server`);
    });

    // Clean up the effect to avoid memory leaks by disconnecting and removing event listeners
    return () => {
      socket.off('connect');
      socket.off('notification');
      socket.off('disconnect');
      // If necessary, explicitly disconnect (might not be needed depending on use case)
      // socket.disconnect();
    };
  }, []); // Removed [socket] to avoid recreating the effect unnecessarily, as `socket` does not change

  return (
    <main className="grid grid-cols-2 p-24 gap-6">
            <div key='12' id="toast-message-cta"
                className="w-full max-w-xs p-4 text-gray-500 
            bg-white rounded-lg shadow dark:bg-gray-800 
            dark:text-gray-400" role="alert">
                <div className="flex">
                    <img className="w-8 h-8 rounded-full"
                        src="notification.png" alt="Notification image" />
                    <div className="ms-3 text-sm font-normal">
                        <span className="mb-1 text-sm font-semibold
                     text-gray-900 dark:text-white">
                            'asdf'</span>
                        <div className="mb-2 text-sm font-normal">
                            '3q5eqfq'</div>
                        <a href="#" className="inline-flex px-2.5
                     py-1.5 text-xs font-medium text-center 
                     text-white bg-blue-600 rounded-lg hover:bg-blue-700
                      focus:ring-4 focus:outline-none focus:ring-blue-300
                       dark:bg-blue-500 dark:hover:bg-blue-600 
                       dark:focus:ring-blue-800">Reply</a>
                    </div>
                    <button type="button" className="ms-auto -mx-1.5
                 -my-1.5 bg-white justify-center items-center
                  flex-shrink-0 text-gray-400 hover:text-gray-900
                   rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5
                    hover:bg-gray-100 inline-flex h-8 w-8 
                    dark:text-gray-500 dark:hover:text-white dark:bg-gray-800
                     dark:hover:bg-gray-700"
                        data-dismiss-target="#toast-message-cta"
                        aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor"
                                strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                    </button>
                </div>
            </div>
    </main>
  );
}