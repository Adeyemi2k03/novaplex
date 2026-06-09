import React, { useState, useEffect } from 'react';
import { X, Check, Zap, Shield, Crown, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { SubscriptionTier } from '../types';

interface SubscriptionModalProps {
  onClose: () => void;
}

const PLANS = [
  {
    tier: 'free' as SubscriptionTier,
    name: 'Free',
    price: 0,
    icon: Star,
    color: '#8197a4',
    features: [
      'Browse movies & TV shows',
      'Watch trailers & clips',
      'Basic search',
      'Watchlist up to 10 items',
    ],
    locked: [
      'HD & 4K streaming',
      'Download for offline',
      'Ad-free experience',
      'Early access content',
    ],
  },
  {
    tier: 'basic' as SubscriptionTier,
    name: 'Basic',
    price: 4.99,
    icon: Zap,
    color: '#00a8e1',
    badge: 'Popular',
    features: [
      'Everything in Free',
      'Unlimited watchlist',
      'Ad-free experience',
      'Watch on 2 devices',
      'HD quality badge on titles',
    ],
    locked: [
      '4K Ultra HD badge',
      'Download for offline',
      'Early access content',
    ],
  },
  {
    tier: 'premium' as SubscriptionTier,
    name: 'Premium',
    price: 9.99,
    icon: Crown,
    color: '#f5c518',
    badge: 'Best Value',
    features: [
      'Everything in Basic',
      '4K quality badge on titles',
      'Download button on titles',
      'Watch on 4 devices',
      'Early access content',
      'Exclusive Nova Originals',
    ],
    locked: [],
  },
];

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {
  const { subscription, setSubscription, user } = useAuth();
  const [selected, setSelected] = useState<SubscriptionTier>(subscription);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleConfirm = async () => {
    setConfirming(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubscription(selected);
    setConfirming(false);
    setSuccess(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">

        <div className="sticky top-0 glass border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-white font-bold text-2xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>CHOOSE YOUR PLAN</h2>
            <p className="text-[#8197a4] text-sm">
              {user ? `Signed in as ${user.email}` : 'Sign in to activate a plan'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check size={32} className="text-green-400" />
            </div>
            <p className="text-white font-bold text-xl">Plan activated!</p>
            <p className="text-[#8197a4] text-sm">Your {PLANS.find(p => p.tier === selected)?.name} plan is now active.</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Note about features */}
            <div className="mb-5 bg-[#00a8e1]/10 border border-[#00a8e1]/20 rounded-xl px-4 py-3 text-sm text-[#8197a4]">
              <span className="text-[#00a8e1] font-semibold">Note:</span> Streaming quality and download features are UI indicators in this demo. Subscription tiers control watchlist limits and unlock visual badges.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {PLANS.map(plan => {
                const Icon = plan.icon;
                const isSelected = selected === plan.tier;
                const isCurrent = subscription === plan.tier;

                return (
                  <button key={plan.tier} onClick={() => setSelected(plan.tier)}
                    className={`relative text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      isSelected ? 'border-[#00a8e1] bg-[#00a8e1]/10' : 'border-white/10 bg-white/3 hover:border-white/30'
                    }`}>
                    {plan.badge && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ background: plan.color }}>{plan.badge}</span>
                    )}
                    {isCurrent && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">Current</span>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${plan.color}20` }}>
                        <Icon size={20} style={{ color: plan.color }} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{plan.name}</p>
                        <p className="text-[#8197a4] text-xs">{plan.price === 0 ? 'Free forever' : `$${plan.price}/month`}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {plan.features.map(f => (
                        <div key={f} className="flex items-center gap-2">
                          <Check size={13} className="text-green-400 shrink-0" />
                          <span className="text-white text-xs">{f}</span>
                        </div>
                      ))}
                      {plan.locked.map(f => (
                        <div key={f} className="flex items-center gap-2 opacity-40">
                          <X size={13} className="text-[#8197a4] shrink-0" />
                          <span className="text-[#8197a4] text-xs line-through">{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 text-center font-bold text-lg" style={{ color: plan.color, fontFamily: 'Rajdhani, sans-serif' }}>
                      {plan.price === 0 ? 'FREE' : `$${plan.price}/mo`}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={onClose} className="nova-btn-secondary px-6 py-2.5 rounded-xl">Cancel</button>
              <button onClick={handleConfirm} disabled={confirming || selected === subscription}
                className="nova-btn-primary px-8 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                {confirming
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Shield size={16} />{selected === subscription ? 'Current Plan' : `Activate ${PLANS.find(p => p.tier === selected)?.name}`}</>
                }
              </button>
            </div>
            <p className="text-center text-[#8197a4] text-xs mt-4">🔒 Payments are simulated for demo. No real charges will be made.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionModal;
