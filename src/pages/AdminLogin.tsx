import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, User, Loader2, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get("content-type");

      if (res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          localStorage.setItem("adminToken", data.token);
          navigate("/admin/dashboard");
        } else {
          setError("Server returned an unexpected response format.");
        }
      } else {
        let errorMessage = "Login failed";
        try {
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            errorMessage = data.message || data.error || errorMessage;
          } else {
            const errorText = await res.text();
            errorMessage = errorText || errorMessage;
          }
        } catch (e) {
          // Ignore
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Site
        </button>

        <div className="p-8 md:p-12 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
            <p className="text-zinc-500 text-sm">Access the inquiry dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Username</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-zinc-800/50 border border-white/5 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-zinc-800/50 border border-white/5 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm font-bold text-center">{error}</p>}

            <button
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-black font-bold rounded-2xl flex items-center justify-center gap-3 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login Now"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
