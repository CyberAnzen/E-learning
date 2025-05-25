import React, { useState, useEffect } from "react";
import { User, Lock, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    // Prevent scrolling
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    // Optional: Prevent touchmove to block scrolling more robustly
    const preventTouchMove = (e) => e.preventDefault();
    document.addEventListener("touchmove", preventTouchMove, {
      passive: false,
    });

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      document.removeEventListener("touchmove", preventTouchMove);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:4000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ identifier: username, password, rememberMe }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/");
      } else {
        setError(data.message || "Access Denied: Authentication Failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("System Error: Connection Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center -mt-13 justify-center px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black h-[100vh] pt-10 pb-0 lg:pb-0 ">
      <div className="w-full max-w-md flex flex-col relative z-10">
        <div className="login-container bg-black/30 backdrop-blur-xl p-8 rounded-2xl border border-[#01ffdb]/20 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-[1.2rem] md:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-4 text-center">
              Login to Continue
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-center text-sm text-red-400 font-mono">
                  {error}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-medium font-mono text-[#01ffdb]">
                IDENTIFIER
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-[#01ffdb]/40" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username or email"
                  required
                  className="
                  block w-full
                  bg-black/50 border border-[#01ffdb]/20 rounded-lg
                  text-white font-mono placeholder:text-white/20
                  text-sm sm:text-base
                  pl-12 pr-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-[#01ffdb]/50 focus:border-transparent
                "
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#01ffdb] block font-mono">
                PASSKEY
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#01ffdb]/40" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                  block w-full
                  bg-black/50 border border-[#01ffdb]/20 rounded-lg
                  text-white font-mono placeholder:text-white/20
                  text-sm sm:text-base
                  pl-12 pr-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-[#01ffdb]/50 focus:border-transparent
                "
                  placeholder="Enter passkey"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 bg-black/50 border-[#01ffdb]/20 rounded 
                           focus:ring-[#01ffdb]/50 focus:ring-offset-gray-800"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-[#01ffdb]/70 font-mono"
                >
                  PERSIST SESSION
                </label>
              </div>

              <Link to="/forget-password">
                <div className="text-sm text-[#01ffdb] hover:text-[#00c3ff] transition-colors font-mono">
                  RESET PASSKEY
                </div>
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="cyber-button w-full py-2.5 px-4 bg-[#01ffdb]/10 border border-[#01ffdb]/50
                  text-[#01ffdb] font-medium rounded-lg hover:bg-[#01ffdb]/20 
                  transition-all duration-300 font-mono relative overflow-hidden text-xl
                  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "AUTHENTICATING..." : "INITIALIZE SESSION"}
            </button>

            <div className="text-center text-sm text-white/50 font-mono">
              NEW USER?{" "}
              <Link to="/signup">
                <span className="text-[#01ffdb] hover:text-[#00c3ff] transition-colors">
                  CREATE ACCOUNT
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
