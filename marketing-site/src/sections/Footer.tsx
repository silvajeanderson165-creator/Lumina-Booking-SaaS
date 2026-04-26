import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';


const socialLinks = [
  { icon: MessageCircle, href: 'https://wa.me/5575997067931', label: 'WhatsApp' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/jeanderson-silva-9a8844386/', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/silvajeanderson165-creator', label: 'GitHub' },
  { icon: Mail, href: 'mailto:silvajeanderson165@gmail.com', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="relative py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <motion.a
              href="#"
              className="flex items-center gap-2 mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <svg className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#gradient-footer)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="url(#gradient-footer)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="url(#gradient-footer)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="gradient-footer" x1="2" y1="2" x2="22" y2="22">
                    <stop offset="0%" stopColor="#00d4ff"/>
                    <stop offset="100%" stopColor="#667eea"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-xl font-bold text-white">LUMINA</span>
            </motion.a>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Motor Analítico Financeiro de alta precisão. 
              Calcule seu LTV Real e pare o churn silencioso.
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Lumina SaaS. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-sm">
              Feito com precisão no Brasil
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-gray-500 text-sm">Sistema Operacional</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
