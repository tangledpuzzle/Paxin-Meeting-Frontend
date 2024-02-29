'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

const ScrollerComponent = ({
  images,
}: {
  images: { id: string; src: string }[];
}) => {
  useEffect(() => {
    const scrollers = document.querySelectorAll<HTMLElement>('.scroller');

    // Если пользователь не отключил анимацию, добавляем анимацию
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      addAnimation();
    }

    function addAnimation() {
      scrollers.forEach((scroller) => {
        // add data-animated="true" to every `.scroller` on the page
        scroller.setAttribute('data-animated', 'true');

        // Проверяем, существует ли `.scroller-inner`
        const scrollerInner = scroller.querySelector('.scroller__inner');
        if (!scrollerInner) return;

        // Make an array from the elements within `.scroller-inner`
        const scrollerContent = Array.from(scrollerInner.children);

        // For each item in the array, clone it
        // add aria-hidden to it
        // add it into the `.scroller-inner`
        scrollerContent.forEach((item) => {
          // Приведение типа к HTMLElement
          const duplicatedItem = item.cloneNode(true) as HTMLElement;
          duplicatedItem.setAttribute('aria-hidden', 'true');
          scrollerInner.appendChild(duplicatedItem);
        });
      });
    }
  }, []);

  return (
    <>
      <div className='scroller' data-direction='right' data-speed='slow'>
        <div className='scroller__inner'>
          {images.map((image) => (
            <Link
              key={image.id}
              href={`/profiles/[username]`}
              as={`/profiles/${image.id}`}
            >
              <Image src={image.src} alt='' width={150} height={150} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ScrollerComponent;
