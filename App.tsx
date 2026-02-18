
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { User } from './types';
import { ToastProvider } from './components/ui/Toast';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ToastProvider>
      <AnimatePresence mode="wait">
        {user ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4 }}
          >
            <Dashboard user={user} onLogout={handleLogout} />
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4 }}
          >
            <Login onLogin={handleLogin} />
          </motion.div>
        )}
      </AnimatePresence>
    </ToastProvider>
  );
}

export default App;
