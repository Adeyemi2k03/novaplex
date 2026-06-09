import React, { useEffect, useState } from 'react';
import { X, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

const FAQS = [
  { q: 'How do I watch a movie?', a: 'Click on any movie poster and hit "Watch Now". This will load the official trailer or clip from YouTube.' },
  { q: 'Why can\'t I add more than 10 items to my watchlist?', a: 'Free plan users have a 10-item watchlist limit. Upgrade to Basic or Premium for unlimited watchlist.' },
  { q: 'Are the movies real full-length films?', a: 'NovaPlex plays official trailers and clips from YouTube via the TMDB API. Full movie streaming requires a content licensing deal.' },
  { q: 'How do I cancel my subscription?', a: 'Go to your profile → Subscription → Select the Free plan and confirm. No charges are made in this demo.' },
  { q: 'Why is my search not working?', a: 'Make sure you have a stable internet connection. The app uses the TMDB API to fetch results in real time.' },
  { q: 'How does the Most Searched section work?', a: 'Every time you search for a movie, it\'s tracked by Appwrite. The Most Searched strip shows the top 10 most searched movies across all users.' },
];

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass border border-white/10 rounded-2xl shadow-2xl animate-scale-in max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <h2 className="text-white font-bold text-xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>HELP & SUPPORT</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer">
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <p className="text-[#8197a4] text-sm mb-4">Frequently asked questions:</p>

          {FAQS.map((faq, i) => (
            <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors cursor-pointer">
                <span className="text-white text-sm font-medium pr-4">{faq.q}</span>
                {openFaq === i ? <ChevronUp size={16} className="text-[#00a8e1] shrink-0" /> : <ChevronDown size={16} className="text-[#8197a4] shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-3 border-t border-white/5">
                  <p className="text-[#8197a4] text-sm leading-relaxed pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-white/10 space-y-3">
            <p className="text-white text-sm font-semibold">Still need help?</p>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer">
              <Mail size={16} className="text-[#00a8e1]" />
              <div className="text-left">
                <p className="text-white text-sm font-medium">Email Support</p>
                <p className="text-[#8197a4] text-xs">support@novaplex.demo</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer">
              <MessageCircle size={16} className="text-[#00a8e1]" />
              <div className="text-left">
                <p className="text-white text-sm font-medium">Live Chat</p>
                <p className="text-[#8197a4] text-xs">Available 9am – 6pm WAT</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
