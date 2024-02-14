'use client';
import React, { useEffect } from 'react';

const LiAds = ({ tags }: { tags: string[] }) => {
  useEffect(() => {
    const speedUpdate = () => {
      const ranger: HTMLInputElement | null = document.querySelector('#speed');
      if (ranger) {
        document.documentElement.style.setProperty(
          '--speed',
          `${ranger.value}s`
        );
      }
    };

    const ranger = document.querySelector('#speed');
    if (ranger) {
      ranger.addEventListener('input', speedUpdate);
    }

    return () => {
      if (ranger) {
        ranger.removeEventListener('input', speedUpdate);
      }
    };
  }, []);

  return (
    <main>
      <article>
        <div className='window'>
          <div className='scene'>
            <ul className='grid3'>
              {tags.map((tag, index) => (
                <li key={index}>
                  <div className='item !bg-card-gradient'>
                    <div className='item__text text-muted-foreground'>
                      {tag}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </main>
  );
};

export default LiAds;
