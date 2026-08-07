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
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const updateStandalone = () => setIsStandalone(mediaQuery.matches);
    updateStandalone();

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent));

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as any);
      setCanInstall(true);
    };

    const onAppInstalled = () => {
      setCanInstall(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    mediaQuery.addEventListener?.('change', updateStandalone);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
      mediaQuery.removeEventListener?.('change', updateStandalone);
    };
  }, []);

  const shouldShowInstallButton = !isStandalone;

  const handleInstall = async () => {
    if (canInstall && deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setCanInstall(false);
      }

      setDeferredPrompt(null);
      setShowInstallInstructions(false);
      return;
    }

    setShowInstallInstructions(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="relative bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
          Relatórios
        </h1>

        <div className="hidden sm:flex items-center gap-2">
          {shouldShowInstallButton && (
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

        <div className="sm:hidden relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>

          {showMenu && (
            <div className="absolute top-full right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden z-50">
              <div className="flex flex-col">
                {shouldShowInstallButton && (
                  <button
                    onClick={handleInstall}
                    className="flex items-center gap-2 w-full px-4 py-3 text-blue-700 hover:bg-blue-50 border-b border-gray-200"
                  >
                    <Download size={18} />
                    <span>Instalar app</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50"
                >
                  <LogOut size={20} />
                  <span>Sair</span>
                </button>

                {showInstallInstructions && (
                  <div className="border-t border-gray-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                    {isIos ? (
                      <p>
                        Para instalar no iPhone/iPad, toque no botão de compartilhar e escolha "Adicionar à Tela de Início".
                      </p>
                    ) : (
                      <p>
                        Use o menu do navegador e selecione "Instalar app" ou "Adicionar à tela inicial".
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </div>
      </header>
  );
}
