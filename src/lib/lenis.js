import Lenis from '@studio-freight/lenis';

let lenisInstance = null;
let rafId = null; 

export const initLenis = () => {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  const raf = (time) => {
    if (lenisInstance) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf); 
    }
  };
  
  rafId = requestAnimationFrame(raf);

  return lenisInstance;
};

export const getLenis = () => lenisInstance;

export const destroyLenis = () => {
  // 1. Stop the animation loop immediately
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  // 2. Safely teardown the instance
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
};