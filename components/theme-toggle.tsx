'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant='outline'
      size='icon'
      className='rounded-full bg-primary !text-primary-foreground hover:bg-primary/80 active:bg-primary/90 dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/80 dark:active:bg-accent/90'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className='h-[1.5rem] w-[1.3rem] dark:hidden' />
      <Moon className='hidden size-5 dark:block' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}

export default ThemeToggle;
