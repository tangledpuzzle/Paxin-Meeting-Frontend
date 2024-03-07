import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export interface ChatRoom {
  id: string;
  lastMessage: {
    id: string;
    message: string;
    owner: string;
  };
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
  setChatRooms: Dispatch<SetStateAction<ChatRoom[]>>;
  activeRoom: string;
  setActiveRoom: Dispatch<SetStateAction<string>>;
  activeRoomSubscribed: boolean;
  setActiveRoomSubscribed: Dispatch<SetStateAction<boolean>>;
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  isMessageLoading: boolean;
  setIsMessageLoading: Dispatch<SetStateAction<boolean>>;
  isRoomLoading: boolean;
  setIsRoomLoading: Dispatch<SetStateAction<boolean>>;
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
