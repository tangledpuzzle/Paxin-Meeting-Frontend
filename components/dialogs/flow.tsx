'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { PaxContext } from '@/context/context';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Chat {
  ele: HTMLDivElement;
  lines: Line[];
  anim: NodeJS.Timeout | null;
  addLine(): void;
  removeOldest(): void;
  loop(): void;
  addLineWithDelay(): void;
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

const createElement = (opts: { tag?: string, class?: string | string[], attributes?: { [key: string]: string | Function } } = {}): HTMLElement => {
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
}

const ChatComponent: React.FC = () => {

  const locale = useLocale();
  const newSocketRef = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsPath = process.env.NEXT_PUBLIC_SOCKET_URL;
    const newSocket = new WebSocket(
      `${wsProtocol}//${wsPath}/stream/live?langue=` + locale
    );
    newSocketRef.current = newSocket;

    newSocket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      if (receivedData) {
        const newLine = new Line(receivedData);
        chatRef.current?.ele.appendChild(newLine.ele.lineContainer);
        removeOldest();
      }
    };
  };

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

  const disconnectWebSocket = () => {
    if (newSocketRef.current) {
      newSocketRef.current.close();
      newSocketRef.current = null;
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const toggleAnimation = () => {
    setIsAnimationRunning((prevState) => {
      if (!prevState) {
        connectWebSocket();
      } else {
        disconnectWebSocket();
      }
      return !prevState;
    });
  };

  const [addingChat, setAddingChat] = useState<boolean>(false);
  const [lastChatTime, setLastChatTime] = useState<number>(0);
  const [isAnimationRunning, setIsAnimationRunning] = useState<boolean>(true);

  const chatRef = useRef<Chat | null>(null);

  const addChat = () => {
    if (!chatRef.current) {
      chatRef.current = new Chat();

      const currentTime = Date.now();
      if (!addingChat && currentTime - lastChatTime >= 500) {
        setAddingChat(true);
        chatRef.current.loop();
        setTimeout(() => {
          setAddingChat(false);
          setLastChatTime(Date.now());
        }, 500);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      addChat();
      return () => {};
    }
  }, []);

  return (
    <div id='chat-container'>
      <div id='chat-input w-full'>
        <div id='file-input'></div>
      </div>
      {/* <div className='absolute bottom-20 right-20 z-10 flex flex-col items-end gap-4'>
        <button onClick={toggleAnimation} className='text-center w-full'>
          {isAnimationRunning ? 'остановить' : 'запустить'}
        </button>
        <button>Применить настройки</button>
      </div> */}
    </div>
  );
};

class Chat {
  ele: HTMLDivElement;
  lines: Line[] = [];
  anim: NodeJS.Timeout | null = null;

  constructor() {
    this.ele = createElement({ tag: 'div', class: 'chat' }) as HTMLDivElement;
    this.lines = [];
    this.anim = null;
    const container = document.getElementById('chat-container');
    container?.appendChild(this.ele);

    this.addLineWithDelay();
    this.addLineWithDelay();
    this.addLineWithDelay();
    this.addLine();
  }

  addLine() {
    const l = new Line('');
    this.lines.push(l);
    this.ele.appendChild(l.ele.lineContainer);
  }

  removeOldest() {
    const maxCount = 10;
    if (this.lines.length > maxCount) {
      const oldest = this.lines.splice(0, this.lines.length - maxCount);
      oldest.forEach((n) => this.ele.removeChild(n.ele.lineContainer));
    }
  }

  loop() {
    // if (this.anim) {
    //   this.stopLoop();
    // }
    // this.anim = setInterval(() => {
    //   // this.addLineWithDelay();
    // }, 1000);
  }

  addLineWithDelay() {
    setTimeout(() => {
      this.addLine();
      this.removeOldest();
    }, 0);
  }

  stopLoop() {
    clearInterval(this.anim!);
    this.anim = null;
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

  constructor(data: any) {
    const photoPath = data.photos?.[0]?.files?.[0]?.path;
    this.urlPhoto = photoPath || '';
    this.textName(data.Title);
    if (Array.isArray(data.Hashtags)) {
      // this.hashtags = [...data.Hashtags];
      this.hashtags = data.Hashtags.slice(0, 3);
      // /flows/bn7jIgGCAhE/marketing-strategies-2024-zachary-walker?callback=
      // UniqId
    } else {
      this.hashtags = [];
    }


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

    ele.profileImg.style.backgroundImage = `url(${`https://proxy.paxintrade.com/100/` + `https://img.paxintrade.com/` + this.urlPhoto})`;
    ele.name.style.width = this.name * (textWidth / 2) + 'px';

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
    const profileImg = createElement({ class: ['profile-img', 'mb-2']});

    profileImg.addEventListener('click', () => {
      window.location.href = `https://www.paxintrade.com/flows/${data.UniqId}/${data.Slug}`
    });
  
    const body = createElement({ class: 'body' });
    const name = createElement({ class: ['!w-full', 'cursor-pointer'] });


    name.addEventListener('click', () => {
      window.location.href = `https://www.paxintrade.com/flows/${data.UniqId}/${data.Slug}`
    });

    const img = createElement({ class: 'img' });
    const richBody = createElement({ class: 'rich-body' });

    name.textContent = this.textname;

    body.appendChild(name);

    
    line.appendChild(profileImg);
    line.appendChild(body);
    lineContainer.appendChild(line);

    const flexContainer = createElement({
      class: ['flex', 'gap-2', 'flex-wrap', 'mt-2'],
    });

    this.hashtags.forEach((hashtag) => {
      const hashtagElement = createElement({
        class: ['hashtag', 'bg-card-gradient-menu', 'p-2', 'rounded-md'],
      });
      //@ts-ignore
      hashtagElement.textContent = '#' + hashtag.Hashtag; // Добавляем символ # перед текстом тега
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
