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
  activeRoom: ChatRoom | null;
  setActiveRoom: (activeRoom: ChatRoom | null) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
}

export const PaxChatContext = createContext<ChatContent>({
  chatRooms: [],
  setChatRooms: () => {},
  activeRoom: null,
  setActiveRoom: () => {},
  messages: [],
  setMessages: () => {},
});

export const usePaxChatContext = () => useContext(PaxChatContext);
