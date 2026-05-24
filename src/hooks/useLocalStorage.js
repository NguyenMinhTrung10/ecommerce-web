import { useState, useEffect } from 'react';
import { storage } from '../services/storage';

/**
 * Reusable Custom Hook to synchronize React state with localStorage
 * @param {string} key 
 * @param {*} initialValue 
 */
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    return storage.safeGet(key, initialValue);
  });

  useEffect(() => {
    storage.safeSet(key, value);
  }, [key, value]);

  return [value, setValue];
};
