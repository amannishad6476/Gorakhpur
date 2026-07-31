import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', fullPage = false }) => {
  const sizes = { sm: 32, md: 48, lg: 64 };
  const s = sizes[size];

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        style={{ width: s, height: s, border: `${s/12}px solid rgba(212,160,23,0.2)`, borderTop: `${s/12}px solid #d4a017`, borderRadius: '50%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      {size !== 'sm' && <p className="text-[var(--color-text-muted)] text-sm">Loading...</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'var(--color-surface)' }}>
        {spinner}
      </div>
    );
  }
  return <div className="flex items-center justify-center py-12">{spinner}</div>;
};

export default LoadingSpinner;
