import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Upload,
  Check,
  FileText,
  Edit2,
  LogOut,
  X,
  Link as LinkIcon,
  Trash2,
  Copy,
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';
import GlassInput from '../ui/GlassInput';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';


const EASE = [0.16, 1, 0.3, 1];
const ACCENT = '#00D9B5';

const frontendBaseUrl = import.meta.env.VITE_APP_URL || window.location.origin;


const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
const CopyToast = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.95, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -6, scale: 0.95, filter: 'blur(4px)' }}
        transition={{ duration: 0.3, ease: EASE }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-[10px] tracking-[0.2em] uppercase font-semibold border"
        style={{
          background: 'rgba(0,12,9,0.92)',
          borderColor: 'rgba(0,217,181,0.25)',
          color: ACCENT,
          backdropFilter: 'blur(20px)',
          fontFamily: "'Inter', sans-serif",
          boxShadow: '0 0 30px rgba(0,217,181,0.15)',
        }}
      >
        Link copied
      </motion.div>
    )}
  </AnimatePresence>
);

const UploadIcon = ({ status, dragActive }) => {
  const iconAnimation = (() => {
    if (status === 'uploading') return { rotate: 360, scale: 1.08, y: 0 };
    if (status === 'success') return { rotate: 0, scale: [1.15, 0.92, 1], y: 0 };
    if (dragActive) return { rotate: 0, scale: 1.06, y: -2 };
    return { rotate: 0, scale: 1, y: [0, -3, 0] };
  })();

  const iconTransition = (() => {
    if (status === 'uploading') {
      return {
        rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
        scale: { duration: 0.3, ease: EASE },
      };
    }
    if (status === 'success') return { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] };
    if (dragActive) return { duration: 0.25, ease: 'easeOut' };
    return { y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } };
  })();

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {/* Orbiting ring — visible only while uploading */}
      <AnimatePresence>
        {status === 'uploading' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-[-6px] rounded-2xl"
          >
            <motion.div
              className="w-full h-full rounded-2xl"
              style={{
                border: '1.5px solid transparent',
                borderTopColor: ACCENT,
                borderRightColor: 'rgba(0,217,181,0.3)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient pulse while uploading */}
      <AnimatePresence>
        {status === 'uploading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-[-10px] rounded-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(0,217,181,0.18) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Icon shell */}
      <motion.div
        className="relative w-12 h-12 rounded-xl flex items-center justify-center border z-10"
        style={{
          background:
            dragActive
              ? 'rgba(0,217,181,0.12)'
              : status === 'success'
              ? 'rgba(0,217,181,0.15)'
              : 'rgba(0,217,181,0.06)',
          borderColor:
            dragActive
              ? 'rgba(0,217,181,0.35)'
              : status === 'success'
              ? 'rgba(0,217,181,0.4)'
              : 'rgba(0,217,181,0.12)',
        }}
        animate={iconAnimation}
        transition={iconTransition}
      >
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <Check size={18} style={{ color: ACCENT }} strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Upload
                size={18}
                style={{
                  color:
                    dragActive || status === 'uploading'
                      ? ACCENT
                      : 'rgba(0,217,181,0.5)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};


const UploadStatusText = ({ status, dragActive }) => (
  <AnimatePresence mode="wait">
    {status === 'uploading' ? (
      <motion.div
        key="uploading"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25 }}
      >
        <p className="text-sm" style={{ color: ACCENT, fontWeight: 300 }}>
          Uploading…
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.18)', fontWeight: 300 }}>
          Encrypting and storing securely
        </p>
      </motion.div>
    ) : status === 'success' ? (
      <motion.div
        key="success"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25 }}
      >
        <p className="text-sm" style={{ color: ACCENT, fontWeight: 300 }}>
          Upload complete
        </p>
      </motion.div>
    ) : dragActive ? (
      <motion.p
        key="drag"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-sm"
        style={{ color: ACCENT, fontWeight: 300 }}
      >
        Release to upload
      </motion.p>
    ) : (
      <motion.div
        key="idle"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25 }}
      >
        <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>
          Drop a PDF here, or <span style={{ color: ACCENT }}>browse files</span>
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.18)', fontWeight: 300 }}>
          Max 40MB · PDF only
        </p>
      </motion.div>
    )}
  </AnimatePresence>
);

const DocumentRow = ({
  pdf,
  index,
  isLast,
  isEditing,
  editValue,
  onEditChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onCopy,
  onDelete,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.99 }}
    transition={{ duration: 0.4, delay: index * 0.02, ease: EASE }}
    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 transition-colors duration-300 hover:bg-[#00D9B5]/[0.015]"
    style={{ borderBottom: isLast ? 'none' : '1px solid rgba(0,217,181,0.05)' }}
  >
    {/* File identity */}
    <div className="flex items-center gap-4 min-w-0">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-300"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <FileText size={14} style={{ color: 'rgba(0,217,181,0.55)' }} />
      </div>
      <div className="min-w-0">
        <a
          href={`${frontendBaseUrl}/v/${pdf.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs font-medium text-zinc-300 hover:text-white transition-colors tracking-wide truncate"
        >
          {pdf.original_name}
        </a>
        <div className="flex items-center gap-1 mt-0.5" style={{ color: 'rgba(0,217,181,0.3)' }}>
          <LinkIcon size={10} />
          <span className="text-[11px] font-mono tracking-tight">/v/{pdf.slug}</span>
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
      {isEditing ? (
        <div className="flex items-center gap-1.5">
          <GlassInput
            className="py-1 px-2.5 text-xs"
            style={{ minWidth: 130 }}
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && onSaveEdit(pdf.id)}
          />
          <button
            onClick={() => onSaveEdit(pdf.id)}
            className="p-1.5 rounded-lg transition-colors"
            style={{
              background: 'rgba(0,217,181,0.1)',
              color: ACCENT,
              border: '1px solid rgba(0,217,181,0.2)',
            }}
            aria-label="Save slug"
          >
            <Check size={12} />
          </button>
          <button
            onClick={onCancelEdit}
            className="p-1.5 rounded-lg transition-colors"
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            aria-label="Cancel edit"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <>
          <a
            href={`${frontendBaseUrl}/v/${pdf.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-widest uppercase font-semibold px-3.5 py-1.5 rounded-lg border transition-colors"
            style={{
              borderColor: 'rgba(0,217,181,0.18)',
              background: 'rgba(0,217,181,0.05)',
              color: ACCENT,
            }}
          >
            View ↗
          </a>
          <button
            onClick={() => onStartEdit(pdf.id, pdf.slug)}
            className="p-2 rounded-lg border transition-colors"
            style={{
              borderColor: 'rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              color: 'rgba(255,255,255,0.35)',
            }}
            title="Edit slug"
            aria-label="Edit slug"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onCopy(pdf.slug)}
            className="p-2 rounded-lg border transition-colors"
            style={{
              borderColor: 'rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              color: 'rgba(255,255,255,0.35)',
            }}
            title="Copy link"
            aria-label="Copy link"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={() => onDelete(pdf.id, pdf.original_name)}
            className="p-2 rounded-lg transition-all"
            style={{ background: 'transparent', color: 'rgba(255,255,255,0.2)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
              e.currentTarget.style.color = 'rgba(239,68,68,0.65)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.2)';
            }}
            title="Delete"
            aria-label="Delete document"
          >
            <Trash2 size={12} />
          </button>
        </>
      )}
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState('idle'); 
  const [editingId, setEditingId] = useState(null);
  const [editSlugValue, setEditSlugValue] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const fetchPdfs = useCallback(async () => {
    try {
      const res = await api.get('/pdfs');
      setPdfs(res.data);
    } catch (err) {
      console.error('Failed to fetch documents', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPdfs();
  }, [fetchPdfs]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploadStatus('uploading');
      const formData = new FormData();
      formData.append('file', file);

      try {
        await api.post('/pdfs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setUploadStatus('success');
        await fetchPdfs();
        setTimeout(() => setUploadStatus('idle'), 1400);
      } catch (err) {
        console.error('Upload failed', err);
        setUploadStatus('idle');
      }
    },
    [fetchPdfs]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: uploadStatus === 'uploading',
  });

  const handleStartEdit = (id, currentSlug) => {
    setEditingId(id);
    setEditSlugValue(currentSlug);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditSlugValue('');
  };

  const handleSaveSlug = async (id) => {
    try {
      await api.patch(`/pdfs/${id}/slug`, { slug: editSlugValue });
      setEditingId(null);
      fetchPdfs();
    } catch (err) {
      alert(err.response?.data?.message || 'That slug is already taken.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}" permanently?`)) return;
    try {
      await api.delete(`/pdfs/${id}`);
      fetchPdfs();
    } catch (err) {
      console.error('Failed to delete document', err);
    }
  };

  const handleCopy = (slug) => {
    navigator.clipboard.writeText(`${frontendBaseUrl}/v/${slug}`);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  };

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden bg-black antialiased"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Ambient backdrop */}
      <div className="fixed pointer-events-none top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#00D9B5]/[0.08] to-transparent blur-[130px] z-0" />
      <div className="fixed pointer-events-none top-[35%] left-[-15%] w-[400px] h-[400px] bg-[#00D9B5]/[0.03] rounded-full blur-[120px] z-0" />
      <div className="fixed pointer-events-none bottom-[10%] right-[-10%] w-[450px] h-[450px] bg-zinc-900/30 rounded-full blur-[100px] z-0" />

      <CopyToast visible={toastVisible} />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 bg-black/20 border-b border-zinc-900/40 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between h-16">
          <span className="text-[11px] font-black tracking-[0.4em] uppercase" style={{ color: ACCENT }}>
            PDFURL
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs hidden sm:block font-medium tracking-wide" style={{ color: ACCENT }}>
              {user?.name}
            </span>
            <GlassButton
              variant="secondary"
              onClick={logout}
              className="gap-2 py-1.5 px-3.5 text-[11px] tracking-wider border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900 hover:text-[#00D9B5] text-zinc-400 font-medium rounded-xl transition-all"
            >
              <LogOut size={11} />
              Logout
            </GlassButton>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-24 relative z-10 space-y-10">
        {/* Header */}
        <Reveal delay={0.05}>
          <div className="space-y-1.5">
            <p className="text-[10px] tracking-[0.4em] uppercase font-black" style={{ color: ACCENT }}>
              Dashboard
            </p>
            <h1 className="text-3xl text-white font-extrabold tracking-tight">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-[#00D9B5] to-teal-200 bg-clip-text text-transparent">
                {user?.name || 'there'}
              </span>
            </h1>
            <p className="text-xs text-zinc-500 font-light tracking-wide">
              Manage, upload, and share your documents with ease.
            </p>
          </div>
        </Reveal>

        {/* Upload zone */}
        <Reveal delay={0.12}>
          <GlassCard className="bg-zinc-950/40 border border-zinc-900/80 p-1 rounded-2xl shadow-2xl">
            <div
              {...getRootProps()}
              className={`relative transition-all duration-500 p-12 rounded-xl text-center flex flex-col items-center gap-3.5 border border-dashed ${
                uploadStatus === 'uploading' ? 'cursor-wait' : 'cursor-pointer'
              } ${
                isDragActive
                  ? 'border-[#00D9B5] bg-[#00D9B5]/[0.02]'
                  : 'border-zinc-900/60 bg-transparent hover:border-zinc-800'
              }`}
            >
              <input {...getInputProps()} />
              <UploadIcon status={uploadStatus} dragActive={isDragActive} />
              <UploadStatusText status={uploadStatus} dragActive={isDragActive} />
            </div>
          </GlassCard>
        </Reveal>

        {/* Document list */}
        <Reveal delay={0.18} className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <p className="text-[10px] tracking-[0.25em] uppercase text-zinc-500 font-bold">
              {pdfs.length > 0 ? `${pdfs.length} document${pdfs.length !== 1 ? 's' : ''}` : 'Documents'}
            </p>
          </div>

          <GlassCard className="bg-zinc-950/40 border border-zinc-900/80 rounded-2xl overflow-hidden shadow-2xl">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div
                  className="w-5 h-5 rounded-full animate-spin"
                  style={{ border: '1px solid rgba(255,255,255,0.06)', borderTopColor: ACCENT }}
                />
                <span className="text-[9px] text-zinc-600 tracking-widest font-bold uppercase">
                  Loading
                </span>
              </div>
            ) : pdfs.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-xs text-zinc-600 font-light">
                  No documents yet — upload one above to get started.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-900/40">
                <AnimatePresence mode="popLayout">
                  {pdfs.map((pdf, i) => (
                    <DocumentRow
                      key={pdf.id}
                      pdf={pdf}
                      index={i}
                      isLast={i === pdfs.length - 1}
                      isEditing={editingId === pdf.id}
                      editValue={editSlugValue}
                      onEditChange={setEditSlugValue}
                      onStartEdit={handleStartEdit}
                      onCancelEdit={handleCancelEdit}
                      onSaveEdit={handleSaveSlug}
                      onCopy={handleCopy}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </GlassCard>
        </Reveal>
      </main>
    </div>
  );
};

export default Dashboard;