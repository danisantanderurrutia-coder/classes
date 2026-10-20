import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Admin from './Admin.jsx';
import './index.css';

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
    const encoded = pin
      .trim()
      .split('')
      .map((c) => c.charCodeAt(0))
      .join('.');
    if (encoded === '50.50.50.51') {
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
