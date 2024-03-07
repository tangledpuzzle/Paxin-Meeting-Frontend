import { createContext, useContext } from 'react';

export interface ChatRoom {
  id: string;
  lastMessage: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    online: boolean;
  };
  subscribed: boolean;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  owner: {
    id: string;
    name: string;
    avatar: string;
  };
  isDeleted?: boolean;
  isEdited?: boolean;
  timestamp: string;
}

export interface ChatContent {
  chatRooms: ChatRoom[];
  setChatRooms: (chatRooms: ChatRoom[]) => void;
  activeRoom: string;
  setActiveRoom: (activeRoom: string) => void;
  activeRoomSubscribed: boolean;
  setActiveRoomSubscribed: (activeRoomSubscribed: boolean) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  isMessageLoading: boolean;
  setIsMessageLoading: (isMessageLoading: boolean) => void;
  isRoomLoading: boolean;
  setIsRoomLoading: (isRoomLoading: boolean) => void;
}

export const PaxChatContext = createContext<ChatContent>({
  chatRooms: [],
  setChatRooms: () => {},
  activeRoom: '',
  setActiveRoom: () => {},
  activeRoomSubscribed: false,
  setActiveRoomSubscribed: () => {},
  messages: [],
  setMessages: () => {},
  isMessageLoading: false,
  setIsMessageLoading: () => {},
  isRoomLoading: false,
  setIsRoomLoading: () => {},
});

export const usePaxChatContext = () => useContext(PaxChatContext);
