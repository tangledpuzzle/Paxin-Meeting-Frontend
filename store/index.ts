import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
// import { HYDRATE, createWrapper } from 'next-redux-wrapper';
import activeSpeakersSlice from './slices/activeSpeakersSlice';
import participantSlice from './slices/participantSlice';
import sessionSlice from './slices/sessionSlice';
import bottomIconsSlice from './slices/bottomIconsActivitySlice';
import chatMessagesSlice from './slices/chatMessagesSlice';
import roomSettingsSlice from './slices/roomSettingsSlice';
import whiteboardSlice from './slices/whiteboard';
import externalMediaPlayerSlice from './slices/externalMediaPlayer';
import { pollsApi } from './services/pollsApi';
import breakoutRoomSlice from './slices/breakoutRoomSlice';
import { breakoutRoomApi } from './services/breakoutRoomApi';
import speechServicesSlice from './slices/speechServicesSlice';

// // declare const NEXT_PUBLIC_IS_PRODUCTION: boolean;
// const combinedReducer = (
//   state: any,
//   action: { type: string; payload: any }
// ) => {
//   if (action.type === HYDRATE) {
//     const nextState = {
//       ...state,
//       ...action.payload,
//     };
//     return nextState;
//   } else {
//     // Combine all reducers here
//     return combineReducers({
//       participants: participantSlice,
//       activeSpeakers: activeSpeakersSlice,
//       session: sessionSlice,
//       bottomIconsActivity: bottomIconsSlice,
//       chatMessages: chatMessagesSlice,
//       roomSettings: roomSettingsSlice,
//       whiteboard: whiteboardSlice,
//       externalMediaPlayer: externalMediaPlayerSlice,
//       breakoutRoom: breakoutRoomSlice,
//       [pollsApi.reducerPath]: pollsApi.reducer,
//       [breakoutRoomApi.reducerPath]: breakoutRoomApi.reducer,
//       speechServices: speechServicesSlice,
//     });
//   }
// };

// export const store = configureStore({
//   reducer: combinedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(
//       pollsApi.middleware,
//       breakoutRoomApi.middleware
//     ),
//   devTools: !process.env.NEXT_PUBLIC_IS_PRODUCTION,
// });

export const makeStore = () => {
  return configureStore({
    reducer: {
      participants: participantSlice,
      activeSpeakers: activeSpeakersSlice,
      session: sessionSlice,
      bottomIconsActivity: bottomIconsSlice,
      chatMessages: chatMessagesSlice,
      roomSettings: roomSettingsSlice,
      whiteboard: whiteboardSlice,
      externalMediaPlayer: externalMediaPlayerSlice,
      breakoutRoom: breakoutRoomSlice,
      [pollsApi.reducerPath]: pollsApi.reducer,
      [breakoutRoomApi.reducerPath]: breakoutRoomApi.reducer,
      speechServices: speechServicesSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        pollsApi.middleware,
        breakoutRoomApi.middleware
      ),
    devTools: !process.env.NEXT_PUBLIC_IS_PRODUCTION,
  });
};
export const store = makeStore();
setupListeners(store.dispatch);
// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
