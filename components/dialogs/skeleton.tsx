"use client"

import React, { useEffect, useState, useRef } from 'react';

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
    lineContainer: HTMLDivElement;
    line: HTMLDivElement;
    profileImg: HTMLDivElement;
    body: HTMLDivElement;
    name: HTMLDivElement;
    texts: HTMLDivElement[];
    img?: HTMLDivElement;
    richBody?: HTMLDivElement; 
  }

const createElement = (opts: { class?: string | string[] } = {}): HTMLDivElement => {
    let ele = document.createElement('div');
    if (opts.class !== undefined) {
      const classes = Array.isArray(opts.class) ? opts.class : [opts.class];
      ele.classList.add(...classes);
    }
    return ele;
}



const ChatComponent: React.FC = () => {
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

  const toggleAnimation = () => {
    setIsAnimationRunning(prevState => !prevState);
    if (chatRef.current) {
      if (isAnimationRunning) {
        chatRef.current.stopLoop();
      } else {
        chatRef.current.loop();
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
    addChat();
    return () => {
    };
    }
  }, []);

  return (
    <div id="chat-container">
      <div id="chat-input">
        <div id="file-input"></div>
      </div>
      {/* <div className='absolute z-10 bottom-20 right-20 flex gap-4 flex-col items-end'>
        <button onClick={toggleAnimation}>
        {isAnimationRunning ? 'Остановить поток' : 'Запустить поток'}
        </button>
        <button>Применить настройки</button>
      </div> */}
    </div>
    
  );
}

class Chat {
  ele: HTMLDivElement;
  lines: Line[] = [];
  anim: NodeJS.Timeout | null = null;

  constructor() {
    this.ele = createElement({ class: 'chat' });
    this.lines = [];
    this.anim = null;
    const container = document.getElementById('chat-container');
    container?.appendChild(this.ele);
  }

  addLine() {
    const l = new Line();
    this.lines.push(l);
    this.ele.appendChild(l.ele.lineContainer);
  }

  removeOldest() {
    const maxCount = 10;
    if (this.lines.length > maxCount) {
      const oldest = this.lines.splice(0, this.lines.length - maxCount);
      oldest.forEach(n => this.ele.removeChild(n.ele.lineContainer));
    }
  }

  loop() {
    if (this.anim) {
      this.stopLoop();
    }
    this.anim = setInterval(() => {
      this.addLineWithDelay();
    }, 1000);
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
  color: string = "";
  profileImgColor: string = "";
  name: number = 0;
  length: number = 0;
  textCount: number = 0;
  hasImg: boolean = false;
  hasRichBody: boolean = false;

  constructor() {
    this.pickColor();
    this.pickName();
    this.pickText();
    this.pickHasImg();
    this.pickHasRichBody();
    this.ele = this.createElement();
    this.setupElements();
    this.animateIn();
  }

  pickColor() {
    this.hue = Math.floor(Math.random() * amountOfColors) * (360 / amountOfColors);
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
    ele.name.style.width = this.name * (textWidth / 2) + 'px';
    ele.texts.forEach((n, i, arr) => {
      let w = textWidth;
      if (i === arr.length - 1) {
        w = Math.max(0.2, (this.textCount - i)) * textWidth;
      }
      n.style.width = w + 'px';
    });
    ele.name.style.backgroundColor = this.color;
    ele.profileImg.style.backgroundColor = this.profileImgColor;
  }

  animateIn() {
    let delay = 35;
    const ele = this.ele;
    setTimeout(() => {
      ele.lineContainer.style.opacity = '1';
      ele.lineContainer.style.maxHeight = '300px';
      ele.lineContainer.style.transform = 'translateX(0px) scale(1)';
    }, delay);

    const otherEleList = [ele.profileImg, ele.name, ...ele.texts];

    if ('img' in ele) {
      otherEleList.push(ele.img!);
    } else if ('richBody' in ele) {
      otherEleList.push(ele.richBody!);
    }

    delay += 40;

    otherEleList.forEach((e, i) => {
      setTimeout(() => {
        e.style.opacity = '1';
        e.style.transform = 'translateY(0px)';
      }, delay += 50);
    });

    ele.texts.forEach((n, i) => setTimeout(() => n.style.opacity = '1', 70 * (i + 3) + delay));
  }

  createElement(): LineElement {
    const lineContainer = createElement({ class: 'line-container' });
    const line = createElement({ class: 'line' });
    const profileImg = createElement({ class: 'profile-img' });
    const body = createElement({ class: 'body' });
    const name = createElement({ class: 'name' });
    const texts = [];
    const img = createElement({ class: 'img' });
    const richBody = createElement({ class: 'rich-body' });
    body.appendChild(name);
    for (let i = 0; i < (this.textCount || 1); i++) {
      const text = createElement({ class: 'text' });
      texts.push(text);
      body.appendChild(text);
    }
    line.appendChild(profileImg);
    line.appendChild(body);
    lineContainer.appendChild(line);
    const out: LineElement = { lineContainer, line, profileImg, body, name, texts };
    if (this.hasImg) {
      out.img = img;
      body.appendChild(img);
    }
    if (this.hasRichBody) {
      out.richBody = richBody as HTMLDivElement;
      body.appendChild(richBody);
    }
    return out;
  }
}

let amountOfColors = 18;
let lineWidth = 500;
let profileImgWidth = 60;
let textWidth = lineWidth - 20 - profileImgWidth - 10;
let maxTexts = 4;



export default ChatComponent;
