import React, { useState, useEffect } from "react";
import Turnstile from "react-turnstile";
import { User, Lock, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ParticleBackground from "../components/Login/ParticleBackground";
import FingerprintIcon from "../components/Login/FingerprintIcon";
import { useAppContext } from "../context/AppContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function LoginPage() {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn, User, fetchProfile } = useAppContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { fp } = useAppContext();
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  useEffect(() => {
    if (loggedIn || User) {
      navigate("/profile");
    }
  }, [loggedIn, User, navigate]);

  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    const isDesktop = window.innerWidth >= 768;

    if (isDesktop) {
      // Lock scroll only on desktop
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";

      const preventTouchMove = (e) => e.preventDefault();
      document.addEventListener("touchmove", preventTouchMove, {
        passive: false,
      });

      return () => {
        document.body.style.overflow = "";
        document.body.style.height = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.documentElement.style.overflow = "";
        document.removeEventListener("touchmove", preventTouchMove);
      };
    }
  }, []);

  // Show submit button with a short delay after captcha success and animate it
  useEffect(() => {
    let t;
    if (captchaVerified) {
      // hide first to allow animation reset, then show after delay
      setShowSubmit(false);
      t = setTimeout(() => setShowSubmit(true), 700); // 700ms delay before showing
    } else {
      setShowSubmit(false);
    }
    return () => clearTimeout(t);
  }, [captchaVerified]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!captchaToken) {
      setError("Please complete the captcha");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", timestamp: Date.now() },
        credentials: "include",
        body: JSON.stringify({
          identifier: username,
          password,
          rememberMe,
          fp,
          captcha: captchaToken,
        }),
      });

      const data = await res.json();
      console.log(data);
      if (data.message === "Login successful") {
        setLoggedIn(true);

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
    <div className="flex items-center -mt-21 justify-center px-4 sm:px-6 relative  min-h-screen overflow-y-auto pt-10 pb-0 lg:pb-0">
      <ParticleBackground />
      {/* Cyberpunk grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(1, 255, 219, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(1, 255, 219, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 min-w-[85vw] sm:min-w-[70vw]  md:min-w-[60vw] lg:max-h-[80vh]   sm:overflow-y-auto">
        {/* Main Container */}
        <div className="relative">
          {/* Angled border container */}
          <div
            className="relative bg-teal-700/20 opacity-85 backdrop-blur-xl border-2 border-[#01ffdb]/50 p-1"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))",
            }}
          >
            {/* Inner content area */}
            <div
              className="bg-gray-900/50 p-8 sm:p-8 md:p-12"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))",
              }}
            >
              {/* LOG IN Header */}
              <div className="absolute top-4 left-4">
                <div
                  className="bg-[#01ffdb] text-black px-4 py-1 font-mono font-bold text-lg tracking-wider"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)",
                  }}
                >
                  LOG IN
                </div>
              </div>

              <div className="flex flex-col sm:flex-col md:flex-row items-center gap-8 md:gap-16 mt-12">
                {/* Left side - Fingerprint Scanner */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {/* Scanning frame */}
                    <div className="w-36 h-36 sm:w-48 sm:h-48 border-2 border-[#01ffdb]/70 relative bg-black/30 backdrop-blur-sm">
                      {/* Corner brackets */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#01ffdb]" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#01ffdb]" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#01ffdb]" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#01ffdb]" />

                      {/* Fingerprint Icon */}
                      <div className="absolute inset-4 flex items-center justify-center">
                        <FingerprintIcon size={140} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Form */}
                <div className="w-full sm:max-w-md">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div
                        className="bg-red-500/10 border border-red-500/50 p-3"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                        }}
                      >
                        <p className="text-center text-sm text-red-400 font-mono">
                          {error}
                        </p>
                      </div>
                    )}

                    {/* Username Field */}
                    <div className="space-y-2">
                      <div className="relative">
                        <div
                          className="bg-[#01ffdb]/20 border border-[#01ffdb]/50 backdrop-blur-sm"
                          style={{
                            clipPath:
                              "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                          }}
                        >
                          <div className="flex items-center justify-between p-3">
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="USERNAME"
                              required
                              className="bg-transparent text-[#01ffdb] font-mono text-lg placeholder:text-[#01ffdb]/60 outline-none flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="relative">
                        <div
                          className="bg-[#01ffdb]/20 border border-[#01ffdb]/50 backdrop-blur-sm"
                          style={{
                            clipPath:
                              "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                          }}
                        >
                          <div className="flex items-center justify-between p-3">
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••••••••••"
                              required
                              className="bg-transparent text-[#01ffdb] font-mono text-lg placeholder:text-[#01ffdb]/60 outline-none flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 bg-transparent border-2 border-[#01ffdb]/50 rounded-none 
                                   checked:bg-[#01ffdb] checked:border-[#01ffdb] 
                                   focus:ring-[#01ffdb]/50 focus:ring-2"
                        />
                        <label
                          htmlFor="remember-me"
                          className="ml-2 text-[#01ffdb]/70 font-mono"
                        >
                          PERSIST SESSION
                        </label>
                      </div>

                      {/* <Link to="/forget-password">
                        <div className="text-[#01ffdb] hover:text-[#01ffdb]/80 transition-colors font-mono">
                          RESET PASSKEY
                        </div>
                      </Link> */}
                      <Link to="/privacy-policy">
                        <div className="text-[#01ffdb] hover:text-[#01ffdb]/80 transition-colors font-mono">
                          PRIVACY POLICY
                        </div>
                      </Link>
                    </div>

                    <div className="flex justify-center">
                      <Turnstile
                        sitekey={import.meta.env.VITE_CF_SITE_KEY}
                        onVerify={(token) => {
                          setCaptchaToken(token);
                          setCaptchaVerified(true);
                        }}
                        onExpire={() => {
                          setCaptchaToken("");
                          setCaptchaVerified(false);
                        }}
                        theme="dark"
                        size="flexible"
                      />
                    </div>

                    {/* Submit Button - hidden until captcha success, fades in with animation */}
                    <div
                      className={`transition-all duration-700 ease-out transform ${
                        showSubmit
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-6 pointer-events-none"
                      }`}
                      style={{ willChange: "opacity, transform" }}
                    >
                      <button
                        type="submit"
                        disabled={isLoading || !captchaVerified}
                        className="cyber-button w-full py-3 px-6 sm:px-6 bg-[#01ffdb]/10 border-2 border-[#01ffdb]/50
                                 text-[#01ffdb] font-mono text-lg font-bold
                                 hover:bg-[#01ffdb]/20 hover:border-[#01ffdb]
                                 transition-all duration-300 relative
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                        }}
                      >
                        <div className="relative z-10">
                          {isLoading
                            ? "AUTHENTICATING..."
                            : "INITIALIZE SESSION"}
                        </div>

                        {/* Animated background effect */}
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#01ffdb]/10 to-transparent 
                                      transform -skew-x-12 -translate-x-full animate-pulse"
                        />
                      </button>
                    </div>

                    {/* Sign up link */}
                    <div className="text-center text-[#01ffdb]/70 font-mono">
                      NEW USER?{" "}
                      <Link to="/signup">
                        <span className="text-[#01ffdb] hover:text-[#01ffdb]/80 transition-colors font-bold">
                          CREATE ACCOUNT
                        </span>
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Glowing effect around the container */}
          <div className="absolute inset-0 bg-[#01ffdb]/5 blur-xl -z-10" />
        </div>
      </div>

      {/* Additional cyberpunk elements
      <div className="absolute top-15 right-10 text-[#01ffdb]/30 font-mono text-xs">
        <div>SYS_STATUS: ONLINE</div>
        <div>AUTH_LEVEL: PENDING</div>
        <div>CONN_STATE: SECURE</div>
      </div>

      <div className="absolute bottom-15 left-10 text-[#01ffdb]/30 font-mono text-xs">
        <div>PROTOCOL: HTTPS/2.0</div>
        <div>ENCRYPTION: AES-256</div>
        <div>NODE: PRIMARY</div>
      </div> */}
    </div>
  );
}
