'use client';

import React, { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import useSocket from '@/hooks/useSocket';

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
    attributes?: { [key: string]: string | EventListener };
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

class Chat {
  ele: HTMLDivElement;
  lines: Line[] = [];
  locale: string;

  constructor(locale: string) {
    this.locale = locale;
    this.ele = createElement({ tag: 'div', class: 'chat' }) as HTMLDivElement;
    const container = document.getElementById('chat-container');
    container?.appendChild(this.ele);
  }

  removeOldest() {
    const maxCount = 10;
    if (this.lines.length > maxCount) {
      const oldest = this.lines.splice(0, this.lines.length - maxCount);
      oldest.forEach((line) => this.ele.removeChild(line.ele.lineContainer));
    }
  }

  addLine(line: Line) {
    this.lines.push(line);
    this.ele.appendChild(line.ele.lineContainer);
    this.removeOldest();
  }
}

class Line {
  ele: LineElement;
  locale: string;
  data: any;
  router: any;

  constructor(data: any, locale: string, router: any) {
    this.router = router;
    this.locale = locale;
    this.data = data;
    this.ele = this.createElement(data);
    this.setupElements();
    this.animateIn();
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

    name.textContent = data.MultilangTitle[this.locale];

    body.appendChild(name);
    line.appendChild(profileImg);
    line.appendChild(body);
    lineContainer.appendChild(line);

    const out: LineElement = { lineContainer, line, profileImg, body, name };
    return out;
  }

  setupElements() {
    const ele = this.ele;
    const data = this.data;

    ele.profileImg.style.backgroundImage = `url(https://proxy.myru.online/100/https://img.myru.online/${data.photos?.[0]?.files?.[0]?.path || ''})`;

    ele.profileImg.addEventListener('click', () => {
      this.router.push(`/flows/${data.UniqId}/${data.Slug}`);
    });

    ele.name.addEventListener('click', () => {
      this.router.push(`/flows/${data.UniqId}/${data.Slug}`);
    });
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

    delay += 40;

    otherEleList.forEach((e) => {
      setTimeout(() => {
        e.style.opacity = '1';
        e.style.transform = 'translateY(0px)';
      }, (delay += 50));
    });
  }
}

const ChatComponent: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const chatRef = useRef<Chat | null>(null);
  const { socket } = useSocket(locale);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      chatRef.current = new Chat(locale);
    }
  }, [locale]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event: MessageEvent) => {
        if (event.data) {
          const blob = new Blob([event.data], { type: 'text/plain' });
          const reader = new FileReader();
          reader.onload = () => {
            const receivedData = JSON.parse(reader.result as string);
            if (receivedData && chatRef.current) {
              const newLine = new Line(receivedData, locale, router);
              chatRef.current.addLine(newLine);
            }
          };
          reader.readAsText(blob);
        }
      };

      return () => {
        socket.onmessage = null;
      };
    }
  }, [socket, locale, router]);

  return (
    <div id='chat-container'>
      <div id='chat-input' className='w-full'>
        <div id='file-input'></div>
      </div>
    </div>
  );
};

export default ChatComponent;
