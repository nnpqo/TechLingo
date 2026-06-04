import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useProgress } from '@/hooks/useProgress';
import { useUserStore } from '@/store/userStore';
import { TechArea } from '@/types/index';
import { Flame } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const profile = useUserStore((state) => state.profile);
  const { getTotalLearned: totalLearned, getLevelInfo } = useProgress();
  const levelInfo = getLevelInfo();

  const areas: { id: TechArea; name: string; description: string; icon: string; color: string }[] = [
    {
      id: 'cybersecurity',
      name: 'Cybersecurity',
      description: 'Esta área se encarga de proteger sistemas, redes y datos contra ataques y accesos no autorizados.',
      icon: '🔐',
      color: 'from-cyber',
    },
    {
      id: 'frontend',
      name: 'Web Frontend',
      description: 'Esta área se enfoca en la interfaz: lo que ve el usuario en el navegador (UI, UX, HTML, CSS y JavaScript).',
      icon: '🌐',
      color: 'from-frontend',
    },
    {
      id: 'backend',
      name: 'Backend',
      description: 'Esta área se encarga de la lógica del servidor: APIs, autenticación, reglas de negocio e integración con datos.',
      icon: '⚙️',
      color: 'from-backend',
    },
    {
      id: 'database',
      name: 'Databases',
      description: 'Esta área gestiona el almacenamiento y consulta de información: modelos de datos, SQL, índices y transacciones.',
      icon: '🗄️',
      color: 'from-database',
    },
    {
      id: 'devops',
      name: 'DevOps',
      description: 'Esta área une desarrollo y operaciones: despliegues, CI/CD, contenedores, monitoreo y automatización.',
      icon: '🚀',
      color: 'from-devops',
    },
    {
      id: 'networking',
      name: 'Networking',
      description: 'Esta área se enfoca en cómo se conectan los sistemas: IP, DNS, protocolos, routing y arquitectura de redes.',
      icon: '🌍',
      color: 'from-network',
    },
  ];

  return (
    <div className="min-h-screen bg-bg-dark pb-20 md:pb-8">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-r from-primary-500 to-primary-700 text-white px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome back, {profile.name}! 👋</h1>
          <p className="text-xl text-primary-100 mb-6">Master technical English and level up your programming skills</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-3xl font-bold">{totalLearned}</div>
              <div className="text-sm text-primary-100">Terms Learned</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4 flex items-center gap-2">
              <Flame className="w-6 h-6" />
              <div>
                <div className="text-3xl font-bold">{profile.streak}</div>
                <div className="text-sm text-primary-100">Day Streak</div>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-3xl font-bold">{levelInfo.badge}</div>
              <div className="text-sm text-primary-100">{levelInfo.name}</div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Areas Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Learning Areas</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {areas.map((area) => (
              <motion.div key={area.id} whileHover={{ y: -4 }} onClick={() => navigate(`/lesson/${area.id}/1`)} className="cursor-pointer">
                <Card isHoverable className="h-full">
                  <div className="text-3xl mb-3">{area.icon}</div>
                  <h3 className="text-lg font-bold mb-1">{area.name}</h3>
                  <p className="text-sm text-text-secondary mb-3">{area.description}</p>
                  <Badge label={`${area.name}`} variant={area.id as any} size="sm" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
