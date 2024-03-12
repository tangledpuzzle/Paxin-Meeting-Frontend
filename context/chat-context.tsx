import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export interface ChatUserType {
  id: string;
  profile: {
    name: string;
    avatar: string;
    categories: string[];
    bio: string;
  };
  online: boolean;
  bot: boolean;
}

export interface ChatRoomType {
  id: string;
  lastMessage: {
    id: string;
    message: string;
    owner: string;
  };
  user: ChatUserType;
  subscribed: boolean;
  timestamp: string;
}

export interface ChatMessageType {
  id: string;
  message: string;
  owner: {
    id: string;
    name: string;
    avatar: string;
  };
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  isDeleted?: boolean;
  isEdited?: boolean;
  timestamp: string;
}

export interface ChatContent {
  showNav: boolean;
  setShowNav: Dispatch<SetStateAction<boolean>>;
  chatRooms: ChatRoomType[];
  setChatRooms: Dispatch<SetStateAction<ChatRoomType[]>>;
  activeRoom: string;
  setActiveRoom: Dispatch<SetStateAction<string>>;
  chatUser: ChatUserType | null;
  setChatUser: Dispatch<SetStateAction<ChatUserType | null>>;
  activeRoomSubscribed: boolean;
  setActiveRoomSubscribed: Dispatch<SetStateAction<boolean>>;
  messages: ChatMessageType[];
  setMessages: Dispatch<SetStateAction<ChatMessageType[]>>;
  isMessageLoading: boolean;
  setIsMessageLoading: Dispatch<SetStateAction<boolean>>;
  isRoomLoading: boolean;
  setIsRoomLoading: Dispatch<SetStateAction<boolean>>;
}

export const PaxChatContext = createContext<ChatContent>({
  showNav: true,
  setShowNav: () => {},
  chatRooms: [],
  setChatRooms: () => {},
  activeRoom: '',
  setActiveRoom: () => {},
  chatUser: null,
  setChatUser: () => {},
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
