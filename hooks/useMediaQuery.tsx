import { useState, useEffect } from 'react';

/**
 * useMediaQuery hook
 * @param {string} query - Media query string
 * @returns {boolean} - True if the document matches the media query, false otherwise
 */
function useMediaQuery(query: string) {
  // Initialize state with whether or not the media query matches
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create a MediaQueryList object
    const media = window.matchMedia(query);

    // Function to update matches state
    const listener = () => setMatches(media.matches);

    // Add listener on mount
    media.addEventListener('change', listener);

    // Initial check
    setMatches(media.matches);

    // Clean-up function to remove listener
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export default useMediaQuery;
