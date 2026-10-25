import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Admin from './Admin.jsx';
import './index.css';
import { isAdminPin } from './adminGate';

// Helper to bust all browser caches and force a pristine load
const forceCleanReload = () => {
  try {
    if (typeof window !== 'undefined') {
      // 1. Clear any CacheStorage if supported
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
      // 2. Unregister any service workers if present
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((r) => r.unregister());
        });
      }
      // 3. Clear reload attempt counters
      sessionStorage.removeItem('ds_preload_reloads');
      
      // 4. Force cache-busting reload by appending query parameter with timestamp
      const url = new URL(window.location.href);
      url.searchParams.set('_v', Date.now().toString());
      window.location.replace(url.toString());
    }
  } catch {
    window.location.reload();
  }
};

const handleResetLocalData = () => {
  try {
    localStorage.removeItem('ds_custom_pricing_v1');
    localStorage.removeItem('ds_admin_master_checklist_v1');
    localStorage.removeItem('ds_admin_channels_v4');
    localStorage.removeItem('ds_admin_leads_v3');
    sessionStorage.removeItem('ds_preload_reloads');
  } catch {}
  forceCleanReload();
};

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
      const errorMsg = this.state.error?.message || '';
      const isChunkOrNetworkError = Boolean(
        this.state.error?.name === 'ChunkLoadError' ||
        errorMsg.includes('Failed to fetch dynamically imported module') ||
        errorMsg.includes('dynamically imported module') ||
        errorMsg.includes('Importing a module script failed') ||
        errorMsg.includes('Loading chunk') ||
        errorMsg.includes('NetworkError') ||
        errorMsg.includes('Load failed')
      );

      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-mono">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
              {isChunkOrNetworkError ? '🔄' : '⚠️'}
            </div>

            <div className="text-amber-400 text-sm font-bold uppercase tracking-wider">
              {isChunkOrNetworkError
                ? 'Actualización de Versión Publicada'
                : 'Algo no cargó correctamente'}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {isChunkOrNetworkError
                ? 'Se publicó una nueva versión de la plataforma y el navegador tenía en memoria scripts de la versión anterior. Pulsa el botón para limpiar la caché y abrir la versión fresca.'
                : 'Ocurrió un error inesperado al procesar la aplicación. Puedes recargar con caché limpia o restablecer datos locales.'}
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={forceCleanReload}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer transition-all shadow-md"
              >
                {isChunkOrNetworkError ? 'Limpiar Caché y Actualizar ↻' : 'Recargar con Caché Limpia ↻'}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    window.location.hash = '#/landing';
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-all"
                >
                  Ir al Inicio
                </button>
                <button
                  type="button"
                  onClick={handleResetLocalData}
                  title="Borra datos locales en caché si hay inconsistencia y recarga"
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 border border-slate-700/60 text-slate-400 font-bold text-xs cursor-pointer transition-all"
                >
                  Restablecer Datos
                </button>
              </div>
            </div>

            {this.state.error && (
              <details className="text-left text-[11px] text-slate-400 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800/80 mt-2">
                <summary className="cursor-pointer text-slate-400 hover:text-slate-200 select-none">
                  Detalle técnico del error
                </summary>
                <div className="mt-2 text-rose-300 break-words font-semibold">
                  {this.state.error.name || 'Error'}: {this.state.error.message}
                </div>
                {this.state.error.stack && (
                  <pre className="mt-2 text-[10px] text-slate-500 whitespace-pre-wrap overflow-x-auto max-h-36">
                    {this.state.error.stack}
                  </pre>
                )}
              </details>
            )}
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
    // Clear preload reload loop guard on successful mount
    try {
      sessionStorage.removeItem('ds_preload_reloads');
    } catch {}

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

// Auto-recover if GitHub Pages deploys a new build while the tab is open.
// Protected against infinite reload loops using a session counter.
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    try {
      const reloadCount = parseInt(sessionStorage.getItem('ds_preload_reloads') || '0', 10);
      if (reloadCount < 2) {
        sessionStorage.setItem('ds_preload_reloads', String(reloadCount + 1));
        forceCleanReload();
      } else {
        console.warn('vite:preloadError fired repeatedly; halting auto-reload to prevent loop.', event);
      }
    } catch {
      window.location.reload();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <Root />
    </RootErrorBoundary>
  </React.StrictMode>,
);
