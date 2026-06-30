import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassButton from '../ui/GlassButton';
import BubbleSphere from '../components/BubbleSphere';
import { initLenis, destroyLenis } from '../lib/lenis';
import Footer from '../global/Footer';
import Navbar from '../global/Navbar';

const FadeUp = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const STEPS = [
  {
    num: '01',
    title: 'Upload your PDF',
    desc: 'Drag and drop any document. We handle encryption, compression, and storage — instantly.',
  },
  {
    num: '02',
    title: 'Choose your slug',
    desc: 'Pick a clean, memorable URL like pdfurl.io/your-name. Brand every link you share.',
  },
  {
    num: '03',
    title: 'Share anywhere',
    desc: 'One link. Works on any device, any browser. No accounts needed to view.',
  },
];

const Landing = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const sphereScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.08]);

  useEffect(() => {
    const lenis = initLenis();
    return () => destroyLenis();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: '#000000', fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── NAV ── */}
      <Navbar/>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-[72px]">
        {/* Left: text */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-xs tracking-[0.4em] text-[#00D9B5] uppercase mb-8"
            >
              Document Hosting, Redefined
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-6xl md:text-7xl xl:text-8xl font-extralight leading-[1.0] tracking-[-0.02em] mb-8"
            >
              Host PDFs<br />
              <span style={{ color: '#00D9B5' }}>with purpose.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.55 }}
              className="text-lg text-white/40 leading-relaxed mb-12 max-w-md font-light"
            >
              Upload any document. Generate a beautiful, branded link in seconds.
              Share with confidence — no friction, no clutter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="flex items-center gap-4"
            >
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#00c4a3' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 text-sm tracking-widest uppercase text-black font-medium transition-colors"
                  style={{ background: '#00D9B5', borderRadius: '2px' }}
                >
                  Start Uploading
                </motion.button>
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 text-sm tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors"
              >
                Sign In →
              </Link>
            </motion.div>
          </div>

          {/* Right: Sphere */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ scale: sphereScale }}
            className="hidden lg:flex items-center justify-center relative"
          >
            {/* Ambient glow behind sphere */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(0,217,181,0.12) 0%, transparent 65%)',
                filter: 'blur(40px)',
                transform: 'scale(1.2)',
              }}
            />
            <BubbleSphere size={480} />
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #000)' }}
        />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-40 max-w-7xl mx-auto px-8">
        <FadeUp>
          <p className="text-xs tracking-[0.4em] text-[#00D9B5] uppercase mb-4">Process</p>
          <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-white/90 mb-20">
            Three steps to<br />
            <span className="text-white/40">perfect sharing.</span>
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {STEPS.map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.12}>
              <div
                className="p-10 h-full"
                style={{ background: '#000' }}
              >
                <p
                  className="text-xs tracking-[0.3em] mb-8 font-light"
                  style={{ color: '#00D9B5' }}
                >
                  {step.num}
                </p>
                <h3 className="text-xl font-light text-white mb-4 leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-white/35 leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── FEATURE HIGHLIGHT ── */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Mini sphere (smaller) */}
          <FadeUp className="hidden lg:flex justify-center">
            <div className="relative">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, rgba(0,217,181,0.09) 0%, transparent 65%)',
                  filter: 'blur(30px)',
                  transform: 'scale(1.3)',
                }}
              />
              <BubbleSphere size={320} />
            </div>
          </FadeUp>

          <div>
            <FadeUp>
              <p className="text-xs tracking-[0.4em] text-[#00D9B5] uppercase mb-4">Why PDFURL</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-8 leading-tight">
                Your documents,<br />
                <span className="text-white/40">your identity.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-base text-white/40 leading-relaxed font-light mb-8 max-w-md">
                Most file sharing feels disposable. Long, random URLs that nobody can remember.
                PDFURL gives every document a home — a clean link that belongs to you.
              </p>
            </FadeUp>

            {[
              ['Custom slugs', 'pdfurl.io/your-portfolio — not a 32-character hash.'],
              ['Instant access', 'Recipients open directly in-browser, no download required.'],
              ['Secure by default', 'End-to-end encrypted. Your files stay private.'],
            ].map(([title, desc], i) => (
              <FadeUp key={title} delay={0.25 + i * 0.1}>
                <div className="flex gap-5 mb-6">
                  <div
                    className="w-1 self-stretch flex-shrink-0"
                    style={{ background: '#00D9B5', opacity: 0.4 }}
                  />
                  <div>
                    <p className="text-sm text-white font-light mb-1">{title}</p>
                    <p className="text-sm text-white/30 font-light">{desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-48 text-center">
        <FadeUp>
          <p className="text-xs tracking-[0.4em] text-[#00D9B5] uppercase mb-8">
            Ready
          </p>
          <h2 className="text-5xl md:text-7xl font-extralight tracking-tight mb-12">
            Upload your first<br />
            <span className="text-white/30">document today.</span>
          </h2>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: '#00c4a3' }}
              whileTap={{ scale: 0.97 }}
              className="px-12 py-5 text-sm tracking-widest uppercase text-black font-medium transition-colors"
              style={{ background: '#00D9B5', borderRadius: '2px' }}
            >
              Get Started — Free
            </motion.button>
          </Link>
        </FadeUp>
      </section>

      {/* ── FOOTER ── */}
      <Footer/>
    </div>
  );
};

export default Landing;