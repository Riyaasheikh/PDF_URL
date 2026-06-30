import React from 'react';
const GlassCard = ({ children, className = '', glow = false }) => (
  <div
    className={`relative rounded-2xl ${className}`}
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      boxShadow: glow
        ? '0 0 60px rgba(0,217,181,0.06), inset 0 1px 0 rgba(255,255,255,0.06)'
        : 'inset 0 1px 0 rgba(255,255,255,0.05)',
    }}
  >
    {children}
  </div>
);

export default GlassCard;