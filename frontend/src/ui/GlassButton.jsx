import React from 'react';
import { motion } from 'framer-motion';

const GlassButton = ({
  children,
  className = '',
  loading = false,
  variant = 'primary',
  ...props
}) => {
  const styles = {
    primary: {
      background: '#00D9B5',
      color: '#000',
      border: 'none',
      boxShadow: '0 0 30px rgba(0,217,181,0.2)',
      fontWeight: 500,
    },
    secondary: {
      background: 'rgba(255,255,255,0.04)',
      color: 'rgba(255,255,255,0.6)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: 'none',
      fontWeight: 300,
    },
    ghost: {
      background: 'transparent',
      color: 'rgba(255,255,255,0.4)',
      border: '1px solid rgba(255,255,255,0.06)',
      fontWeight: 300,
    },
    danger: {
      background: 'rgba(239,68,68,0.1)',
      color: 'rgba(239,68,68,0.8)',
      border: '1px solid rgba(239,68,68,0.2)',
      fontWeight: 300,
    },
  };

  return (
    <motion.button
      whileHover={{ scale: 1.015, opacity: 0.92 }}
      whileTap={{ scale: 0.975 }}
      className={`relative overflow-hidden rounded-xl px-6 py-3 text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        borderRadius: '10px',
        ...styles[variant],
      }}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60" />
      ) : (
        children
      )}
    </motion.button>
  );
};

export default GlassButton;