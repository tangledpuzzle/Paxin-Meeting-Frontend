import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export interface ChatUserType {
  id: string;
  profile: {
    name: string;
    avatar: string;
    categories: string[];
    bio: string;
  };
  lastSeenMessage: string;
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
  unreadCount: number;
  lastSeenMessage: string;
  timestamp: string;
}

export interface ChatMessageType {
  id: string;
  parentMessageId?: string;
  messageType?: '0' | '1' | '2';
  message: string;
  customData?: any;
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
  isPending?: boolean;
  timestamp: string;
}

export interface ChatContent {
  showNav: boolean;
  setShowNav: Dispatch<SetStateAction<boolean>>;
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
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
  isOnline: boolean;
  setIsOnline: Dispatch<SetStateAction<boolean>>;
  inputMessage: string;
  setInputMessage: Dispatch<SetStateAction<string>>;
  isLoadingSubmit: boolean;
  setIsLoadingSubmit: Dispatch<SetStateAction<boolean>>;
  isDeleting: boolean;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  isReplying: boolean;
  setIsReplying: Dispatch<SetStateAction<boolean>>;
  deleteMessageId: string;
  setDeleteMessageId: Dispatch<SetStateAction<string>>;
  editMessageId: string;
  setEditMessageId: Dispatch<SetStateAction<string>>;
  replyMessageId: string;
  setReplyMessageId: Dispatch<SetStateAction<string>>;
  uploadedFiles: File[];
  setUploadedFiles: Dispatch<SetStateAction<File[]>>;
  chatWindowHeight: string;
  setChatWindowHeight: Dispatch<SetStateAction<string>>;
  prevScrollHeight: number;
  setPrevScrollHeight: Dispatch<SetStateAction<number>>;
}

export const PaxChatContext = createContext<ChatContent>({
  showNav: true,
  setShowNav: () => {},
  showSidebar: true,
  setShowSidebar: () => {},
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
  isOnline: false,
  setIsOnline: () => {},
  inputMessage: '',
  setInputMessage: () => {},
  isLoadingSubmit: false,
  setIsLoadingSubmit: () => {},
  isDeleting: false,
  setIsDeleting: () => {},
  isEditing: false,
  setIsEditing: () => {},
  isReplying: false,
  setIsReplying: () => {},
  deleteMessageId: '',
  setDeleteMessageId: () => {},
  editMessageId: '',
  setEditMessageId: () => {},
  replyMessageId: '',
  setReplyMessageId: () => {},
  uploadedFiles: [],
  setUploadedFiles: () => {},
  chatWindowHeight: '',
  setChatWindowHeight: () => {},
  prevScrollHeight: 0,
  setPrevScrollHeight: () => {},
});

export const usePaxChatContext = () => useContext(PaxChatContext);
