/**
 * CyberStore Storage Service Layer
 * Provides robust error handling for browser localStorage
 */

export const storage = {
  /**
   * Safely retrieve item from localStorage with a fallback value
   * @param {string} key 
   * @param {*} fallback 
   */
  safeGet(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      console.error(`[Storage Service] Error getting key "${key}":`, error);
      return fallback;
    }
  },

  /**
   * Safely write item to localStorage
   * @param {string} key 
   * @param {*} value 
   */
  safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[Storage Service] Error setting key "${key}":`, error);
      return false;
    }
  },

  /**
   * Safely delete item from localStorage
   * @param {string} key 
   */
  safeRemove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[Storage Service] Error removing key "${key}":`, error);
      return false;
    }
  }
};
