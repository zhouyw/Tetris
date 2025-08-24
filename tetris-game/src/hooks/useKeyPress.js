import { useEffect } from 'react';

export const useKeyPress = (callbacks, dependencies) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      const { key } = event;
      
      if (callbacks[key]) {
        event.preventDefault();
        callbacks[key]();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};