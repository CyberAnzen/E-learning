import React, { useState, useRef, useEffect } from "react";
import { Mail, KeyRound, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ParticleBackground from "../components/Login/ParticleBackground";
import KeyIcon from "../components/Login/KeyIcon";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const otpRefs = useRef([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    if (!isLongEnough) return "Password must be at least 8 characters long";
    if (!hasUpperCase)
      return "Password must contain at least one uppercase letter";
    if (!hasLowerCase)
      return "Password must contain at least one lowercase letter";
    if (!hasNumbers) return "Password must contain at least one number";
    if (!hasSpecialChar)
      return "Password must contain at least one special character";
    return "";
  };

  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const strength = calculateStrength(newPassword);
  const maxStrength = 5;

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Determine the identifier payload based on the email input
  const getIdentifierPayload = () => {
    return validateEmail(email) ? { email } : { reg_number: email };
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = getIdentifierPayload();
      const response = await fetch(`${BACKEND_URL}/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setStep("otp");
      } else {
        console.error("Failed to send reset instructions");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    const otpCombined = otpValues.join("");
    if (!/^\d{6}$/.test(otpCombined)) return;
    try {
      const identifier = getIdentifierPayload();
      const response = await fetch(`${BACKEND_URL}/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...identifier, otp: otpCombined }),
      });
      if (response.ok) {
        setStep("password");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      console.error("Password and confirm password do not match.");
      return;
    }

    try {
      const identifier = getIdentifierPayload();
      const otpString = otpValues.join("");

      const response = await fetch(`${BACKEND_URL}/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...identifier, otp: otpString, newPassword }),
      });

      if (response.ok) {
        console.log("Password reset successfully. Redirecting to login...");
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to reset password:",
          errorData.message || response.statusText
        );
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred during password reset:",
        error
      );
    }
  };

  // Update OTP values when user types in a digit or pastes multiple digits
  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (value.length > 1) {
      handleOtpPaste(e);
      return;
    }
    if (/^\d*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Move focus to next input if available and value is not empty
      if (value && index < otpValues.length - 1) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  // Handle paste events so that if an OTP is pasted, digits are spread across the boxes
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasteData)) return;
    const pasteDigits = pasteData.split("").slice(0, otpValues.length);
    const newOtpValues = [...otpValues];
    for (let i = 0; i < pasteDigits.length; i++) {
      newOtpValues[i] = pasteDigits[i];
    }
    setOtpValues(newOtpValues);

    // Focus the next empty input, if any
    const nextEmptyIndex = newOtpValues.findIndex((val) => val === "");
    if (nextEmptyIndex !== -1 && otpRefs.current[nextEmptyIndex]) {
      otpRefs.current[nextEmptyIndex].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

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
  }, [step]);

  // useEffect to auto-submit when all OTP fields are filled
  useEffect(() => {
    if (step === "otp" && otpValues.every((digit) => digit !== "")) {
      handleOtpSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpValues, step]);

  const renderOtpInputs = () => {
    return (
      <div className="flex justify-center space-x-2">
        {otpValues.map((val, index) => (
          <input
            key={index}
            type="text"
            value={val}
            onChange={(e) => handleOtpChange(e, index)}
            onPaste={handleOtpPaste}
            onKeyDown={(e) => handleOtpKeyDown(e, index)}
            ref={(el) => (otpRefs.current[index] = el)}
            className="w-[10vw] h-[13vw] sm:w-14 sm:h-16 text-center text-2xl bg-[#01ffdb]/10 border border-[#01ffdb]/30 backdrop-blur-sm text-[#01ffdb] font-mono
                     focus:outline-none focus:ring-2 focus:ring-[#01ffdb]/50 focus:border-[#01ffdb]
                     hover:border-[#01ffdb]/50 transition-all duration-300"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
            }}
            maxLength={1}
          />
        ))}
      </div>
    );
  };

  const getStepTitle = () => {
    switch (step) {
      case "email":
        return "RESET PASSWORD";
      case "otp":
        return "VERIFY CODE";
      case "password":
        return "NEW PASSWORD";
      default:
        return "RESET PASSWORD";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "email":
        return "Enter your email address or registration number and we'll send you instructions to reset your password.";
      case "otp":
        return "Enter the 6-digit verification code sent to your email.";
      case "password":
        return "Create your new password.";
      default:
        return "";
    }
  };

  return (
    <div className="flex items-center mt-[-.25rem]  justify-center px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black h-[100vh] pt-10 pb-0 lg:pb-0">
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

      <div className="relative z-10 w-full max-w-4xl">
        {/* Main Container */}
        <div className="relative">
          {/* Angled border container */}
          <div
            className="relative  bg-teal-700/20 opacity-85 backdrop-blur-xl border-2 border-[#01ffdb]/50 p-1"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))",
            }}
          >
            {/* Inner content area */}
            <div
              className="bg-gray-900/50 p-8 md:p-12"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))",
              }}
            >
              {/* Header */}
              <div className="absolute top-4 left-4">
                <div
                  className="bg-[#01ffdb] text-black px-4 py-1 font-mono font-bold text-lg tracking-wider"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)",
                  }}
                >
                  {getStepTitle()}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mt-12">
                {/* Left side - Key Scanner */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {/* Scanning frame */}
                    <div className="w-48 h-48 border-2 border-[#01ffdb]/70 relative bg-black/30 backdrop-blur-sm">
                      {/* Corner brackets */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#01ffdb]" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#01ffdb]" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#01ffdb]" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#01ffdb]" />

                      {/* Key Icon */}
                      <div className="absolute inset-4 flex items-center justify-center">
                        <KeyIcon size={140} />
                      </div>

                      {/* Status indicators */}
                      <div className="absolute -bottom-8 left-0 right-0 text-center">
                        <div className="text-[#01ffdb] font-mono text-xs animate-pulse">
                          SECURITY SCAN ACTIVE
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Form */}
                <div className="flex-1 max-w-md w-full">
                  <div className="mb-6 text-center">
                    <p className="text-[#01ffdb]/70 font-mono text-sm">
                      {getStepDescription()}
                    </p>
                  </div>

                  {step === "email" && (
                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[#01ffdb]/80 font-mono text-sm font-medium">
                          EMAIL OR REGISTRATION NUMBER
                        </label>
                        <div className="relative">
                          <div
                            className="bg-[#01ffdb]/20 border border-[#01ffdb]/50 backdrop-blur-sm"
                            style={{
                              clipPath:
                                "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                            }}
                          >
                            <div className="flex items-center p-3">
                              <Mail className="h-5 w-5 text-[#01ffdb]/60 mr-3" />
                              <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-transparent text-[#01ffdb] font-mono text-lg placeholder:text-[#01ffdb]/60 outline-none flex-1"
                                placeholder="Enter your email or reg number"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="cyber-button w-full py-3 px-6 bg-[#01ffdb]/10 border-2 border-[#01ffdb]/50
                                 text-[#01ffdb] font-mono text-lg font-bold
                                 hover:bg-[#01ffdb]/20 hover:border-[#01ffdb]
                                 transition-all duration-300 relative overflow-hidden"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                        }}
                      >
                        <div className="relative z-10">
                          SEND RESET INSTRUCTIONS
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#01ffdb]/10 to-transparent transform -skew-x-12 -translate-x-full animate-pulse" />
                      </button>
                    </form>
                  )}

                  {step === "otp" && (
                    <form onSubmit={handleOtpSubmit} className="space-y-6">
                      {renderOtpInputs()}
                    </form>
                  )}

                  {step === "password" && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[#01ffdb]/80 font-mono text-sm font-medium">
                          NEW PASSWORD
                        </label>
                        <div className="relative">
                          <div
                            className="bg-[#01ffdb]/20 border border-[#01ffdb]/50 backdrop-blur-sm"
                            style={{
                              clipPath:
                                "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                            }}
                          >
                            <div className="flex items-center p-3">
                              <KeyRound className="h-5 w-5 text-[#01ffdb]/60 mr-3" />
                              <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                                className="bg-transparent text-[#01ffdb] font-mono text-lg placeholder:text-[#01ffdb]/60 outline-none flex-1"
                                placeholder="Enter new password"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex space-x-1">
                            {Array.from({ length: maxStrength }).map(
                              (_, idx) => (
                                <div
                                  key={idx}
                                  className={`h-2 flex-1 rounded ${
                                    idx < strength
                                      ? getStrengthColor()
                                      : "bg-gray-700"
                                  }`}
                                ></div>
                              )
                            )}
                          </div>
                          <p className="text-xs text-[#01ffdb]/60 font-mono mt-1">
                            Strength:{" "}
                            {strength <= 2
                              ? "Weak"
                              : strength <= 4
                              ? "Moderate"
                              : "Strong"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#01ffdb]/80 font-mono text-sm font-medium">
                          CONFIRM NEW PASSWORD
                        </label>
                        <div className="relative">
                          <div
                            className="bg-[#01ffdb]/20 border border-[#01ffdb]/50 backdrop-blur-sm"
                            style={{
                              clipPath:
                                "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                            }}
                          >
                            <div className="flex items-center p-3">
                              <Check className="h-5 w-5 text-[#01ffdb]/60 mr-3" />
                              <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                                required
                                minLength={8}
                                className="bg-transparent text-[#01ffdb] font-mono text-lg placeholder:text-[#01ffdb]/60 outline-none flex-1"
                                placeholder="Confirm new password"
                              />
                            </div>
                          </div>
                        </div>
                        {confirmPassword && newPassword !== confirmPassword && (
                          <p className="text-xs text-red-400 font-mono">
                            Passwords do not match
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="cyber-button w-full py-3 px-6 bg-[#01ffdb]/10 border-2 border-[#01ffdb]/50
                                 text-[#01ffdb] font-mono text-lg font-bold
                                 hover:bg-[#01ffdb]/20 hover:border-[#01ffdb]
                                 transition-all duration-300 relative overflow-hidden"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                        }}
                      >
                        <div className="relative z-10">RESET PASSWORD</div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#01ffdb]/10 to-transparent transform -skew-x-12 -translate-x-full animate-pulse" />
                      </button>
                    </form>
                  )}

                  {/* Back to login link */}
                  <div className="mt-6 text-center text-[#01ffdb]/70 font-mono text-sm">
                    Remember your password?{" "}
                    <Link to="/login">
                      <span className="text-[#01ffdb] hover:text-[#01ffdb]/80 transition-colors font-bold">
                        BACK TO LOGIN
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glowing effect around the container */}
          <div className="absolute inset-0 bg-[#01ffdb]/5 blur-xl -z-10" />
        </div>
      </div>

      {/* Additional cyberpunk elements */}
      {/* <div className="absolute top-10 right-10 text-[#01ffdb]/30 font-mono text-xs">
        <div>SYS_STATUS: ONLINE</div>
        <div>SEC_LEVEL: HIGH</div>
        <div>CONN_STATE: SECURE</div>
      </div>

      <div className="absolute bottom-10 left-10 text-[#01ffdb]/30 font-mono text-xs">
        <div>PROTOCOL: HTTPS/2.0</div>
        <div>ENCRYPTION: AES-256</div>
        <div>NODE: SECURITY</div>
      </div> */}
    </div>
  );
}

export default ForgotPassword;
