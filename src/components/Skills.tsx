import { motion } from "motion/react";
import { Server, Layout, Database, Wrench } from "lucide-react";

const skillCategories = [
  {
    title: "Backend",
    icon: <Server className="w-8 h-8 text-emerald-400" />,
    skills: [
      { name: "Java", level: 95 },
      { name: "Spring Boot", level: 90 },
      { name: "REST APIs", level: 85 },
      { name: "Microservices", level: 80 },
    ],
  },
  {
    title: "Frontend",
    icon: <Layout className="w-8 h-8 text-cyan-400" />,
    skills: [
      { name: "Angular", level: 85 },
      { name: "React", level: 80 },
      { name: "TypeScript", level: 85 },
      { name: "Tailwind CSS", level: 90 },
    ],
  },
  {
    title: "Database",
    icon: <Database className="w-8 h-8 text-purple-400" />,
    skills: [
      { name: "MySQL", level: 90 },
      { name: "PostgreSQL", level: 85 },
      { name: "MongoDB", level: 70 },
      { name: "Oracle SQL", level: 80 },
    ],
  },
  {
    title: "Tools",
    icon: <Wrench className="w-8 h-8 text-orange-400" />,
    skills: [
      { name: "Git", level: 90 },
      { name: "Docker", level: 75 },
      { name: "Maven", level: 85 },
      { name: "Postman", level: 90 },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-32 bg-[#0f0f0f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-black text-emerald-500 uppercase tracking-[0.3em] mb-6"
          >
            Skills
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]"
          >
            TECHNICAL <br />
            <span className="text-zinc-700">STACK.</span>
          </motion.h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 md:p-12 rounded-[3rem] bg-zinc-900/30 border border-white/5 hover:border-emerald-500/20 transition-all duration-500 group"
            >
              <div className="flex items-center gap-6 mb-12">
                <div className="p-5 rounded-[2rem] bg-zinc-800/50 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  {category.icon}
                </div>
                <h4 className="text-3xl font-black tracking-tight">{category.title}</h4>
              </div>
              
              <div className="space-y-8">
                {category.skills.map((skill, sIdx) => (
                  <div key={skill.name} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-black text-zinc-400 uppercase tracking-widest">{skill.name}</span>
                      <span className="text-xs font-black text-emerald-500">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.2 + (sIdx * 0.1), ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full relative"
                      >
                        <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/20 blur-[2px]" />
                      </motion.div>
                    </div>
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
