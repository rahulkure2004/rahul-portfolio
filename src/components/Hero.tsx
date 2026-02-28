import { motion } from "motion/react";
import { ArrowRight, Download, Github, Linkedin, Terminal, Cpu, Globe, Code2 } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function Hero() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });

      if (id === "contact") {
        setTimeout(() => {
          const firstInput = document.querySelector("#contact input") as HTMLInputElement;
          if (firstInput) firstInput.focus();
        }, 800);
      }
    }
  };

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf'; 
    link.download = 'Rahul_Kure_Resume.pdf';
    // link.click();
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#0a0a0a]">
      {/* Animated Background Particles (CSS only for performance) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1, y: Math.random() * 1000 }}
            animate={{ 
              y: [null, Math.random() * -1000],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 10 + Math.random() * 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute w-1 h-1 bg-emerald-500 rounded-full"
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Floating Tech Icons */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-1/3 right-[10%] text-emerald-500/10 hidden lg:block"
      >
        <Terminal size={120} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/3 left-[5%] text-cyan-500/10 hidden lg:block"
      >
        <Cpu size={140} />
      </motion.div>
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/4 left-[15%] text-purple-500/5 hidden lg:block"
      >
        <Code2 size={80} />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available for Freelance & Full-time
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
            HI, I'M <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">RAHUL KURE</span> <br />
            <span className="text-zinc-800 dark:text-zinc-200">JAVA DEVELOPER.</span>
          </h1>

          <p className="text-xl text-zinc-400 mb-10 max-w-lg leading-relaxed font-medium">
            Computer Engineering student focused on learning and building practical web applications. 
            Exploring <span className="text-white font-bold">Java, Spring Boot</span>, and modern frontend technologies through hands-on projects.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => handleScroll('contact')}
              className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:shadow-emerald-500/40 group"
            >
              Contact Me <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => handleScroll('projects')}
              className="px-10 py-5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-black rounded-2xl transition-all duration-300"
            >
              View Projects
            </button>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex gap-4">
              <a href="https://github.com/rahulkure2004" target="_blank" className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/in/rahul-kure/" target="_blank" className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <button 
              onClick={downloadResume}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest group"
            >
              <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" /> Resume
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
          ref={ref}
        >
          <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden border border-white/10 bg-zinc-900/50 backdrop-blur-3xl p-4 group">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
              <img
                src="https://picsum.photos/seed/rahulkure/1000/1000"
                alt="Rahul Kure"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
            </div>
          </div>
          
          {/* Floating Glass Cards with Counters */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 p-6 bg-zinc-900/80 border border-white/10 rounded-3xl backdrop-blur-2xl z-20 shadow-2xl"
          >
            <p className="text-4xl font-black text-emerald-400 tracking-tighter">
              {inView && <CountUp end={250} duration={2.5} />}+
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">DSA Solved</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-10 -left-10 p-6 bg-zinc-900/80 border border-white/10 rounded-3xl backdrop-blur-2xl z-20 shadow-2xl"
          >
            <p className="text-4xl font-black text-cyan-400 tracking-tighter">
              {inView && <CountUp end={4} duration={2} />}+
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">Full Stack Apps</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
