import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

const MyComponent = () => {
  useEffect(() => {
    if (
      !CSS.supports('animation-timeline: view()') &&
      window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    ) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.set('.cta', {
        width: 140,
        scale: 1.5,
      });

      gsap.to('.cta', {
        width: '48px',
        scrollTrigger: {
          scrub: 0.1,
          trigger: document.body,
          start: 0,
          end: 100,
        },
      });

      gsap.to('.cta', {
        scale: 1,
        scrollTrigger: {
          scrub: 0.2,
          trigger: document.body,
          start: window.innerHeight * 0.7,
          end: window.innerHeight,
        },
      });

      gsap.set('.icon svg', {
        transformOrigin: '65% 75%',
      });

      gsap.to('.icon svg', {
        rotate: 20,
        repeat: 5,
        yoyo: true,
        scrollTrigger: {
          scrub: 0.2,
          trigger: document.body,
          start: window.innerHeight * 0.2,
          end: window.innerHeight * 0.5,
        },
      });
    }
  }, []);

  return null; // Replace null with your JSX content if needed
};

export default MyComponent;
