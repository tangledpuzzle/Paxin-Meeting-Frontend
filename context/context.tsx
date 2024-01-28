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
  locale: string;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setUser: (user: User | null) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setPostMode: (value: string) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setCurrentPlan: (value: string) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setSocket: (value: WebSocket | null) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setLocale: (value: string) => void;
};
export const PaxContext = createContext<GlobalContent>({
  user: null,
  setUser: () => {},
  postMode: 'all',
  currentPlan: 'BASIC',
  socket: null,
  locale: 'en',
  setPostMode: () => {},
  setCurrentPlan: () => {},
  setSocket: () => {},
  setLocale: () => {},
});
export const usePaxContext = () => useContext(PaxContext);
