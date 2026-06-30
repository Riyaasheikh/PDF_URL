import React from 'react';

const GlassInput = ({ className = '', error, ...props }) => (
  <div className="w-full">
    <input
      className={`w-full px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none transition-all duration-200 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: error ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        backdropFilter: 'blur(12px)',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 300,
        letterSpacing: '0.01em',
      }}
      onFocus={(e) => {
        e.target.style.border = '1px solid rgba(0,217,181,0.5)';
        e.target.style.background = 'rgba(0,217,181,0.04)';
        e.target.style.boxShadow = '0 0 0 3px rgba(0,217,181,0.06)';
      }}
      onBlur={(e) => {
        e.target.style.border = error ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)';
        e.target.style.background = 'rgba(255,255,255,0.04)';
        e.target.style.boxShadow = 'none';
      }}
      {...props}
    />
    {error && (
      <p className="mt-1.5 text-xs text-red-400/80 pl-1" style={{ fontWeight: 300 }}>
        {error}
      </p>
    )}
  </div>
);

export default GlassInput;