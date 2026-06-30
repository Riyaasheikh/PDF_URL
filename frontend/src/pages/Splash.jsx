import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StaircasePreloader from "../components/StaircasePreloader";
import { useAuth } from "../context/AuthContext";

const Splash = () => {
  const [isExiting, setIsExiting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsExiting(true), 2800);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handlePreloaderComplete = () => {
    setIsComplete(true);
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/home", { replace: true });
    }
  };

  if (isComplete) return null;

  return (
    <>
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black overflow-hidden"
            exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.1 } }}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,217,181,0.06) 0%, transparent 70%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 text-center select-none"
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 flex justify-center"
              >
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border border-[#00D9B5]/20" />
                  <div className="absolute inset-[6px] rounded-full border border-[#00D9B5]/40" />
                  <div className="absolute inset-[12px] rounded-full bg-[#00D9B5]/80" />
                </div>
              </motion.div>

              <h1
                className="text-4xl md:text-6xl font-light tracking-[0.25em] text-white uppercase"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.3em",
                }}
              >
                PDFURL
              </h1>

              <motion.div
                className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 30%, #001f18 0%, #000e0b 45%, #000000 100%)",
                }}
                exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.1 } }}
              ></motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="mt-4 text-xs tracking-[0.4em] text-white/30 uppercase"
              >
                Document Hosting, Refined
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <StaircasePreloader
        isExiting={isExiting}
        onComplete={handlePreloaderComplete}
      />
    </>
  );
};

export default Splash;
