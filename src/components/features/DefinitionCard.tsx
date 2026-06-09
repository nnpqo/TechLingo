import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ChevronDown } from 'lucide-react';
import { PracticalExample } from '@/types/index';

interface DefinitionCardProps {
  english: string;
  spanish: string;
  definition_en: string;
  definition_es: string;
  practicalExamples?: PracticalExample[];
  level: string;
}

const DefinitionCard: React.FC<DefinitionCardProps> = ({
  english,
  spanish,
  definition_en,
  definition_es,
  practicalExamples = [],
  level,
}) => {
  const [expandedExample, setExpandedExample] = useState<number | null>(null);

  if (!practicalExamples || practicalExamples.length === 0) {
    return null;
  }

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-600',
      typescript: 'bg-blue-600',
      python: 'bg-blue-500',
      sql: 'bg-orange-600',
      bash: 'bg-gray-700',
      html: 'bg-red-600',
      css: 'bg-blue-400',
    };
    return colors[lang] || 'bg-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-bg-card to-bg-elevated border border-primary-500 border-opacity-20 rounded-2xl p-6 mt-6"
    >
      <h4 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
        <Code2 size={20} className="text-primary-500" /> Practical Examples
      </h4>
      
      <div className="space-y-3">
        {practicalExamples.map((example, idx) => (
          <motion.div
            key={idx}
            className="border border-border-color rounded-xl overflow-hidden"
          >
            <motion.button
              onClick={() => setExpandedExample(expandedExample === idx ? null : idx)}
              className="w-full p-4 bg-bg-elevated hover:bg-bg-card transition-colors flex items-center justify-between text-left"
            >
              <div className="flex-1">
                <p className="font-semibold text-text-primary">{example.title}</p>
                <p className="text-xs text-text-secondary mt-1">{example.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className={`${getLanguageColor(example.language)} text-white text-xs px-2 py-1 rounded font-semibold`}>
                  {example.language.toUpperCase()}
                </span>
                <motion.div
                  animate={{ rotate: expandedExample === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={18} className="text-text-secondary" />
                </motion.div>
              </div>
            </motion.button>

            <AnimatePresence>
              {expandedExample === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-border-color"
                >
                  <div className="p-4 bg-bg-dark">
                    <pre className="bg-bg-elevated rounded-lg p-3 overflow-x-auto mb-3">
                      <code className="text-xs text-primary-400 font-mono whitespace-pre-wrap">
                        {example.code}
                      </code>
                    </pre>
                    <p className="text-sm text-text-secondary">{example.context}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DefinitionCard;
