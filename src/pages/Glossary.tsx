import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { PronunciationCard } from '@/components/features';
import { cybersecurityTerms, frontendTerms, backendTerms, databaseTerms, devopsTerms, networkingTerms } from '@/data/terms';
import { Term, TechArea } from '@/types/index';
import { Search } from 'lucide-react';

const Glossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<TechArea | 'all'>('all');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  const allTerms: Term[] = [
    ...cybersecurityTerms,
    ...frontendTerms,
    ...backendTerms,
    ...databaseTerms,
    ...devopsTerms,
    ...networkingTerms,
  ];

  const areas: { id: TechArea | 'all'; name: string; emoji: string }[] = [
    { id: 'all', name: 'All Areas', emoji: '📚' },
    { id: 'cybersecurity', name: 'Cybersecurity', emoji: '🔐' },
    { id: 'frontend', name: 'Frontend', emoji: '🌐' },
    { id: 'backend', name: 'Backend', emoji: '⚙️' },
    { id: 'database', name: 'Database', emoji: '🗄️' },
    { id: 'devops', name: 'DevOps', emoji: '🚀' },
    { id: 'networking', name: 'Networking', emoji: '🌍' },
  ];

  const filteredTerms = allTerms.filter((term) => {
    const matchesSearch =
      term.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.spanish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition_en.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea = selectedArea === 'all' || term.area === selectedArea;

    return matchesSearch && matchesArea;
  });

  return (
    <div className="min-h-screen bg-bg-dark pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Technical Glossary</h1>
          <p className="text-lg text-text-secondary">{filteredTerms.length} terms available</p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-4 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by term, translation, or definition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-bg-card border-2 border-border-color focus:border-primary-500 text-text-primary placeholder-text-secondary focus:outline-none"
          />
        </div>

        {/* Area Filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => setSelectedArea(area.id)}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                selectedArea === area.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-bg-card border border-border-color text-text-secondary hover:border-primary-500'
              }`}
            >
              {area.emoji} {area.name}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Terms List */}
          <div className="lg:col-span-1">
            <Card className="max-h-96 overflow-y-auto">
              <h3 className="font-bold text-lg mb-4">Terms ({filteredTerms.length})</h3>
              <div className="space-y-2">
                {filteredTerms.map((term) => (
                  <motion.button
                    key={term.id}
                    onClick={() => setSelectedTerm(term)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedTerm?.id === term.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-bg-elevated hover:bg-primary-500 hover:text-white text-text-primary'
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="font-semibold">{term.english}</div>
                    <div className="text-xs opacity-75">{term.spanish}</div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </div>

          {/* Term Details */}
          <div className="lg:col-span-2">
            {selectedTerm ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <PronunciationCard
                  term={selectedTerm.english}
                  phonetic={selectedTerm.phonetic}
                  pronunciation_guide={selectedTerm.pronunciation_guide}
                  definition_en={selectedTerm.definition_en}
                  definition_es={selectedTerm.definition_es}
                  codeExample={selectedTerm.codeExample}
                  contextSentence={selectedTerm.contextSentence}
                />

                <Card className="mt-6">
                  <h3 className="font-bold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.tags.map((tag) => (
                      <Badge key={tag} label={tag} size="sm" />
                    ))}
                  </div>

                  {selectedTerm.relatedTerms.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold mb-3">Related Terms</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTerm.relatedTerms.map((relatedId) => {
                          const related = allTerms.find((t) => t.id === relatedId);
                          return related ? (
                            <button
                              key={relatedId}
                              onClick={() => setSelectedTerm(related)}
                              className="px-3 py-1.5 rounded-lg bg-primary-500 bg-opacity-20 text-primary-500 hover:bg-opacity-40 transition-all"
                            >
                              {related.english}
                            </button>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ) : (
              <Card className="flex items-center justify-center h-96">
                <div className="text-center">
                  <p className="text-3xl mb-4">📖</p>
                  <p className="text-text-secondary">Select a term to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Glossary;
