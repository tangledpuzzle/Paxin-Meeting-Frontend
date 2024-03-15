import { createContext, useContext } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  plan: string;
  city: {
    id: number;
    name: string;
  }[];
  category: {
    id: number;
    name: string;
  }[];
  hashtags: string[];
  role: string;
  balance: number;
  storage: number;
  limitStorage: number;
  followers: number;
  followings: number;
  onlinehours: {
    hour: number;
    minutes: number;
    seconds: number;
  };
  totalposts: number;
}

export type GlobalContent = {
  user: User | null;
  postMode: string;
  currentPlan: string;
  socket: WebSocket | null;
  globalLoading: boolean;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setUser: (user: User | null) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  userMutate: () => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setPostMode: (value: string) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setCurrentPlan: (value: string) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setSocket: (value: WebSocket | null) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setGlobalLoading: (value: boolean) => void;
};
export const PaxContext = createContext<GlobalContent>({
  user: null,
  setUser: () => { },
  userMutate: () => { },
  postMode: 'all',
  currentPlan: 'BASIC',
  socket: null,
  setPostMode: () => { },
  setCurrentPlan: () => { },
  setSocket: () => { },
  globalLoading: false,
  setGlobalLoading: () => { }
});
export const usePaxContext = () => useContext(PaxContext);
