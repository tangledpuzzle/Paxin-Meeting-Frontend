"use client"
import { useEffect } from 'react';

const ScrollerComponent2 = () => {
  useEffect(() => {
    const scrollers = document.querySelectorAll<HTMLElement>(".scroller2");

    // Если пользователь не отключил анимацию, добавляем анимацию
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }

    function addAnimation() {
      scrollers.forEach((scroller) => {
        // Проверяем, работаем ли мы на клиенте
        if (typeof window !== 'undefined') {
          // add data-animated="true" to every `.scroller` on the page
          scroller.setAttribute("data-animated", "true");

          // Проверяем, существует ли `.scroller-inner`
          const scrollerInner = scroller.querySelector(".scroller__inner2");
          if (!scrollerInner) return;

          // Make an array from the elements within `.scroller-inner`
          const scrollerContent = Array.from(scrollerInner.children);

          // For each item in the array, clone it
          // add aria-hidden to it
          // add it into the `.scroller-inner`
          scrollerContent.forEach((item) => {
            // Приведение типа к HTMLElement
            const duplicatedItem = item.cloneNode(true) as HTMLElement;
            duplicatedItem.setAttribute("aria-hidden", "true");
            scrollerInner.appendChild(duplicatedItem);
          });
        }
      });
    }
  }, []);

  return (
    <> 
      <div className="scroller2 mt-0" data-speed="fast">
        <ul className="tag-list2 scroller__inner2">
          <li>HTML</li>
          <li>CSS</li>
          <li>JS</li>
          <li>SSG</li>
          <li>webdev</li>
          <li>animation</li>
          <li>UI/UX</li>
        </ul>
      </div>
    </>
  );
};

export default ScrollerComponent2;
