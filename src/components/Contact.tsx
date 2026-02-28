import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { Send, Phone, Mail, MapPin, Loader2, CheckCircle2, AlertCircle, Clock, DollarSign } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional().or(z.literal("")),
  projectType: z.string().min(1, "Please select a project type"),
  budgetRange: z.string().min(1, "Please specify a budget range"),
  deadline: z.string().min(1, "Please specify a deadline"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      projectType: "Website",
      budgetRange: "$1000 - $3000",
      deadline: "1-2 Months",
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      let API_BASE = (import.meta as any).env.VITE_API_BASE_URL || "";
      if (API_BASE.endsWith("/")) API_BASE = API_BASE.slice(0, -1);

      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          }
        } catch (e) {
          // Ignore parsing errors
        }
        throw new Error(errorMessage);
      }

      if (contentType && contentType.includes("application/json")) {
        const data_res = await response.json();
        toast.success(data_res.message || "Inquiry sent! I'll get back to you within 24 hours.", {
          duration: 5000,
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          },
          icon: <CheckCircle2 className="text-emerald-500" />,
        });
        reset();
      } else {
        throw new Error("Server returned an unexpected response format (not JSON).");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again later.", {
        style: {
          background: "#18181b",
          color: "#fff",
          border: "1px solid rgba(239, 68, 68, 0.2)",
        },
        icon: <AlertCircle className="text-red-500" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-[#0a0a0a] relative overflow-hidden">
      <Toaster position="bottom-right" />
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32"
          >
            <h2 className="text-sm font-black text-emerald-500 uppercase tracking-[0.3em] mb-6">Contact</h2>
            <h3 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter leading-[0.9]">
              LET'S START <br />
              <span className="text-zinc-700">A PROJECT.</span>
            </h3>
            <p className="text-xl text-zinc-400 mb-12 leading-relaxed max-w-md font-medium">
              I'm currently available for freelance work and full-time positions. 
              Let's build something extraordinary together.
            </p>

            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "kurerahul547@gmail.com", color: "text-emerald-400" },
                { icon: Phone, label: "Phone", value: "+91 9730774081", color: "text-cyan-400" },
                { icon: MapPin, label: "Location", value: "Pune, Maharashtra, India", color: "text-purple-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-6 p-6 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all group">
                  <div className={`p-4 rounded-2xl bg-zinc-800/50 ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-lg font-bold text-zinc-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 md:p-16 rounded-[3rem] bg-zinc-900/30 border border-white/5 backdrop-blur-3xl shadow-2xl"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Full Name</label>
                  <input
                    {...register("fullName")}
                    className={`w-full px-8 py-5 bg-zinc-800/30 border ${errors.fullName ? 'border-red-500/50' : 'border-white/5'} rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all font-medium`}
                    placeholder="Rahul Kure"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs font-bold">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Email Address</label>
                  <input
                    {...register("email")}
                    className={`w-full px-8 py-5 bg-zinc-800/30 border ${errors.email ? 'border-red-500/50' : 'border-white/5'} rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all font-medium`}
                    placeholder="rahul@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs font-bold">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      {...register("phone")}
                      className={`w-full pl-14 pr-8 py-5 bg-zinc-800/30 border ${errors.phone ? 'border-red-500/50' : 'border-white/5'} rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all font-medium`}
                      placeholder="+91 0000000000"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs font-bold">{errors.phone.message}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Project Type</label>
                  <select
                    {...register("projectType")}
                    className="w-full px-8 py-5 bg-zinc-800/30 border border-white/5 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all font-medium appearance-none"
                  >
                    <option>Website</option>
                    <option>E-commerce</option>
                    <option>Web App</option>
                    <option>Custom Software</option>
                    <option>Mobile App</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Budget Range</label>
                  <div className="relative">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <select
                      {...register("budgetRange")}
                      className="w-full pl-14 pr-8 py-5 bg-zinc-800/30 border border-white/5 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all font-medium appearance-none"
                    >
                      <option>$1000 - $3000</option>
                      <option>$3000 - $5000</option>
                      <option>$5000 - $10000</option>
                      <option>$10000+</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Deadline</label>
                  <div className="relative">
                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <select
                      {...register("deadline")}
                      className="w-full pl-14 pr-8 py-5 bg-zinc-800/30 border border-white/5 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all font-medium appearance-none"
                    >
                      <option>1-2 Weeks</option>
                      <option>1 Month</option>
                      <option>1-2 Months</option>
                      <option>3+ Months</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Project Description</label>
                <textarea
                  {...register("description")}
                  rows={5}
                  className={`w-full px-8 py-5 bg-zinc-800/30 border ${errors.description ? 'border-red-500/50' : 'border-white/5'} rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all font-medium resize-none`}
                  placeholder="Describe your vision, goals, and any specific requirements..."
                />
                {errors.description && <p className="text-red-500 text-xs font-bold">{errors.description.message}</p>}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                animate={isSubmitting ? { opacity: 0.8, scale: 0.99 } : { opacity: 1, scale: 1 }}
                disabled={isSubmitting}
                type="submit"
                className="w-full py-6 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/30 text-black font-black rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 shadow-xl shadow-emerald-500/20 group relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Processing...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-4"
                    >
                      Send Message <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
