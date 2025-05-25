import React, { useState, useRef, useEffect } from "react";
import { Mail, KeyRound, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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
      const response = await fetch(
        "http://localhost:4000/user/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
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
      const response = await fetch("http://localhost:4000/user/verify-otp", {
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

    // Optionally, validate the new password before submission.
    // const passwordError = validatePassword(newPassword);
    // if (passwordError) {
    //   console.error("Password validation error:", passwordError);
    //   return;
    // }

    if (newPassword !== confirmPassword) {
      console.error("Password and confirm password do not match.");
      return;
    }

    try {
      const identifier = getIdentifierPayload();
      const otpString = otpValues.join("");

      const response = await fetch(
        "http://localhost:4000/user/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...identifier, otp: otpString, newPassword }),
        }
      );

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
  
    // Prevent scrolling
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";
  
    // Optional: Prevent touchmove to block scrolling more robustly
    const preventTouchMove = (e) => e.preventDefault();
    document.addEventListener("touchmove", preventTouchMove, { passive: false });
  
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      document.removeEventListener("touchmove", preventTouchMove);
    };
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
            className="w-[10vw] h-[13vw]  sm:w-14 md:h-16 text-center text-2xl bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01ffdb]"
            maxLength={1}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center -mt-13 justify-center px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black h-[100vh] pt-10 pb-0 lg:pb-0 ">
      <div className="w-full max-w-md relative z-10">
        <div className="login-container  bg-black/30 backdrop-blur-xl rounded-2xl border border-[#01ffdb]/20 shadow-2xl">
          <h1 className="text-[1.4rem] md:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-5 text-center">
            Reset Password
          </h1>

          {step === "email" && (
            <>
              <div className="mb-6 text-center">
                <p className="text-white/70 text-sm">
                  Enter your email address or registration number and we'll send
                  you instructions to reset your password.
                </p>
              </div>
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm sm:text-md lg:text-md  xl:text-lg font-medium pb-3 text-[#01ffdb] block font-mono">
                    EMAIL OR REGISTRATION NUMBER{" "}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/40" />
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/5  text-sm border border-white/10 text-white rounded-lg block w-full pl-10 p-2.5 
                        focus:outline-none focus:ring-2 focus:ring-[#01ffdb]/50 focus:border-transparent"
                      placeholder="Enter your email or reg number"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="cyber-button w-full py-2.5 px-4 bg-[#01ffdb]/10 border border-[#01ffdb]/50
                  text-[#01ffdb] font-medium rounded-lg hover:bg-[#01ffdb]/20 
                  transition-all duration-300 font-mono relative overflow-hidden text-xl
                  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  SEND RESET INSTRUCTIONS
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="mb-6  text-center">
                <p className="text-white/70">
                  Enter the 6-digit verification code sent to your email.
                </p>
              </div>
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                {renderOtpInputs()}
              </form>
            </>
          )}

          {step === "password" && (
            <>
              <div className="mb-6 text-center">
                <p className="text-white/70 text-sm sm:text-lg">
                  Create your new password.
                </p>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 block">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-white/40" />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      className="bg-white/5 h-10 border text-xs sm:text-md md:text-md border-white/10 text-white rounded-lg block w-full pl-10 p-2.5 
                        focus:outline-none focus:ring-2 focus:ring-[#01ffdb]/50 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="mt-2">
                    <div className="flex space-x-1">
                      {Array.from({ length: maxStrength }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 flex-1 rounded ${
                            idx < strength ? getStrengthColor() : "bg-gray-700"
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
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
                  <label className="text-sm font-medium text-white/70 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Check className="h-5 w-5 text-white/40" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      className="bg-white/5 h-10 border text-xs sm:text-md md:text-md border-white/10 text-white rounded-lg block w-full pl-10 p-2.5 
                        focus:outline-none focus:ring-2 focus:ring-[#01ffdb]/50 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-400">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="cyber-button w-full py-2.5 px-4 bg-[#01ffdb]/10 border border-[#01ffdb]/50
                  text-[#01ffdb] font-medium rounded-lg hover:bg-[#01ffdb]/20 
                  transition-all duration-300 font-mono relative overflow-hidden
                  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  RESET PASSWORD{" "}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center text-sm  text-white/50">
            Remember your password?{" "}
            <Link to={"/login"}>
              <span className="text-[#01ffdb] pt-3.5 pl-1.5  hover:text-[#00c3ff] transition-colors">
                Back to login
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
