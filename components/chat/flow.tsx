'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { useLocale } from 'next-intl';
import { MdFavorite } from 'react-icons/md'; // Importing MdFavorite icon
import useSocket from '@/hooks/useSocket';
import { useRouter } from 'next/navigation';

interface Chat {
  ele: HTMLDivElement;
  lines: Line[];
  anim: NodeJS.Timeout | null;
  addLine(): void;
  removeOldest(): void;
  loop(): void;
  stopLoop(): void;
}

interface LineElement {
  lineContainer: HTMLElement;
  line: HTMLElement;
  profileImg: HTMLElement;
  body: HTMLElement;
  name: HTMLElement;
  img?: HTMLElement;
  richBody?: HTMLElement;
}

const createElement = (
  opts: {
    tag?: string;
    class?: string | string[];
    attributes?: { [key: string]: string | Function };
  } = {}
): HTMLElement => {
  let ele: HTMLElement;
  if (opts.tag) {
    ele = document.createElement(opts.tag);
  } else {
    ele = document.createElement('div');
  }
  if (opts.class !== undefined) {
    const classes = Array.isArray(opts.class) ? opts.class : [opts.class];
    ele.classList.add(...classes);
  }
  if (opts.attributes) {
    Object.entries(opts.attributes).forEach(([key, value]) => {
      if (typeof value === 'string') {
        ele.setAttribute(key, value);
      } else if (typeof value === 'function') {
        ele.addEventListener(key, value as EventListener);
      }
    });
  }
  return ele;
};

const ChatComponent: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();

  const chatRef = useRef<Chat | null>(null);
  const socket = useSocket(locale);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      chatRef.current = new Chat(locale);
      return () => {};
    }
  }, [locale]);

  const removeOldest = () => {
    const maxCount = 10; // Максимальное количество строк чата
    if (
      chatRef.current &&
      chatRef.current.ele &&
      chatRef.current.ele.children.length > maxCount
    ) {
      const oldest = chatRef.current.ele.children[0];
      chatRef.current.ele.removeChild(oldest);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        if (event.data) {
          const blob = new Blob([event.data], { type: 'text/plain' });
          const reader = new FileReader();
          reader.onload = function () {
            const receivedData = JSON.parse(reader.result as string);
            if (receivedData) {
              const newLine = new Line(receivedData, locale, router);
              chatRef.current?.ele.appendChild(newLine.ele.lineContainer);
              removeOldest();
            }
          };
          reader.readAsText(blob);
        }
      };
    }
  }, [socket]);

  return (
    <div id='chat-container'>
      <div id='chat-input w-full'>
        <div id='file-input'></div>
      </div>
    </div>
  );
};
// const toggleAnimation = () => {
//   setIsAnimationRunning((prevState) => {
//     if (!prevState) {
//       connectWebSocket();
//     } else {
//       disconnectWebSocket();
//     }
//     return !prevState;
//   });
// };

// const [addingChat, setAddingChat] = useState<boolean>(false);
// const [lastChatTime, setLastChatTime] = useState<number>(0);
// const [isAnimationRunning, setIsAnimationRunning] = useState<boolean>(true);

{
  /* <div className='absolute bottom-20 right-20 z-10 flex flex-col items-end gap-4'>
        <button onClick={toggleAnimation} className='text-center w-full'>
          {isAnimationRunning ? 'остановить поток' : 'запустить поток'}
        </button>
        <button>Применить настройки</button>
      </div> */
}
class Chat {
  ele: HTMLDivElement;
  lines: Line[] = [];
  anim: NodeJS.Timeout | null = null;
  locale: string;
  constructor(locale: string) {
    this.locale = locale;
    this.ele = createElement({ tag: 'div', class: 'chat' }) as HTMLDivElement;
    this.lines = [];
    this.anim = null;
    const container = document.getElementById('chat-container');
    container?.appendChild(this.ele);
  }

  removeOldest() {
    const maxCount = 10;
    if (this.lines.length > maxCount) {
      const oldest = this.lines.splice(0, this.lines.length - maxCount);
      oldest.forEach((n) => this.ele.removeChild(n.ele.lineContainer));
    }
  }
}

class Line {
  ele: LineElement;
  hue: number = 0;
  color: string = '';
  profileImgColor: string = '';
  name: number = 0;
  length: number = 0;
  textCount: number = 0;
  hasImg: boolean = false;
  hasRichBody: boolean = false;
  textname: string = '';
  urlPhoto: string = '';
  hashtags: string[] = [];
  locale: string;
  data: any;
  router: any;

  constructor(data: any, locale: string, router: any) {
    this.router = router;
    this.locale = locale.charAt(0).toUpperCase() + locale.slice(1);
    const multilangTitle = data.MultilangTitle;
    const title = multilangTitle[this.locale];
    const photoPath = data.photos?.[0]?.files?.[0]?.path;
    this.urlPhoto = photoPath || '';
    this.textName(title);
    if (Array.isArray(data.Hashtags)) {
      // this.hashtags = [...data.Hashtags];
      this.hashtags = data.Hashtags.slice(0, 3);
    } else {
      this.hashtags = [];
    }
    this.data = data;

    this.pickColor();
    this.pickName();
    this.pickText();
    this.pickHasImg();
    this.pickHasRichBody();
    this.ele = this.createElement(data);
    this.setupElements();
    this.animateIn();
  }

  textName(text: string) {
    this.textname = text;
  }

  pickColor() {
    this.hue =
      Math.floor(Math.random() * amountOfColors) * (360 / amountOfColors);
    this.color = `hsl(${this.hue}, 90%, 50%)`;
    this.profileImgColor = `hsl(${this.hue}, 40%, 55%)`;
  }

  pickName() {
    this.name = Math.random() < 0.3 ? 0 : 1;
  }

  pickText() {
    const lengthChoice = Math.random();
    let lengthWeight = 1;
    if (lengthChoice < 0.5) {
      lengthWeight = 0.6;
    } else if (lengthChoice < 0.9) {
      lengthWeight = 0.8;
    }
    this.length = Math.max(0.02, lengthChoice * lengthWeight);
    this.textCount = this.length * maxTexts;
  }

  pickHasImg() {
    this.hasImg = Math.random() > 0.9;
  }

  pickHasRichBody() {
    this.hasRichBody = !this.hasImg && Math.random() > 0.85;
  }

  setupElements() {
    const ele = this.ele;
    const data = this.data;
    const router = this.router;

    ele.profileImg.style.backgroundImage = `url(${`https://proxy.myru.online/100/` + `https://img.myru.online/` + this.urlPhoto})`;
    ele.name.style.width = this.name * (textWidth / 2) + 'px';

    ele.profileImg.addEventListener('click', () => {
      router.push(`/flows/${data.UniqId}/${data.Slug}`);
    });

    ele.name.addEventListener('click', () => {
      router.push(`/flows/${data.UniqId}/${data.Slug}`);
    });
    // ele.name.style.backgroundColor = this.color;
    // ele.profileImg.style.backgroundColor = this.profileImgColor;
  }

  animateIn() {
    let delay = 35;
    const ele = this.ele;
    setTimeout(() => {
      ele.lineContainer.style.opacity = '1';
      ele.lineContainer.style.maxHeight = '300px';
      ele.lineContainer.style.transform = 'translateX(0px) scale(1)';
    }, delay);

    const otherEleList = [ele.profileImg, ele.name];

    if ('img' in ele) {
      otherEleList.push(ele.img!);
    } else if ('richBody' in ele) {
      otherEleList.push(ele.richBody!);
    }

    delay += 40;

    otherEleList.forEach((e, i) => {
      setTimeout(
        () => {
          e.style.opacity = '1';
          e.style.transform = 'translateY(0px)';
        },
        (delay += 50)
      );
    });
  }

  createElement(data: any): LineElement {
    const lineContainer = createElement({ class: 'line-container' });
    const line = createElement({
      class: ['bg-card-gradient-menu', 'py-4', 'px-4'],
    });
    const profileImg = createElement({ class: ['profile-img', 'mb-2'] });

    profileImg.addEventListener('click', () => {
      window.location.href = `https://www.myru.online/flows/${data.UniqId}/${data.Slug}`;
    });

    const body = createElement({ class: 'body' });
    const name = createElement({ class: ['!w-[85%]', 'cursor-pointer'] });

    name.addEventListener('click', () => {
      window.location.href = `https://www.myru.online/flows/${data.UniqId}/${data.Slug}`;
    });

    const img = createElement({ class: 'img' });
    const richBody = createElement({ class: 'rich-body' });

    name.textContent = this.textname;

    body.appendChild(name);

    // Add favorite button
    // const favoriteButton = createElement({
    //   tag: 'button',
    //   class: ['favorite-button', 'btn', '!absolute', 'right-[0px]', 'top-0'],
    //   attributes: {
    //     onclick: () => {
    //       // Handle adding to favorites here
    //       console.log('Added to favorites');
    //     }
    //   }
    // });
    // favoriteButton.innerHTML = 'favoriteButton';
    // body.appendChild(favoriteButton);

    line.appendChild(profileImg);
    line.appendChild(body);
    lineContainer.appendChild(line);

    const flexContainer = createElement({
      class: ['flex', 'gap-2', 'flex-wrap', 'mt-2', 'w-[85%]'],
    });

    this.hashtags.forEach((hashtag) => {
      const hashtagElement = createElement({
        class: [
          'hashtag',
          'bg-card-gradient-menu',
          'pt-1',
          'pb-4',
          'pr-2',
          'rounded-md',
        ],
      });
      //@ts-ignore
      hashtagElement.textContent = '#' + hashtag.Hashtag;
      flexContainer.appendChild(hashtagElement);
      line.appendChild(flexContainer);
    });

    const out: LineElement = { lineContainer, line, profileImg, body, name };
    return out;
  }
}

let amountOfColors = 18;
let lineWidth = 500;
let profileImgWidth = 60;
let textWidth = lineWidth - 20 - profileImgWidth - 10;
let maxTexts = 4;

export default ChatComponent;
