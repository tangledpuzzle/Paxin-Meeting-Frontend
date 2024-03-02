"use client"
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

const OverlayCards = () => {
    
    const t = useTranslations('main');

  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const cardsContainer = cardsContainerRef.current;
    const overlay = overlayRef.current;
    const cards = cardsRef.current;

    if (!cardsContainer || !overlay) return;

    const applyOverlayMask = (e: PointerEvent) => {

      const overlayEl = overlay;
      const x = e.pageX - cardsContainer.offsetLeft;
      const y = e.pageY - cardsContainer.offsetTop;

      overlayEl.style.cssText = `--opacity: 1; --x: ${x}px; --y:${y}px;`;
    };

    const createOverlayCta = (overlayCard: HTMLElement, ctaEl: HTMLElement) => {
        
      const overlayCta = document.createElement('div');
      overlayCta.classList.add('cta2');
      overlayCta.textContent = ctaEl.textContent || '';
      overlayCta.setAttribute('aria-hidden', 'true');
      overlayCard.append(overlayCta);
    };

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const cardIndex = cards.indexOf(entry.target as HTMLElement);
        let width = entry.borderBoxSize[0].inlineSize;
        let height = entry.borderBoxSize[0].blockSize;

        if (cardIndex >= 0 && overlay && overlay.children[cardIndex]) {
          (overlay.children[cardIndex] as HTMLElement).style.width = `${width}px`;
          (overlay.children[cardIndex] as HTMLElement).style.height = `${height}px`;
        }
      });
    });

    const initOverlayCard = (cardEl: HTMLElement) => {
        if (!overlay.contains(cardEl)) {
        const overlayCard = document.createElement('div');
        overlayCard.classList.add('card');
        createOverlayCta(overlayCard, cardEl.lastElementChild as HTMLElement);
        if (overlay) overlay.append(overlayCard);

        observer.observe(cardEl);

        const cardWidth = cardEl.getBoundingClientRect().width;
        const overlayCtas = overlay.querySelectorAll('.overlay .cta');

            overlayCtas.forEach((cta) => {
                (cta as HTMLElement).style.width = `${cardWidth}px`;
            });
        };
    }

    const updateCtaWidth = () => {
        const cardWidth = cardsRef.current[0]?.getBoundingClientRect().width || 0;
    
        const overlayCtas = overlay.querySelectorAll('.overlay .cta2');
    
        overlayCtas.forEach((cta) => {
          (cta as HTMLElement).style.width =  `${cardWidth - 66}px`;
        });
      };

    cards.forEach(initOverlayCard);
    overlay?.classList.add('cards__inner');
    document.body.addEventListener('pointermove', applyOverlayMask);
    updateCtaWidth();
    window.addEventListener('resize', updateCtaWidth);
  
    return () => {
      observer.disconnect();
      document.body.removeEventListener('pointermove', applyOverlayMask);
      window.removeEventListener('resize', updateCtaWidth);

    };
  }, []);

  return (
    <div>

    <div className="main flow  !px-7 !p-0 !mb-8">
    {/* <div className="grid absolute px-7 mx-auto overflow-hidden">
    <svg className="grid-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 982 786" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M490 401V537H348.5V401H490ZM490 785.5V676H348.5V785.5H347.5V676H206V785.5H205V676H63.5V785.5H62.5V676H0V675H62.5V538H0V537H62.5V401H0V400H62.5V258H0V257H62.5V116H0V115H62.5V0H63.5V115L205 115V0H206V115L347.5 115V0H348.5V115H490V0H491V115L627.5 115V0H628.5V115H765V0H766V115L902.5 115V0H903.5V115H982V116H903.5V257H982V258H903.5V400H982V401H903.5V537H982V538H903.5V675H982V676H903.5V785.5H902.5V676H766V785.5H765V676H628.5V785.5H627.5V676H491V785.5H490ZM902.5 675V538H766V675H902.5ZM902.5 537V401H766V537H902.5ZM902.5 400V258H766V400H902.5ZM902.5 257V116L766 116V257H902.5ZM627.5 675H491V538H627.5V675ZM765 675H628.5V538H765V675ZM348.5 675H490V538H348.5V675ZM347.5 538V675H206V538H347.5ZM205 538V675H63.5V538H205ZM765 537V401H628.5V537H765ZM765 400V258H628.5V400H765ZM765 257V116H628.5V257H765ZM347.5 401V537H206V401H347.5ZM205 401V537H63.5V401H205ZM627.5 401V537H491V401H627.5ZM627.5 116L491 116V257H627.5V116ZM627.5 258H491V400H627.5V258ZM63.5 257V116L205 116V257H63.5ZM63.5 400V258H205V400H63.5ZM206 116V257H347.5V116L206 116ZM348.5 116V257H490V116H348.5ZM206 400V258H347.5V400H206ZM348.5 258V400H490V258H348.5Z" fill="url(#paint0_radial_1_8)" />
        <defs>
        <radialGradient id="paint0_radial_1_8" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(491 392.75) rotate(90) scale(513.25 679.989)">
            <stop stop-color="white" stop-opacity="0.2" />
            <stop offset="1" stop-color="#000" stop-opacity="0" />
        </radialGradient>
        </defs>
    </svg>
    <div className="blur"></div>
    </div> */}
    
      <h2 className="main__heading h-[40px] md:h-[65px] text-gradient  font-roboto text-2xl font-bold sm:text-3xl sm:!leading-[2.5rem] md:text-4xl md:!leading-[3rem] xl:text-5xl xl:!leading-[4rem] px-7 leading-[30px] text-left md:text-center !pb-0 !mb-0">{t('prices')}</h2>

      <div className="main__cards cards" ref={cardsContainerRef}>
      <div className="cards__inner bg-tra">
        
      <div className="card" ref={(el) => { if (el) cardsRef.current.push(el); }}>
        <h2 className="card__headin text-black dark:text-white text-center">Бесплатно</h2>
        <p className="card__price text-black dark:text-white text-center">$0</p>
        <ul role="list" className="card__bullets flow text-black dark:text-white text-center">
          <li>Открытие аккаунта</li>
          <li>Email поддержка</li>
        </ul>
        <a href="#basic" className="card__cta cta2 !underline underline-offset-4 !text-black dark:!text-white text-center">Начать с этого</a>
      </div>

      <div className="card" ref={(el) => { if (el) cardsRef.current.push(el); }}>
        <h2 className="card__heading text-black dark:text-white text-center">Про</h2>
        <p className="card__price text-black dark:text-white text-center">$19.99</p>
        <ul role="list" className="card__bullets flow text-black dark:text-white text-center">
          <li>Лимитированный доступ к сервисам ресура</li>
          <li>Приоритетная email поддержка</li>
          <li>Эсклюзивный доступ к  Q&A сессиям</li>
        </ul>
        <a href="#pro" className="card__cta cta2 !underline underline-offset-4 !text-black dark:!text-white">Обновить до про</a>
      </div>

      <div className="card" ref={(el) => { if (el) cardsRef.current.push(el); }}>
        <h2 className="card__heading text-black dark:text-white text-center">Безграничный</h2>
        <p className="card__price text-black dark:text-white text-center">$99.99</p>
        <ul role="list" className="card__bullets flow text-black dark:text-white text-center">
          <li>Премиальный доступ</li>
          <li>24/7 приоритетная поддержкка</li>
          <li>1-на-1 вирутальная коуч сессия каждый месяц</li>
          <li>Эсклюзвный доступ и раннее прилгашение к тестированию новых функций</li>
        </ul>
        <a href="#ultimate" className="card__cta cta2 !underline underline-offset-4 !text-black dark:!text-white">Безграничный</a>
      </div>
    </div>
    {/* <div className='flex justify-center   bottom-[0px]  md:justify-center px-7'>
        <div className='chevron'></div>
        <div className='chevron'></div>
        <div className='chevron'></div>
        <span className='text text-black dark:text-white'>
          {t('scroll_down')}
        </span>
      </div> */}

      <div className="overlay" ref={overlayRef}></div>
      </div>
      </div>
    </div>
  );
};

export default OverlayCards;
