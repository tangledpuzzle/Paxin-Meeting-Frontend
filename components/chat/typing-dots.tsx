import React, { useState, useEffect } from 'react';

const TypingDots = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        // Cycle through '', '.', '..', '...'
        return prevDots.length < 3 ? prevDots + '.' : '';
      });
    }, 500); // Change the speed of dot cycling by adjusting the interval time

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return <span>{dots}</span>;
};

export default TypingDots;
