import { useEffect } from 'react';

/**
 * A custom hook to dynamically set the document title.
 * It updates the title when the component mounts and reverts it on unmount.
 *
 * @param {string} title - The title to set for the document.
 * @param {boolean} [revertOnUnmount=true] - Whether to revert to the original title on unmount.
 */
const useTitle = (title: string, revertOnUnmount: boolean = true) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;

    if (revertOnUnmount) {
      return () => {
        document.title = originalTitle;
      };
    }
  }, [title, revertOnUnmount]);
};

export default useTitle;