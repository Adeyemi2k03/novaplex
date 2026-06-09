import React, { useEffect, useState } from 'react';
import { X, Moon, Bell, Globe, Shield, Trash2, Save } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const getSaved = () => {
    try { return JSON.parse(localStorage.getItem('nova_settings') || '{}'); }
    catch { return {}; }
  };
  const s = getSaved();
  const [notifications, setNotifications] = useState<boolean>(s.notifications ?? true);
  const [autoplay, setAutoplay] = useState<boolean>(s.autoplay ?? true);
  const [language, setLanguage] = useState<string>(s.language ?? 'en');
  const [saved, setSaved] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [historyCleared, setHistoryCleared] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSave = () => {
    localStorage.setItem('nova_settings', JSON.stringify({ notifications, autoplay, language }));
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass border border-white/10 rounded-2xl shadow-2xl animate-scale-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-bold text-xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>SETTINGS</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer">
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center">
                <Bell size={16} className="text-[#8197a4]" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Notifications</p>
                <p className="text-[#8197a4] text-xs">Receive updates about new content</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(prev => !prev)}
              className={`w-11 h-6 rounded-full transition-all cursor-pointer relative ${notifications ? 'bg-[#00a8e1]' : 'bg-white/20'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          {/* Autoplay */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center">
                <Moon size={16} className="text-[#8197a4]" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Autoplay trailers</p>
                <p className="text-[#8197a4] text-xs">Auto-start trailers when browsing</p>
              </div>
            </div>
            <button
              onClick={() => setAutoplay(prev => !prev)}
              className={`w-11 h-6 rounded-full transition-all cursor-pointer relative ${autoplay ? 'bg-[#00a8e1]' : 'bg-white/20'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${autoplay ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center">
                <Globe size={16} className="text-[#8197a4]" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Language</p>
                <p className="text-[#8197a4] text-xs">Content display language</p>
              </div>
            </div>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer"
            >
              <option value="en" className="bg-[#0f171e]">English</option>
              <option value="fr" className="bg-[#0f171e]">French</option>
              <option value="es" className="bg-[#0f171e]">Spanish</option>
              <option value="de" className="bg-[#0f171e]">German</option>
            </select>
          </div>

          {/* Privacy */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center">
                <Shield size={16} className="text-[#8197a4]" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Privacy</p>
                <p className="text-[#8197a4] text-xs">Manage your data preferences</p>
              </div>
            </div>
            <button
              onClick={() => setShowPrivacy(prev => !prev)}
              className="text-[#00a8e1] text-xs hover:underline cursor-pointer"
            >
              {showPrivacy ? 'Hide' : 'Manage'}
            </button>
          </div>
          {showPrivacy && (
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-[#8197a4] leading-relaxed">
              NovaPlex stores your watchlist and liked movies locally. No personal data is shared with third parties. Your email is stored securely in Appwrite for authentication only.
            </div>
          )}

          {/* Clear history */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Trash2 size={16} className="text-red-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Clear watch history</p>
                <p className="text-[#8197a4] text-xs">Remove all viewing history</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('nova_liked');
                setHistoryCleared(true);
                setTimeout(() => setHistoryCleared(false), 2000);
              }}
              className="text-red-400 text-xs hover:underline cursor-pointer"
            >
              {historyCleared ? '✓ Cleared!' : 'Clear'}
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="px-6 pb-6">
          <button
            onClick={handleSave}
            className={`w-full nova-btn-primary justify-center py-3 rounded-xl transition-all ${saved ? 'bg-green-500' : ''}`}
          >
            {saved ? '✓ Saved!' : (
              <>
                <Save size={15} />
                Save Settings
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;
