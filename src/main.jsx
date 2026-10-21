import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Admin from './Admin.jsx';
import './index.css';
import { isAdminPin } from './adminGate';

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('RootErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-mono">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="text-amber-400 text-sm font-bold uppercase tracking-wider">
              ⚠️ Actualización de Versión Detectada
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Se publicó una nueva versión de la plataforma y el navegador tenía en caché un archivo anterior. Pulsa recargar para abrir la versión actualizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer transition-all"
              >
                Recargar Ahora ↻
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = '#/landing';
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-all"
              >
                Ir al Inicio
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const isAdminHash = () => window.location.hash.replace('#/', '').replace('#', '') === 'admin';
const isSessionUnlocked = () => {
  try {
    return sessionStorage.getItem('ds_admin_unlocked') === 'true';
  } catch {
    return false;
  }
};

function Root() {
  const [admin, setAdmin] = useState(isAdminHash());
  const [unlocked, setUnlocked] = useState(isSessionUnlocked());
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const onHash = () => {
      setAdmin(isAdminHash());
      setUnlocked(isSessionUnlocked());
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const handleBackToPublic = () => {
    window.location.hash = '#/landing';
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (isAdminPin(pin)) {
      try {
        sessionStorage.setItem('ds_admin_unlocked', 'true');
      } catch {}
      setUnlocked(true);
      setPin('');
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  if (admin && !unlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-mono">
        <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4 text-center">
            [Φ] Acceso Privado
          </div>
          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError(false);
              }}
              placeholder="••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-lg tracking-[0.4em] text-white focus:outline-none focus:border-sky-500"
            />
            {error && (
              <p className="text-[11px] text-rose-400 text-center">
                Clave incorrecta
              </p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={handleBackToPublic}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
            >
              Volver al inicio
            </button>
          </form>
        </div>
      </div>
    );
  }

  return admin ? <Admin onBack={handleBackToPublic} /> : <App />;
}

// Auto-recover if GitHub Pages deploys a new build while the tab is open
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', () => {
    window.location.reload();
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <Root />
    </RootErrorBoundary>
  </React.StrictMode>,
);
