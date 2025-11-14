import { useEffect } from 'react';

/**
 * A custom React hook to dynamically set the document title (browser tab title).
 * It updates the title when the component mounts or when the `title` dependency changes,
 * and can optionally revert to the original title when the component unmounts.
 *
 * @param {string} title - The title string to set for the document.
 * @param {boolean} [revertOnUnmount=true] - Optional. If `true`, the document title will revert
 *                                           to its original value when the component using this hook unmounts.
 *                                           Defaults to `true`.
 * @returns {void}
 */
const useTitle = (title: string, revertOnUnmount: boolean = true) => {
  // useEffect hook to manage the side effect of changing the document title.
  useEffect(() => {
    // Store the original document title before changing it.
    const originalTitle = document.title;
    // Set the new document title.
    document.title = title;

    // If `revertOnUnmount` is true, return a cleanup function.
    if (revertOnUnmount) {
      return () => {
        // The cleanup function restores the original document title.
        document.title = originalTitle;
      };
    }
    // Dependencies array: the effect re-runs if `title` or `revertOnUnmount` changes.
  }, [title, revertOnUnmount]);
};

export default useTitle;