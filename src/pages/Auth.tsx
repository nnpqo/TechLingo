import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';

type Mode = 'login' | 'register';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((s) => s.auth.isAuthenticated);
  const login = useUserStore((s) => s.login);
  const register = useUserStore((s) => s.register);

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const title = useMemo(() => (mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'), [mode]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'register') {
      register({ name, email, password });
    } else {
      login({ email, password, name });
    }

    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-text-primary">TechLingo</h1>
          <p className="text-text-secondary mt-2">Registro/Login simulado: cualquier dato funciona</p>
        </div>

        <Card>
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl font-semibold border transition-colors ${
                mode === 'login'
                  ? 'border-primary-500 bg-primary-500 bg-opacity-20 text-primary-500'
                  : 'border-border-color text-text-secondary hover:border-primary-500'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-xl font-semibold border transition-colors ${
                mode === 'register'
                  ? 'border-primary-500 bg-primary-500 bg-opacity-20 text-primary-500'
                  : 'border-border-color text-text-secondary hover:border-primary-500'
              }`}
            >
              Registro
            </button>
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-4">{title}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-text-secondary mb-2">Nombre</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-border-color focus:outline-none focus:border-primary-500"
                  placeholder="Tu nombre (opcional)"
                />
              </div>
            )}

            {mode === 'login' && (
              <div>
                <label className="block text-sm text-text-secondary mb-2">Nombre (opcional)</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-border-color focus:outline-none focus:border-primary-500"
                  placeholder="Si lo completas, lo usamos para saludarte"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-text-secondary mb-2">Email (opcional)</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-border-color focus:outline-none focus:border-primary-500"
                placeholder="email@ejemplo.com"
                type="email"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Contraseña (opcional)</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-border-color focus:outline-none focus:border-primary-500"
                placeholder="••••••••"
                type="password"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
