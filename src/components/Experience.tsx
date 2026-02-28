import { motion } from "motion/react";
import { Briefcase, Calendar, CheckCircle2 } from "lucide-react";

const experiences = [
  {
    company: "HEAL Bharat",
    role: "Web Development Intern",
    period: "JAN 2024 - MAR 2024",
    description: "Built responsive web pages and helped integrate backend services for healthcare solutions, focusing on user data and clean code.",
    achievements: [
      "Improved frontend loading speed using lazy loading",
      "Implemented secure user authentication modules with JWT",
      "Collaborated with the team in an Agile environment"
    ]
  },
  {
    company: "Prodigy InfoTech",
    role: "Software Development Intern",
    period: "JUN 2023 - AUG 2023",
    description: "Worked on developing software modules and learning how to optimize databases for better data handling.",
    achievements: [
      "Developed an automated data migration tool for legacy systems",
      "Reduced database query latency through indexing",
      "Helped document technical specifications for 3 key software modules"
    ]
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-black text-emerald-500 uppercase tracking-[0.3em] mb-6"
          >
            Experience
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]"
          >
            PROFESSIONAL <br />
            <span className="text-zinc-700">JOURNEY.</span>
          </motion.h3>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative p-10 md:p-12 rounded-[3rem] bg-zinc-900/30 border border-white/5 hover:border-emerald-500/20 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                <div className="flex items-center gap-6">
                  <div className="p-5 rounded-[2rem] bg-zinc-800/50 text-emerald-400 group-hover:scale-110 transition-transform duration-500">
                    <Briefcase size={32} />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black tracking-tight">{exp.company}</h4>
                    <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs mt-1">{exp.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-800/30 border border-white/5 text-zinc-500 text-xs font-black tracking-widest">
                  <Calendar size={14} /> {exp.period}
                </div>
              </div>

              <p className="text-zinc-400 text-lg leading-relaxed mb-10 font-medium max-w-3xl">
                {exp.description}
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {exp.achievements.map((ach, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-zinc-800/20 border border-white/5 flex gap-4 items-start">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-1" />
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed">{ach}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
