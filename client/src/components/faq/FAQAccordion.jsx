import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQAccordion = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={faq._id || index}
          className="rounded-xl overflow-hidden"
          style={{ border: `1px solid ${openIndex === index ? '#d4a017' : 'var(--color-border)'}`, transition: 'border-color 0.3s' }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
            style={{ background: openIndex === index ? 'rgba(212,160,23,0.06)' : 'var(--color-surface)' }}
            aria-expanded={openIndex === index}
          >
            <span className="font-semibold text-[var(--color-text)] text-sm md:text-base pr-4">
              {faq.question}
            </span>
            <motion.span
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-[#d4a017] text-lg flex-shrink-0"
            >
              ▾
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="px-5 pb-4 pt-1">
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
