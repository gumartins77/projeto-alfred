'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Download, LogOut, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as any);
      setCanInstall(true);
    };

    const onAppInstalled = () => {
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setCanInstall(false);
    }

    setDeferredPrompt(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
          Relatórios
        </h1>

        <div className="hidden sm:flex items-center gap-2">
          {canInstall && (
            <button
              onClick={handleInstall}
              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition text-sm font-medium"
            >
              <Download size={18} />
              <span>Instalar</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>

        <div className="sm:hidden">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        {showMenu && (
          <div className="absolute top-full right-0 bg-white border-b border-gray-200 w-full sm:hidden">
            {canInstall && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-2 w-full px-4 py-3 text-blue-700 hover:bg-blue-50 border-t border-gray-200"
              >
                <Download size={18} />
                <span>Instalar app</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 border-t border-gray-200"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
