import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Breadcrumb = ({ items }) => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Breadcrumb"
      className="py-3"
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        <li>
          <Link to="/" className="text-[var(--color-text-muted)] hover:text-[#d4a017] transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="text-[var(--color-text-muted)]">›</span>
            {item.href && index < items.length - 1 ? (
              <Link to={item.href} className="text-[var(--color-text-muted)] hover:text-[#d4a017] transition-colors">
                {item.name}
              </Link>
            ) : (
              <span className="text-[#d4a017] font-medium">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </motion.nav>
  );
};

export default Breadcrumb;
