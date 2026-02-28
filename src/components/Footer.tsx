import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 items-center">
          <div className="text-center md:text-left">
            <Link to="/" className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
              RK.
            </Link>
            <p className="text-zinc-500 text-sm mt-4 font-medium max-w-xs">
              Architecting high-performance digital systems with Java and modern web technologies.
            </p>
          </div>

          <div className="flex justify-center gap-6">
            {[
              { icon: Github, href: "https://github.com/rahulkure2004", color: "hover:text-emerald-400 hover:shadow-emerald-500/20" },
              { icon: Linkedin, href: "https://linkedin.com/in/rahul-kure/", color: "hover:text-cyan-400 hover:shadow-cyan-500/20" },
              { icon: Mail, href: "mailto:kurerahul547@gmail.com", color: "hover:text-purple-400 hover:shadow-purple-500/20" },
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                whileHover={{ y: -5, scale: 1.1 }}
                className={`p-4 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-500 transition-all duration-300 shadow-xl ${social.color}`}
              >
                <social.icon size={24} />
              </motion.a>
            ))}
          </div>

          <div className="text-center md:text-right">
            <p className="text-zinc-500 text-sm flex items-center justify-center md:justify-end gap-2 font-bold uppercase tracking-widest">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> by Rahul Kure
            </p>
            <p className="text-[10px] text-zinc-700 mt-2 uppercase tracking-[0.3em] font-black">
              © 2026 ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">
          <div className="flex gap-8">
            <Link to="/admin/login" className="hover:text-emerald-500 transition-colors">Admin Portal</Link>
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
          </div>
          <p>Built with React 19 & Node.js</p>
        </div>
      </div>
    </footer>
  );
}
