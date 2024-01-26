import { createContext, useContext } from 'react';

export type GlobalContent = {
  postMode: string;
  currentPlan: string;
  socket: WebSocket | null;
  locale: string;
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
