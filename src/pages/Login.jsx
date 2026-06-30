import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import GlassInput from '../ui/GlassInput';
import GlassButton from '../ui/GlassButton';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/login', { email, password });
      login(res.data.user, res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, #001f18 0%, #000e0b 40%, #000000 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >

      <div className="absolute pointer-events-none" style={{
        top: '0%', left: '50%', transform: 'translateX(-50%)',
        width: 900, height: 600,
        background: 'radial-gradient(ellipse at center, rgba(0,217,181,0.13) 0%, rgba(0,217,181,0.04) 40%, transparent 70%)',
        filter: 'blur(8px)',
      }} />

      <div className="absolute pointer-events-none" style={{
        bottom: '-10%', left: '-10%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(0,120,90,0.12) 0%, transparent 65%)',
        filter: 'blur(20px)',
      }} />

      <div className="absolute pointer-events-none" style={{
        top: '-5%', right: '-5%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(0,180,140,0.07) 0%, transparent 65%)',
        filter: 'blur(20px)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link
            to="/home"
            className="inline-block text-xs tracking-[0.45em] uppercase transition-colors"
            style={{ color: 'rgba(0,217,181,0.4)', fontWeight: 300 }}
            onMouseEnter={e => e.target.style.color = 'rgba(0,217,181,0.7)'}
            onMouseLeave={e => e.target.style.color = 'rgba(0,217,181,0.4)'}
          >
            PDFURL
          </Link>
        </div>

        <GlassCard glow className="p-8">

          <div className="absolute top-0 left-8 right-8 h-px" style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,217,181,0.5), transparent)',
          }} />

          <div className="mb-8">
            <h1 className="text-2xl text-white mb-2" style={{ fontWeight: 300, letterSpacing: '-0.01em' }}>
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>
              Log in to manage your documents
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl text-xs text-center"
                style={{
                  background: 'rgba(239,68,68,0.07)',
                  border: '1px solid rgba(239,68,68,0.18)',
                  color: 'rgba(239,68,68,0.9)',
                  fontWeight: 300,
                  letterSpacing: '0.02em',
                }}
              >
                {error}
              </motion.div>
            )}

            <GlassInput
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <GlassInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <GlassButton type="submit" className="w-full py-3.5" loading={loading}>
                Log in
              </GlassButton>
            </div>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.22)', fontWeight: 300 }}>
            No account?{' '}
            <Link
              to="/signup"
              style={{ color: '#00D9B5' }}
              onMouseEnter={e => e.target.style.opacity = '0.7'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              Sign up
            </Link>
          </p>
        </GlassCard>

        <div className="mt-8 flex items-center gap-4" style={{ opacity: 0.25 }}>
          <div className="flex-1 h-px" style={{ background: 'rgba(0,217,181,0.2)' }} />
          <span className="text-xs tracking-[0.4em] uppercase" style={{ color: 'rgba(0,217,181,0.6)', fontWeight: 300 }}>
            Secure
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(0,217,181,0.2)' }} />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;