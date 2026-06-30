import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
const Navbar = () => {
  return (
<nav className="fixed w-full z-50 top-0">
        <div
          className="max-w-7xl mx-auto px-8 h-18 flex items-center justify-between"
          style={{ height: '72px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <span
            className="text-lg font-light tracking-[0.2em] text-white uppercase"
          >
            PDFURL
          </span>
          <div className="flex items-center gap-8">
            <Link
              to="/login"
              className="text-sm tracking-widest text-white/40 hover:text-white/80 transition-colors uppercase"
            >
              Log in
            </Link>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="text-sm tracking-widest px-6 py-2.5 uppercase text-black font-medium"
                style={{ background: '#00D9B5', borderRadius: '2px' }}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>
    );
};

export default Navbar;