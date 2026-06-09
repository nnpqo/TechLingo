import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { X } from 'lucide-react';

interface Props {
  term: any;
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearchModal: React.FC<Props> = ({
  term,
  isOpen,
  onClose
}) => {
  if (!isOpen || !term) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-bg-dark rounded-2xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-4xl mb-2">💡</div>
            <h2 className="text-3xl font-bold text-primary-500">
              {term.english}
            </h2>
            <p className="text-sm text-text-secondary mt-1">{term.spanish}</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-primary-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-secondary mb-2">Definition</h3>
            <p className="text-text-primary">{term.definition_en}</p>
            <p className="text-text-secondary text-sm mt-2">{term.definition_es}</p>
          </div>

          {term.contextSentence && (
            <div className="p-4 bg-bg-elevated rounded-xl border border-border-color">
              <h3 className="font-bold text-secondary mb-2">Example in Context</h3>
              <p className="text-text-primary italic">"{term.contextSentence}"</p>
            </div>
          )}

          {term.codeExample && (
            <div className="p-4 bg-bg-dark rounded-xl border border-border-color">
              <h3 className="font-bold text-primary-400 mb-2">Code Example</h3>
              <pre className="text-xs text-primary-400 font-mono overflow-x-auto">
                {term.codeExample}
              </pre>
            </div>
          )}

          <div className="flex gap-3">
            <Button className="flex-1" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GlobalSearchModal;