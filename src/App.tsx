import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './components/AuthProvider';
import { LoginForm } from './components/LoginForm';
import { Sidebar } from './components/Sidebar';
import { ExecutiveDashboard } from './components/dashboards/ExecutiveDashboard';
import { ManagerDashboard } from './components/dashboards/ManagerDashboard';
import { ExecutorDashboard } from './components/dashboards/ExecutorDashboard';
import { CreativeDashboard } from './components/dashboards/CreativeDashboard';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, login, logout, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('');

  // Set default view based on user role
  const getDefaultView = (role: string) => {
    switch (role) {
      case 'OWNER': return 'executive';
      case 'MANAGER': return 'logistics';
      case 'EXECUTOR': return 'field';
      case 'CREATIVE': return 'creative';
      default: return 'executive';
    }
  };

  // Initialize current view when user logs in
  if (user && !currentView) {
    setCurrentView(getDefaultView(user.role));
  }

  const renderDashboard = () => {
    if (!user) return null;

    switch (currentView) {
      case 'executive':
      case 'projects':
      case 'settings':
        return <ExecutiveDashboard />;
      case 'logistics':
      case 'vendors':
      case 'schedule':
        return <ManagerDashboard />;
      case 'field':
      case 'reports':
      case 'callsheet':
        return <ExecutorDashboard />;
      case 'creative':
      case 'script':
      case 'review':
        return <CreativeDashboard />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Initializing Shotweave...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={login} isLoading={isLoading} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar 
        user={user} 
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={logout}
      />
      
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            {renderDashboard()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <div className="dark">
      <AuthProvider>
        <AppContent />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              border: '1px solid #334155',
              color: '#f1f5f9',
            },
          }}
        />
      </AuthProvider>
    </div>
  );
}