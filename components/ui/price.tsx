"use client"
import { useEffect, useRef } from 'react';

const OverlayCards = () => {
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
      overlayCta.classList.add('cta');
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
    
        const overlayCtas = overlay.querySelectorAll('.overlay .cta');
    
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
        
    <div className="main flow !max-w-full !px-7 !p-0 !mb-8">
      <h1 className="main__heading !text-[1.5em]  text-gradient">Pricing</h1>
      <div className="main__cards cards" ref={cardsContainerRef}>
      <div className="cards__inner bg-tra">
        
      <div className="card" ref={(el) => { if (el) cardsRef.current.push(el); }}>
        <h2 className="card__headin text-black dark:text-white text-center">Basic</h2>
        <p className="card__price text-black dark:text-white text-center">$9.99</p>
        <ul role="list" className="card__bullets flow text-black dark:text-white text-center">
          <li>Access to standard workouts and nutrition plans</li>
          <li>Email support</li>
        </ul>
        <a href="#basic" className="card__cta cta !underline underline-offset-4 !text-black dark:!text-white text-center">Get Started</a>
      </div>

      <div className="card" ref={(el) => { if (el) cardsRef.current.push(el); }}>
        <h2 className="card__heading text-black dark:text-white text-center">Pro</h2>
        <p className="card__price text-black dark:text-white text-center">$19.99</p>
        <ul role="list" className="card__bullets flow text-black dark:text-white text-center">
          <li>Access to advanced workouts and nutrition plans</li>
          <li>Priority Email support</li>
          <li>Exclusive access to live Q&A sessions</li>
        </ul>
        <a href="#pro" className="card__cta cta !underline underline-offset-4 !text-black dark:!text-white">Upgrade to Pro</a>
      </div>

      <div className="card" ref={(el) => { if (el) cardsRef.current.push(el); }}>
        <h2 className="card__heading text-black dark:text-white text-center">Ultimate</h2>
        <p className="card__price text-black dark:text-white text-center">$29.99</p>
        <ul role="list" className="card__bullets flow text-black dark:text-white text-center">
          <li>Access to all premium workouts and nutrition plans</li>
          <li>24/7 Priority support</li>
          <li>1-on-1 virtual coaching session every month</li>
          <li>Exclusive content and early access to new features</li>
        </ul>
        <a href="#ultimate" className="card__cta cta !underline underline-offset-4 !text-black dark:!text-white">Go Ultimate</a>
      </div>
    </div>

      <div className="overlay" ref={overlayRef}></div>
      </div>
      </div>
    </div>
  );
};

export default OverlayCards;
