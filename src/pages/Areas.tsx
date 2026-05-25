import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useProgress } from '@/hooks/useProgress';
import { cybersecurityTerms, frontendTerms, backendTerms, databaseTerms, devopsTerms, networkingTerms } from '@/data/terms';
import { TechArea } from '@/types/index';

const Areas: React.FC = () => {
  const navigate = useNavigate();
  const { getAreaProgress } = useProgress();

  const areas: { id: TechArea; name: string; description: string; icon: string; color: string; gradient: string }[] = [
    {
      id: 'cybersecurity',
      name: '🔐 Cybersecurity',
      description: 'Learn firewall, encryption, phishing, authentication, and more security concepts',
      icon: '🔐',
      color: 'cyber',
      gradient: 'from-cyber to-red-900',
    },
    {
      id: 'frontend',
      name: '🌐 Web Frontend',
      description: 'Master DOM, React, CSS, responsive design, and browser APIs',
      icon: '🌐',
      color: 'frontend',
      gradient: 'from-frontend to-blue-900',
    },
    {
      id: 'backend',
      name: '⚙️ Backend',
      description: 'Explore APIs, REST, Node.js, databases, and server architecture',
      icon: '⚙️',
      color: 'backend',
      gradient: 'from-backend to-green-900',
    },
    {
      id: 'database',
      name: '🗄️ Databases',
      description: 'Understand SQL, schemas, transactions, indexing, and database design',
      icon: '🗄️',
      color: 'database',
      gradient: 'from-database to-yellow-900',
    },
    {
      id: 'devops',
      name: '🚀 DevOps',
      description: 'Learn CI/CD, Docker, Kubernetes, monitoring, and deployment strategies',
      icon: '🚀',
      color: 'devops',
      gradient: 'from-devops to-orange-900',
    },
    {
      id: 'networking',
      name: '🌍 Networking',
      description: 'Grasp protocols, IP, DNS, TCP/UDP, VPN, and network architecture',
      icon: '🌍',
      color: 'network',
      gradient: 'from-network to-purple-900',
    },
  ];

  const termsByArea: Record<TechArea, any[]> = {
    cybersecurity: cybersecurityTerms,
    frontend: frontendTerms,
    backend: backendTerms,
    database: databaseTerms,
    devops: devopsTerms,
    networking: networkingTerms,
  };

  return (
    <div className="min-h-screen bg-bg-dark pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Choose Your Learning Path</h1>
          <p className="text-lg text-text-secondary">Select a technical area to master vocabulary in your field</p>
        </motion.div>

        {/* Areas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, index) => {
            const progress = getAreaProgress(termsByArea[area.id]);

            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  isHoverable
                  onClick={() => navigate(`/lesson/${area.id}/1`)}
                  className={`bg-gradient-to-br ${area.gradient} relative overflow-hidden h-full cursor-pointer`}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />

                  <div className="relative z-10">
                    <div className="text-5xl mb-4">{area.icon}</div>

                    <h3 className="text-2xl font-bold text-white mb-2">{area.name}</h3>
                    <p className="text-sm text-gray-200 mb-6">{area.description}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-white border-opacity-20">
                      <div>
                        <div className="text-2xl font-bold text-white">{progress.learned}</div>
                        <div className="text-xs text-gray-300">Learned</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{progress.total}</div>
                        <div className="text-xs text-gray-300">Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{progress.percentage}%</div>
                        <div className="text-xs text-gray-300">Progress</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-black bg-opacity-20 rounded-full h-2 mb-6 overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r to-${area.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                      />
                    </div>

                    <Button className="w-full" variant="secondary" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/lesson/${area.id}/1`);
                    }}>
                      Start Learning →
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Areas;
