import React from 'react';
import { createSelector } from '@reduxjs/toolkit';

import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { updateTheme } from '@/store/slices/roomSettingsSlice';

const themeSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.theme
);

const DarkThemeSwitcher = () => {
  const theme = useAppSelector(themeSelector);
  const dispatch = useAppDispatch();
  console.log('React theme:', theme);
  const toggleDarkMode = () => {
    dispatch(updateTheme(theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className='dark-mode mt-1'>
      <button onClick={toggleDarkMode}>
        <>
          {theme === 'dark' ? (
            <div className='moon flex h-8 w-8 items-center justify-center rounded-full'>
              <i className='pnm-moon h-4 w-4 text-primaryColor dark:text-secondaryColor' />
            </div>
          ) : (
            <div className='sun flex h-8 w-8 items-center justify-center rounded-full'>
              <i className='pnm-sun h-4 w-4 text-primaryColor dark:text-secondaryColor' />
            </div>
          )}
        </>
      </button>
    </div>
  );
};

export default DarkThemeSwitcher;
