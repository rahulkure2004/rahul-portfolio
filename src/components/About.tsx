import { motion } from "motion/react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function About() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="about" className="py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-sm font-black text-emerald-500 uppercase tracking-[0.3em] mb-6">Discovery</h2>
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              DRIVEN BY <br />
              <span className="text-zinc-700">CURIOSITY.</span>
            </h3>
            <p className="text-xl text-zinc-400 leading-relaxed font-medium">
              I am a Computer Engineering student at Savitribai Phule Pune University, 
              learning the ropes of Full Stack development and 
              software fundamentals.
            </p>
            <p className="text-lg text-zinc-500 leading-relaxed">
              Through my internships and college projects, I've been applying what I learn 
              to build real-world applications. I am also dedicated to sharpening 
              my problem-solving skills through consistent DSA practice, always 
              striving to learn and grow with every project I undertake.
            </p>
            
            <div className="grid grid-cols-2 gap-12 pt-8" ref={ref}>
              <div className="group">
                <p className="text-5xl font-black text-white group-hover:text-emerald-400 transition-colors tracking-tighter">
                  {inView && <CountUp end={2026} separator="" />}
                </p>
                <p className="text-xs font-black text-zinc-600 uppercase tracking-widest mt-2">Graduation</p>
              </div>
              <div className="group">
                <p className="text-5xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tighter">
                  {inView && <CountUp end={2} />}+
                </p>
                <p className="text-xs font-black text-zinc-600 uppercase tracking-widest mt-2">Internships</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/5 bg-zinc-900/30 p-12 flex flex-col justify-center shadow-2xl">
              <div className="space-y-10">
                {[
                  { label: "Problem Solving", value: 90, color: "bg-emerald-500" },
                  { label: "Backend Development", value: 85, color: "bg-cyan-500" },
                  { label: "Frontend Development", value: 75, color: "bg-purple-500" },
                  { label: "Database Design", value: 80, color: "bg-orange-500" },
                ].map((skill, idx) => (
                  <div key={skill.label} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{skill.label}</span>
                      <span className="text-sm font-black text-white">{skill.value}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.value}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + (idx * 0.1), ease: "circOut" }}
                        className={`h-full ${skill.color} relative`}
                      >
                        <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 blur-[4px]" />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
