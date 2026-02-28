import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  LogOut, 
  MessageSquare, 
  Trash2, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  DollarSign, 
  Clock,
  BarChart3,
  TrendingUp,
  Loader2,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock3,
  MessageCircle,
  XCircle,
  ChevronDown
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { apiService } from "../services/api";

interface Message {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  deadline: string;
  description: string;
  status: "NEW" | "CONTACTED" | "IN_DISCUSSION" | "CLOSED";
  createdAt: string;
}

interface Stats {
  totalLeads: number;
  thisMonthLeads: number;
  todayLeads: number;
  typeBreakdown: { projectType: string; count: number }[];
  statusBreakdown: { status: string; count: number }[];
}

export default function AdminDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      
      if (search.trim()) {
        data = await apiService.searchMessages(search);
      } else if (filterType !== "All") {
        data = await apiService.filterMessages(filterType);
      } else {
        data = await apiService.getMessages(sortOrder);
      }

      const statsData = await apiService.getStats();
      
      setMessages(data);
      setStats(statsData);
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("Unauthorized") || err.message.includes("token")) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    } finally {
      setLoading(false);
    }
  }, [search, filterType, sortOrder, navigate]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDashboardData();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchDashboardData]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inquiry? This action cannot be undone.")) return;

    try {
      await apiService.deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      toast.success("Inquiry deleted successfully");
      
      // Refresh stats in background
      apiService.getStats().then(setStats).catch(console.error);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred while deleting");
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await apiService.updateStatus(id, newStatus);
      
      // Update local state immediately
      setMessages(prev =>
        prev.map(msg =>
          msg.id === id
            ? { ...msg, status: newStatus as any }
            : msg
        )
      );
      
      toast.success(`Status updated to ${newStatus}`);
      
      // Refresh stats in background
      apiService.getStats().then(setStats).catch(console.error);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred while updating status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20 flex items-center gap-1.5"><Clock3 size={10} /> NEW</span>;
      case "CONTACTED":
        return <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black border border-cyan-500/20 flex items-center gap-1.5"><MessageCircle size={10} /> CONTACTED</span>;
      case "IN_DISCUSSION":
        return <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-black border border-purple-500/20 flex items-center gap-1.5"><TrendingUp size={10} /> IN DISCUSSION</span>;
      case "CLOSED":
        return <span className="px-3 py-1 rounded-full bg-zinc-500/10 text-zinc-500 text-[10px] font-black border border-zinc-500/20 flex items-center gap-1.5"><CheckCircle2 size={10} /> CLOSED</span>;
      default:
        return null;
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 selection:bg-emerald-500/30">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-black">
              RK
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">Admin Portal</h1>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Lead Management System v2.1</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-white/5 hover:bg-red-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Leads", value: stats?.totalLeads, icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "This Month", value: stats?.thisMonthLeads, icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10" },
            { label: "Today", value: stats?.todayLeads, icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all"
            >
              <div>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <h2 className="text-5xl font-black tracking-tighter">{stat.value}</h2>
              </div>
              <div className={`p-5 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="w-8 h-8" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between">
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by name, email or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-zinc-900/50 border border-white/5 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-medium"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-12 pr-10 py-3.5 bg-zinc-900/50 border border-white/5 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-bold appearance-none cursor-pointer"
              >
                <option>All</option>
                <option>Website</option>
                <option>E-commerce</option>
                <option>Web App</option>
                <option>Custom Software</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
              className="flex items-center gap-2 px-6 py-3.5 bg-zinc-900/50 border border-white/5 hover:bg-zinc-800 rounded-2xl text-sm font-bold transition-all"
            >
              <ArrowUpDown className="w-4 h-4" /> {sortOrder === "newest" ? "Newest First" : "Oldest First"}
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-emerald-400" />
              <h3 className="text-2xl font-black tracking-tight">Recent Inquiries</h3>
            </div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Showing {messages.length} results</p>
          </div>

          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 rounded-[3rem] border border-dashed border-white/5 bg-zinc-900/10"
              >
                <XCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No inquiries matching your filters.</p>
              </motion.div>
            ) : (
              messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="p-10 rounded-[3rem] bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 space-y-8">
                      <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex flex-wrap items-center gap-6">
                          <div className="flex items-center gap-3 text-white font-black text-xl tracking-tight">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs">
                              {msg.fullName.charAt(0)}
                            </div>
                            {msg.fullName}
                          </div>
                          <div className="flex items-center gap-2 text-zinc-400 font-medium text-sm">
                            <Mail className="w-4 h-4 text-zinc-600" /> {msg.email}
                          </div>
                          {msg.phone && (
                            <div className="flex items-center gap-2 text-zinc-400 font-medium text-sm">
                              <Phone className="w-4 h-4 text-zinc-600" /> {msg.phone}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(msg.status)}
                          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> {new Date(msg.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-zinc-800/30 border border-white/5">
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Project Type</p>
                          <div className="flex items-center gap-3 font-bold text-sm text-zinc-200">
                            <Briefcase className="w-4 h-4 text-cyan-400" /> {msg.projectType}
                          </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-zinc-800/30 border border-white/5">
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Budget Range</p>
                          <div className="flex items-center gap-3 font-bold text-sm text-zinc-200">
                            <DollarSign className="w-4 h-4 text-emerald-400" /> {msg.budgetRange || "N/A"}
                          </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-zinc-800/30 border border-white/5">
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Timeline</p>
                          <div className="flex items-center gap-3 font-bold text-sm text-zinc-200">
                            <Clock className="w-4 h-4 text-orange-400" /> {msg.deadline || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="p-8 rounded-3xl bg-zinc-800/20 border border-white/5 relative">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Project Brief</p>
                        <p className="text-zinc-400 leading-relaxed font-medium whitespace-pre-wrap">{msg.description}</p>
                      </div>
                    </div>

                    <div className="flex lg:flex-col justify-between gap-6 lg:w-48">
                      <div className="space-y-3 w-full">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 px-1">Update Status</p>
                        <select
                          value={msg.status}
                          onChange={(e) => handleStatusUpdate(msg.id, e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-800/50 border border-white/5 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="IN_DISCUSSION">IN DISCUSSION</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="w-full p-4 rounded-2xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-5 h-5" /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
