import { motion } from "motion/react";
import { Github, ExternalLink, ArrowUpRight, Code2, Database, Layout, Terminal } from "lucide-react";

const projects = [
  {
    title: "Doctor Appointment Booking",
    description: "A healthcare project where patients can book appointments and doctors can manage their schedules. I focused on making it easy to use and handling data correctly.",
    tech: ["Spring Boot", "Angular", "MySQL", "JWT"],
    metrics: "Improved booking flow efficiency",
    github: "https://github.com/rahulkure2004",
    demo: "#",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    icon: <Layout className="text-emerald-400" />,
  },
  {
    title: "Payroll Management System",
    description: "A system to automate salary processing and attendance for small businesses. I worked on the calculation logic and basic reporting features.",
    tech: ["Java", "MySQL", "JDBC", "Swing"],
    metrics: "Accurate calculation logic",
    github: "https://github.com/rahulkure2004",
    demo: "#",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    icon: <Database className="text-cyan-400" />,
  },
  {
    title: "Online Book Shop",
    description: "A full-stack book store with user login, a shopping cart, and order tracking. I used MVC architecture to keep the code organized.",
    tech: ["Java EE", "Servlets", "JSP", "MySQL"],
    metrics: "Supports multiple concurrent users",
    github: "https://github.com/rahulkure2004",
    demo: "#",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80",
    icon: <Code2 className="text-purple-400" />,
  },
  {
    title: "Result Analysis System",
    description: "A tool to process student marks and generate performance reports. I focused on using efficient data structures to handle the records.",
    tech: ["Java", "File I/O", "Data Structures"],
    metrics: "Fast processing of academic records",
    github: "https://github.com/rahulkure2004",
    demo: "#",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    icon: <Terminal className="text-orange-400" />,
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-black text-emerald-500 uppercase tracking-[0.3em] mb-6"
            >
              Portfolio
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]"
            >
              CRAFTED <br />
              <span className="text-zinc-700">SOLUTIONS.</span>
            </motion.h3>
          </div>
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            href="https://github.com/rahulkure2004"
            target="_blank"
            className="group flex items-center gap-4 px-8 py-4 bg-zinc-900 border border-white/5 rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all duration-300"
          >
            View all on GitHub <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.a>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group relative rounded-[3rem] overflow-hidden bg-zinc-900/30 border border-white/5 hover:border-emerald-500/40 transition-all duration-500 hover:-translate-y-2 shadow-2xl hover:shadow-emerald-500/10"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-40 group-hover:opacity-100"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                
                <div className="absolute top-8 left-8 p-4 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-2xl group-hover:scale-110 transition-transform">
                  {project.icon}
                </div>

                {/* Animated Border Glow */}
                <div className="absolute inset-0 border-2 border-emerald-500/0 group-hover:border-emerald-500/20 transition-all duration-500 rounded-[3rem]" />
              </div>

              <div className="p-10 md:p-12 -mt-20 relative z-10">
                <div className="flex flex-wrap gap-3 mb-6">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {t}
                    </span>
                  ))}
                </div>
                
                <h4 className="text-3xl font-black mb-4 group-hover:text-emerald-400 transition-colors tracking-tight">{project.title}</h4>
                <p className="text-zinc-400 text-lg mb-8 leading-relaxed font-medium">{project.description}</p>
                
                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <a 
                      href={project.github} 
                      target="_blank" 
                      className="p-4 rounded-2xl bg-zinc-800/50 hover:bg-emerald-500 hover:text-black transition-all duration-300 shadow-xl group/btn"
                      title="GitHub Repository"
                    >
                      <Github size={20} className="group-hover/btn:scale-110 transition-transform" />
                    </a>
                    <a 
                      href={project.demo} 
                      target="_blank"
                      className="p-4 rounded-2xl bg-zinc-800/50 hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-xl group/btn"
                      title="Live Demo"
                    >
                      <ExternalLink size={20} className="group-hover/btn:scale-110 transition-transform" />
                    </a>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Impact</p>
                    <p className="text-sm font-bold text-emerald-400 italic">{project.metrics}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
