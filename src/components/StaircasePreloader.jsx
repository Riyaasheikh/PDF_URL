import React from 'react';
import { motion } from 'framer-motion';

const StaircasePreloader = ({ isExiting, onComplete }) => {
  const columns = 7;

  return (
    <div className="fixed inset-0 z-50 flex pointer-events-none">
      {[...Array(columns)].map((_, i) => (
        <motion.div
          key={i}
          custom={columns - i}
          initial={{ scaleY: 1, originY: 0 }}
          animate={
            isExiting
              ? {
                  scaleY: 0,
                  transition: {
                    duration: 0.7,
                    ease: [0.76, 0, 0.24, 1],
                    delay: 0.06 * (columns - i),
                  },
                }
              : { scaleY: 1 }
          }
          onAnimationComplete={i === 0 ? onComplete : undefined}
          style={{ transformOrigin: 'top' }}
          className="h-full flex-1 bg-black relative"
        />
      ))}
    </div>
  );
};

export default StaircasePreloader;