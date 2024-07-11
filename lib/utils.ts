import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MessageKeys } from 'next-intl';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusTranslation = <T extends Record<string, any>>(status: string, t: (key: MessageKeys<T, Extract<keyof T, string>>) => string): string => {
  const translationsMap: { [key: string]: MessageKeys<T, Extract<keyof T, string>> } = {
    CLOSED_1: 'closed_1' as MessageKeys<T, Extract<keyof T, string>>,
    'Пополнение баланса c карты банка': 'TYPE_TR'  as MessageKeys<T, Extract<keyof T, string>>,
  };

  const translationKey = translationsMap[status];
  return translationKey ? t(translationKey) : status;
};

export function getInitials(name: string): string {
  return name
    .replace(/\s+/, ' ')
    .split(' ')
    .slice(0, 2)
    .map((v) => v && v[0].toUpperCase())
    .join('');
}

export function addDate(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export const formatDateNew = (isoString: string): string => {
  if (!isoString) return '';

  const date = new Date(isoString);
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error('Invalid date:', isoString);
    return '';
  }

  const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
  const formattedDate = date.toLocaleDateString('ru-RU', options);
  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  const formattedTime = date.toLocaleTimeString('ru-RU', timeOptions);

  return `${formattedDate}, ${formattedTime}`;
};

export const formatAmount = (amount: number): string => {
  return amount.toLocaleString('ru-RU');
};


export function generateRandomString(length: number): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function hashTimestamp(timestamp: number): string {
  let hash = 0;
  const timestampString = timestamp.toString();
  for (let i = 0; i < timestampString.length; i++) {
    let char = timestampString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export async function readFileAsDataURL(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
}

export function scrollToTransition(pos: number) {
  if (
    window === undefined ||
    window.document.body.scrollHeight - window.innerHeight < pos
  ) {
    setTimeout(() => {
      scrollToTransition(pos);
    }, 100);
  } else {
    window.scrollTo(0, pos);
  }
}

export function isValidLatinAndNumber(inputString: string): boolean {
  return /^[A-Za-z0-9-]+$/.test(inputString);
}
