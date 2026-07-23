import React, { useState } from 'react';
import { Shield, FileText, Info, Mail, X } from 'lucide-react';

export default function Footer() {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'about' | 'contact' | null>(null);

  return (
    <footer className="w-full bg-black/90 border-t border-cinema-ash/30 mt-16 py-8 px-4 text-center">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div>
          <h2 className="font-display text-xl tracking-wider text-accent-red">GLOBAL CINEMA HUB</h2>
          <p className="text-xs text-cinema-fog/60 mt-0.5">© {new Date().getFullYear()} Global Cinema Hub. All rights reserved.</p>
        </div>

        {/* Footer Links (AdSense Required) */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-white/70">
          <button onClick={() => setActiveModal('about')} className="hover:text-accent-red transition-colors flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> About Us
          </button>
          <button onClick={() => setActiveModal('privacy')} className="hover:text-accent-red transition-colors flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Privacy Policy
          </button>
          <button onClick={() => setActiveModal('terms')} className="hover:text-accent-red transition-colors flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Terms & Conditions
          </button>
          <button onClick={() => setActiveModal('contact')} className="hover:text-accent-red transition-colors flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" /> Contact Us
          </button>
        </div>
      </div>

      {/* Popups / Modals for Policy Pages */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto glass rounded-2xl border border-cinema-ash/50 p-6 text-left text-white/90">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 text-cinema-fog hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'privacy' && (
              <div>
                <h3 className="text-xl font-bold text-accent-red mb-3">Privacy Policy</h3>
                <p className="text-sm text-cinema-fog leading-relaxed mb-3">
                  At Global Cinema Hub, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Global Cinema Hub and how we use it.
                </p>
                <p className="text-sm text-cinema-fog leading-relaxed">
                  We use Google AdSense and third-party advertising partners to serve ads. These partners may use cookies to gather non-personally identifiable information during your visit to provide relevant advertisements.
                </p>
              </div>
            )}

            {activeModal === 'terms' && (
              <div>
                <h3 className="text-xl font-bold text-accent-red mb-3">Terms & Conditions</h3>
                <p className="text-sm text-cinema-fog leading-relaxed mb-3">
                  By accessing Global Cinema Hub, you agree to comply with our Terms of Service. All movie metadata, posters, and trailer information displayed on this platform are for informational and educational purposes only.
                </p>
                <p className="text-sm text-cinema-fog leading-relaxed">
                  Global Cinema Hub does not host or store copyrighted video content directly on its servers.
                </p>
              </div>
            )}

            {activeModal === 'about' && (
              <div>
                <h3 className="text-xl font-bold text-accent-red mb-3">About Us</h3>
                <p className="text-sm text-cinema-fog leading-relaxed">
                  Global Cinema Hub is a platform dedicated to movie enthusiasts. We bring together trending movies, official trailers, community discussions, and curated genre lists to deliver a seamless cinema discovery experience.
                </p>
              </div>
            )}

            {activeModal === 'contact' && (
              <div>
                <h3 className="text-xl font-bold text-accent-red mb-3">Contact Us</h3>
                <p className="text-sm text-cinema-fog leading-relaxed mb-2">
                  Have questions, feedback, or copyright inquiries? Feel free to reach out to our team:
                </p>
                <p className="text-sm font-mono text-accent-red">support@globalcinemahub.vercel.app</p>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
