// src/pages/PublicPdfViewer.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const PublicPdfViewer = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendStreamUrl = `http://localhost:8000/api/v/${slug}`;

  useEffect(() => {
    if (!slug) { setError('Invalid document link.'); setLoading(false); return; }
    const verify = async () => {
      try {
        const res = await fetch(backendStreamUrl, { method: 'HEAD' });
        if (res.status === 404) setError('Document not found or link is invalid.');
        else if (res.status === 403) setError('You do not have permission to view this.');
        else if (!res.ok) setError('Unable to load document right now.');
      } catch {
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [slug, backendStreamUrl]);

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 90% 50% at 50% 0%, #001a14 0%, #000c09 40%, #000000 75%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >

      <div className="fixed pointer-events-none" style={{
        top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 500,
        background: 'radial-gradient(ellipse at top, rgba(0,217,181,0.09) 0%, transparent 65%)',
        filter: 'blur(10px)',
      }} />
      <div className="fixed pointer-events-none" style={{
        bottom: 0, right: '-5%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(0,140,100,0.06) 0%, transparent 65%)',
        filter: 'blur(20px)',
      }} />

      <div
        className="fixed top-0 w-full z-40"
        style={{
          height: 56,
          background: 'rgba(0,10,8,0.75)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(0,217,181,0.07)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <a
            href="/home"
            className="text-xs tracking-[0.35em] uppercase transition-colors"
            style={{ color: 'rgba(0,217,181,0.4)', fontWeight: 300 }}
            onMouseEnter={e => e.target.style.color = 'rgba(0,217,181,0.7)'}
            onMouseLeave={e => e.target.style.color = 'rgba(0,217,181,0.4)'}
          >
            PDFURL
          </a>

          {!loading && !error && (
            <div className="flex items-center gap-3">
              <span
                className="text-xs tracking-[0.15em] px-3 py-1 rounded-lg"
                style={{
                  color: 'rgba(0,217,181,0.65)',
                  background: 'rgba(0,217,181,0.07)',
                  border: '1px solid rgba(0,217,181,0.12)',
                  fontWeight: 300,
                }}
              >
                /v/{slug}
              </span>
              <span
                className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg"
                style={{
                  color: 'rgba(255,255,255,0.22)',
                  background: 'rgba(0,217,181,0.04)',
                  border: '1px solid rgba(0,217,181,0.08)',
                  fontWeight: 300,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#00D9B5', boxShadow: '0 0 8px rgba(0,217,181,0.8)' }}
                />
                Live
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-14 relative z-10">
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(0,217,181,0.1)' }} />
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{ border: '1px solid transparent', borderTopColor: '#00D9B5' }}
              />
            </div>
            <p className="text-xs tracking-[0.4em] uppercase" style={{ color: 'rgba(0,217,181,0.4)', fontWeight: 300 }}>
              Loading document
            </p>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex items-center justify-center p-6"
          >
            <GlassCard glow className="p-12 max-w-sm w-full text-center">
              <div className="absolute top-0 left-8 right-8 h-px" style={{
                background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.35), transparent)',
              }} />
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.14)' }}
              >
                <AlertTriangle size={22} style={{ color: 'rgba(239,68,68,0.7)' }} />
              </div>
              <h2 className="text-lg text-white mb-3" style={{ fontWeight: 300 }}>Document unavailable</h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>
                {error}
              </p>
              <a
                href="/home"
                className="inline-block text-xs tracking-[0.2em] uppercase px-6 py-3 rounded-xl transition-all"
                style={{
                  color: '#00D9B5',
                  background: 'rgba(0,217,181,0.07)',
                  border: '1px solid rgba(0,217,181,0.15)',
                  fontWeight: 300,
                }}
              >
                Return home
              </a>
            </GlassCard>
          </motion.div>
        )}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="flex-1 flex flex-col"
            style={{ padding: '10px 10px 10px' }}
          >
            <div
              className="flex-1 overflow-hidden"
              style={{
                borderRadius: '14px',
                border: '1px solid rgba(0,217,181,0.08)',
                background: 'rgba(0,15,11,0.6)',
                backdropFilter: 'blur(12px)',
                boxShadow: 'inset 0 1px 0 rgba(0,217,181,0.05), 0 0 60px rgba(0,0,0,0.5)',
              }}
            >
              <iframe
                src={backendStreamUrl}
                title="Document"
                className="w-full border-none"
                style={{ height: 'calc(100vh - 86px)', display: 'block' }}
              />
            </div>

            <div className="pt-3 text-center">
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.12)', fontWeight: 300 }}>
                PDF not rendering?{' '}
                <a
                  href={backendStreamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'rgba(0,217,181,0.45)' }}
                  className="transition-opacity hover:opacity-70"
                >
                  Open directly ↗
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PublicPdfViewer;