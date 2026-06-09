import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, ChevronDown, X, Settings, LogOut, Heart, Bookmark, HelpCircle, LogIn, Crown, Tv, Film } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Category, TVCategory, MediaTab } from '../types';

interface NavbarProps {
  searchTerm: string;
  onSearch: (v: string) => void;
  category: Category;
  onCategory: (c: Category) => void;
  tvCategory: TVCategory;
  onTVCategory: (c: TVCategory) => void;
  activeTab: MediaTab;
  onTabChange: (tab: MediaTab) => void;
  onShowWatchlist: () => void;
  onShowAuth: () => void;
  onShowSubscription: () => void;
  onShowSettings: () => void;
  onShowHelp: () => void;
  onShowLiked: () => void;
}

const MOVIE_CATS: { label: string; value: Category }[] = [
  { label: 'Popular', value: 'popular' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Now Playing', value: 'now_playing' },
  { label: 'Upcoming', value: 'upcoming' },
];

const TV_CATS: { label: string; value: TVCategory }[] = [
  { label: 'Popular', value: 'popular' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'On Air', value: 'on_the_air' },
  { label: 'Today', value: 'airing_today' },
];

const NOTIFICATIONS = [
  { id: 1, text: 'New trending: The Punisher: One Last Kill', time: '2m ago', unread: true },
  { id: 2, text: 'Top Rated list updated with new titles', time: '1h ago', unread: true },
  { id: 3, text: 'Now Playing: 12 new movies added', time: '3h ago', unread: false },
];

const Navbar: React.FC<NavbarProps> = ({
  searchTerm, onSearch, category, onCategory, tvCategory, onTVCategory,
  activeTab, onTabChange, onShowWatchlist, onShowAuth, onShowSubscription,
  onShowSettings, onShowHelp, onShowLiked,
}) => {
  const { user, logout, watchlist, subscription } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showBell, setShowBell] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setShowBell(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, unread: false })));
  const markOneRead = (id: number) => setNotifications(prev => prev.map(x => x.id === id ? { ...x, unread: false } : x));
  const handleLogout = async () => { await logout(); setShowProfile(false); setShowSignOutConfirm(false); };
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? '';
  const cats = activeTab === 'movies' ? MOVIE_CATS : TV_CATS;
  const activeCat = activeTab === 'movies' ? category : tvCategory;
  const subColor = subscription === 'premium' ? '#f5c518' : subscription === 'basic' ? '#00a8e1' : '#8197a4';
  const subLabel = subscription === 'premium' ? 'Premium' : subscription === 'basic' ? 'Basic' : 'Free';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/5 shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

          {/* LEFT */}
          <div className="flex items-center gap-3 lg:gap-5 shrink-0 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#00a8e1] flex items-center justify-center shadow-lg shadow-[#00a8e1]/30">
                <span className="text-white font-black text-sm tracking-tight">N</span>
              </div>
              <span className="text-white font-black text-lg tracking-wide shrink-0"
                style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                NOVA<span className="text-[#00a8e1]">PLEX</span>
              </span>
            </div>

            <div className="flex items-center bg-white/8 rounded-xl p-1 border border-white/10 shrink-0">
              <button onClick={() => onTabChange('movies')}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'movies' ? 'bg-[#00a8e1] text-white shadow-md' : 'text-[#8197a4] hover:text-white'
                }`}>
                <Film size={13} />
                <span className="hidden sm:inline">Movies</span>
              </button>
              <button onClick={() => onTabChange('tv')}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'tv' ? 'bg-[#00a8e1] text-white shadow-md' : 'text-[#8197a4] hover:text-white'
                }`}>
                <Tv size={13} />
                <span className="hidden sm:inline">TV Shows</span>
              </button>
            </div>

            <nav className="hidden lg:flex items-center gap-0.5">
              {cats.map(cat => (
                <button key={cat.value}
                  onClick={() => activeTab === 'movies' ? onCategory(cat.value as Category) : onTVCategory(cat.value as TVCategory)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    activeCat === cat.value ? 'text-white bg-white/10' : 'text-[#8197a4] hover:text-white hover:bg-white/5'
                  }`}>
                  {cat.label}
                </button>
              ))}
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-1 min-w-0 flex-1 sm:flex-none justify-end">

            {/* Search */}
            <div className={`flex items-center transition-all duration-300 ${showSearch ? 'flex-1 sm:flex-none sm:w-64' : 'w-9'}`}>
              {showSearch ? (
                <div className="flex items-center w-full bg-white/10 border border-white/20 rounded-xl px-2 py-1.5 gap-1.5 overflow-hidden">
                  <Search size={14} className="text-[#8197a4] shrink-0" />
                  <input autoFocus type="text" value={searchTerm}
                    onChange={e => onSearch(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent text-white text-xs sm:text-sm placeholder-[#8197a4] outline-none w-full min-w-0" />
                  <button onClick={() => { setShowSearch(false); onSearch(''); }}
                    className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer shrink-0">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowSearch(true)}
                  className="w-9 h-9 flex items-center justify-center text-[#8197a4] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5">
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Bell */}
            <div className={`relative ${showSearch ? 'hidden sm:block' : ''}`} ref={bellRef}>
              <button onClick={() => { setShowBell(v => !v); setShowProfile(false); }}
                className="w-9 h-9 flex items-center justify-center text-[#8197a4] hover:text-white transition-colors cursor-pointer relative rounded-lg hover:bg-white/5">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#00a8e1] rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showBell && (
                <div className="absolute right-0 top-12 w-80 glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <span className="text-white font-semibold text-sm">Notifications</span>
                    <button onClick={markAllRead} className="text-[#00a8e1] text-xs hover:underline cursor-pointer">Mark all read</button>
                  </div>
                  {notifications.length === 0
                    ? <div className="px-4 py-8 text-center text-[#8197a4] text-sm">No notifications</div>
                    : notifications.map(n => (
                      <div key={n.id} onClick={() => markOneRead(n.id)}
                        className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${n.unread ? 'bg-white/5' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-[#00a8e1]' : 'bg-transparent'}`} />
                          <div>
                            <p className={`text-xs leading-relaxed ${n.unread ? 'text-white font-medium' : 'text-[#8197a4]'}`}>{n.text}</p>
                            <p className="text-[#8197a4] text-xs mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className="px-4 py-3 text-center">
                    <button onClick={() => setNotifications([])} className="text-[#00a8e1] text-xs hover:underline cursor-pointer">Clear all</button>
                  </div>
                </div>
              )}
            </div>

            {/* Auth / Profile */}
            <div className={`relative ${showSearch ? 'hidden sm:block' : ''}`} ref={profileRef}>
              {!user ? (
                <button onClick={onShowAuth}
                  className="flex items-center gap-1.5 bg-[#00a8e1] hover:bg-[#00d4ff] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-[#00a8e1]/20">
                  <LogIn size={15} />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              ) : (
                <>
                  <button onClick={() => { setShowProfile(v => !v); setShowBell(false); }}
                    className="flex items-center gap-1 cursor-pointer group px-1 py-1 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#00a8e1] to-[#0077b6] flex items-center justify-center shadow-md">
                      {initials ? <span className="text-white font-bold text-xs">{initials}</span> : <User size={14} className="text-white" />}
                      {subscription !== 'free' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border border-[#0f171e]" style={{ background: subColor }}>
                          <Crown size={8} className="text-white" />
                        </div>
                      )}
                    </div>
                    <ChevronDown size={14} className={`text-[#8197a4] group-hover:text-white transition-all hidden sm:block ${showProfile ? 'rotate-180' : ''}`} />
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 top-12 w-60 glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                      <div className="px-4 py-3 border-b border-white/10 bg-white/3">
                        <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                        <p className="text-[#8197a4] text-xs truncate">{user.email}</p>
                        <button onClick={() => { onShowSubscription(); setShowProfile(false); }}
                          className="mt-2 flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                          <Crown size={11} style={{ color: subColor }} />
                          <span className="text-xs font-semibold" style={{ color: subColor }}>{subLabel} Plan</span>
                          <span className="text-[#8197a4] text-xs ml-1">· Upgrade</span>
                        </button>
                      </div>
                      <div className="py-1">
                        {[
                          { icon: Bookmark, label: 'My Watchlist', action: () => { onShowWatchlist(); setShowProfile(false); }, badge: watchlist.length > 0 ? watchlist.length : null },
                          { icon: Heart, label: 'Liked Movies', action: () => { onShowLiked(); setShowProfile(false); }, badge: null },
                          { icon: Crown, label: 'Subscription', action: () => { onShowSubscription(); setShowProfile(false); }, badge: null },
                          { icon: Settings, label: 'Settings', action: () => { onShowSettings(); setShowProfile(false); }, badge: null },
                          { icon: HelpCircle, label: 'Help & Support', action: () => { onShowHelp(); setShowProfile(false); }, badge: null },
                        ].map(({ icon: Icon, label, action, badge }) => (
                          <button key={label} onClick={action}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[#8197a4] hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-sm">
                            <Icon size={15} />{label}
                            {badge !== null && badge > 0 && (
                              <span className="ml-auto bg-[#00a8e1] text-white text-xs px-1.5 py-0.5 rounded-full">{badge}</span>
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-white/10 py-1">
                        <button
                          onClick={() => { setShowSignOutConfirm(true); setShowProfile(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-sm">
                          <LogOut size={15} />Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile category tabs */}
        <div className="lg:hidden flex gap-1.5 px-4 pb-2.5 overflow-x-auto hide-scrollbar w-full">
          {cats.map(cat => (
            <button key={cat.value}
              onClick={() => activeTab === 'movies' ? onCategory(cat.value as Category) : onTVCategory(cat.value as TVCategory)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeCat === cat.value ? 'bg-[#00a8e1] text-white shadow-md' : 'bg-white/8 text-[#8197a4] border border-white/10 hover:text-white'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* Sign Out Confirmation — renders at root level, perfectly centered */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSignOutConfirm(false)} />
          <div className="relative glass border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-scale-in">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <LogOut size={24} className="text-red-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Sign Out</p>
                <p className="text-[#8197a4] text-sm mt-1">Are you sure you want to sign out of your account?</p>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowSignOutConfirm(false)}
                  className="flex-1 prime-btn-secondary py-2.5 rounded-xl justify-center">
                  Cancel
                </button>
                <button onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-sm">
                  <LogOut size={14} />Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
