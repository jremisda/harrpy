import { useEffect, useRef, useState } from 'react';

interface UseLazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}

/**
 * A hook that implements lazy loading behavior using IntersectionObserver.
 * Useful for delaying the loading of images until they are about to enter the viewport.
 */
const useLazyLoad = <T extends HTMLElement>({
  rootMargin = '200px 0px',
  threshold = 0.01,
  once = true,
}: UseLazyLoadOptions = {}) => {
  const elementRef = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      // If no element or no support for IntersectionObserver, mark as visible
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // If the once option is true, disconnect after visibility is triggered
            if (once) {
              observer.disconnect();
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, once]);

  return { elementRef, isVisible };
};

export default useLazyLoad; 