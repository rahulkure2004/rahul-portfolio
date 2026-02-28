import { motion } from "motion/react";
import { Award, CheckCircle2, Trophy, Star, Medal } from "lucide-react";

const certs = [
  {
    title: "NPTEL - Database Management Systems",
    issuer: "IIT Madras",
    date: "2024",
    icon: <Trophy className="text-emerald-400" />,
  },
  {
    title: "Java Full Stack Training",
    issuer: "Udemy / Coursera",
    date: "2023",
    icon: <Star className="text-cyan-400" />,
  },
  {
    title: "LeetCode - 250+ Solved",
    issuer: "LeetCode",
    date: "Ongoing",
    icon: <Medal className="text-purple-400" />,
  },
  {
    title: "HackerRank Java Certification",
    issuer: "HackerRank",
    date: "2023",
    icon: <Award className="text-orange-400" />,
  },
];

export default function Certifications() {
  return (
    <section id="certifications" className="py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-black text-emerald-500 uppercase tracking-[0.3em] mb-6"
          >
            Achievements
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]"
          >
            HONORS & <br />
            <span className="text-zinc-700">AWARDS.</span>
          </motion.h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {certs.map((cert, idx) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-10 rounded-[3rem] bg-zinc-900/30 border border-white/5 hover:border-emerald-500/20 transition-all duration-500 flex flex-col items-center text-center"
            >
              <div className="mb-8 p-6 rounded-[2rem] bg-zinc-800/50 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 shadow-2xl">
                {cert.icon}
              </div>
              <h4 className="text-xl font-black mb-3 tracking-tight">{cert.title}</h4>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-6">{cert.issuer}</p>
              <div className="mt-auto flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                <CheckCircle2 size={12} /> Verified
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
