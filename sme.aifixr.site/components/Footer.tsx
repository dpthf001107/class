import { Sparkles, Youtube, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const footerLinks = [
    { id: 'privacy', label: '개인정보처리방침' },
    { id: 'terms', label: '이용약관' },
    { id: 'support', label: '고객센터' },
  ];

  return (
    <footer className="py-12 bg-gradient-to-b from-[#1a2332] to-[#0D4ABB]">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-col gap-8">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl text-white" style={{ fontFamily: 'Inter Tight, Arial, sans-serif' }}>
                AIFIX 
                {/* 아톰 */}
              </span>
            </div>

            {/* Footer Links */}
            <nav className="flex items-center gap-6 flex-wrap justify-center">
              {footerLinks.map((link) => (
                <button
                  key={link.id}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                <Youtube className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                <Linkedin className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-white/70" style={{ fontSize: '14px' }}>
            © 2025 AIFIX. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
