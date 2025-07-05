import React, { useState, useEffect, useCallback } from "react";
import { User, Lock, Mail, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";
import ParticleBackground from "../components/Login/ParticleBackground";
import UserIcon from "../components/Login/UserIcon";
import "../index.css";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    regNumber: "",
    dept: "",
    section: "",
    year: "",
    gender: "",
    mobile: "",
    officialEmail: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [confirmPasswordStatus, setConfirmPasswordStatus] = useState(null);
  const [officialEmailStatus, setOfficialEmailStatus] = useState(null);
  const [phoneStatus, setPhoneStatus] = useState(null);
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    // Prevent scrolling on body but allow it on the form container
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

  const debouncedCheckUsername = useCallback(
    debounce(async (username) => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/user/check-username?username=${username}`
        );
        setUsernameStatus({
          type: response.data.available ? "success" : "error",
          message: response.data.available
            ? "Username is available"
            : "Username is already taken",
        });
      } catch (error) {
        setUsernameStatus({
          type: "error",
          message: "Error checking username",
        });
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (touched.username) validateUsername(formData.username);
  }, [formData.username, touched.username]);

  useEffect(() => {
    if (touched.password) validatePassword(formData.password);
  }, [formData.password, touched.password]);

  useEffect(() => {
    if (touched.confirmPassword) {
      validateConfirmPassword(formData.password, formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword, touched.confirmPassword]);

  useEffect(() => {
    if (touched.officialEmail) {
      validateOfficialEmail(formData.officialEmail);
    }
  }, [formData.officialEmail, touched.officialEmail]);

  useEffect(() => {
    if (touched.mobile) validateMobileStatus(formData.mobile);
  }, [formData.mobile, touched.mobile]);

  const SignupSubmit = async (data) => {
    try {
      const numericData = {
        ...data,
        mobile: parseInt(data.mobile, 10) || 0,
        year: parseInt(data.year, 10) || 0,
      };
      const response = await axios.post(
        `${BACKEND_URL}/user/signup`,
        numericData
      );
      setTimeout(() => {
        alert("Form submitted successfully!");
        navigate("/login");
      }, 500);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form.");
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (name === "username") {
      validateUsername(value);
    }
  };

  const validateUsername = (username) => {
    if (username.trim() === "") {
      setUsernameStatus(null);
      return;
    }
    if (username.length < 3) {
      setUsernameStatus({
        type: "error",
        message: "Username must be at least 3 characters",
      });
      return;
    }
    if (username.length > 15) {
      setUsernameStatus({
        type: "error",
        message: "Username must be less than 15 characters",
      });
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setUsernameStatus({
        type: "error",
        message: "Username can only contain letters and numbers",
      });
      return;
    }
    debouncedCheckUsername(username);
  };

  const validatePassword = (password) => {
    if (password.trim() === "") {
      setPasswordStatus(null);
      return;
    }
    if (password.length < 8) {
      setPasswordStatus({
        type: "error",
        message: "Password must be at least 8 characters",
      });
      return;
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
      setPasswordStatus({ type: "success", message: "Password is strong" });
    } else {
      setPasswordStatus({
        type: "warning",
        message:
          "Password is weak (use uppercase, lowercase, numbers, and special characters)",
      });
    }
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (confirmPassword.trim() === "") {
      setConfirmPasswordStatus(null);
      return;
    }
    if (password === confirmPassword) {
      setConfirmPasswordStatus({ type: "success", message: "Passwords match" });
    } else {
      setConfirmPasswordStatus({
        type: "error",
        message: "Passwords do not match",
      });
    }
  };

  const validateOfficialEmail = (email) => {
    if (email.trim() === "") {
      setOfficialEmailStatus(null);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setOfficialEmailStatus({
        type: "success",
        message: "Valid email format",
      });
    } else {
      setOfficialEmailStatus({
        type: "error",
        message: "Invalid email format",
      });
    }
  };

  const validateMobileStatus = (mobile) => {
    if (mobile.trim() === "") {
      setPhoneStatus(null);
      return;
    }
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (indianMobileRegex.test(mobile)) {
      setPhoneStatus({ type: "success", message: "Valid mobile number" });
    } else {
      setPhoneStatus({ type: "error", message: "Invalid mobile number" });
    }
  };

  const validateMobile = (mobile) => {
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!mobile) return "Mobile number is required";
    if (!indianMobileRegex.test(mobile)) {
      return "Please enter a valid 10-digit Indian mobile number";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateRegNumber = (regNumber) => {
    if (!regNumber) return "Registration number is required";
    if (regNumber.length < 5) return "Registration number is too short";
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.regNumber)
      newErrors.regNumber = "Registration number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.officialEmail)
      newErrors.officialEmail = "Official email is required";
    if (!formData.dept) newErrors.dept = "Department is required";
    if (!formData.section) newErrors.section = "Section is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (!formData.terms)
      newErrors.terms = "You must accept the terms and conditions";

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const officialEmailError = validateEmail(formData.officialEmail);
    if (officialEmailError) newErrors.officialEmail = officialEmailError;

    const mobileError = validateMobile(formData.mobile);
    if (mobileError) newErrors.mobile = mobileError;

    const regNumberError = validateRegNumber(formData.regNumber);
    if (regNumberError) newErrors.regNumber = regNumberError;

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (validateForm()) {
      SignupSubmit(formData);
    } else {
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const isFormComplete = () => {
    const requiredFields = [
      "username",
      "email",
      "fullName",
      "regNumber",
      "dept",
      "section",
      "year",
      "gender",
      "mobile",
      "officialEmail",
      "password",
      "confirmPassword",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        return false;
      }
    }
    if (!formData.terms) {
      return false;
    }
    return true;
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black min-h-[80vh] max-h-[100vh] pt-10 pb-0 lg:pb-0">
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

      <div className="relative z-10 w-full max-w-7xl pb-10">
        {/* Main Container */}
        <div className="relative -mt-4">
          {/* Angled border container */}
          <div
            className="relative bg-teal-700/20 opacity-85  backdrop-blur-xl border-2 border-[#01ffdb]/50 p-1"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))",
            }}
          >
            {/* Inner content area */}
            <div
              className="bg-gray-900/50 max-h-[80vh] overflow-y-auto"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))",
              }}
            >
              {/* SIGN UP Header */}
              <div className="absolute top-4 left-4">
                <div
                  className="bg-[#01ffdb] text-black px-4 py-1 font-mono font-bold text-lg tracking-wider"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)",
                  }}
                >
                  SIGN UP
                </div>
              </div>

              {/* Left side - User Profile Scanner */}

              <div className="fixed top-30 left-10 z-50 flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-start">
                <div className="relative">
                  {/* Scanning frame */}
                  <div className="w-48 h-48 border-2 border-[#01ffdb]/70 relative bg-black/30 backdrop-blur-sm">
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#01ffdb]" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#01ffdb]" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#01ffdb]" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#01ffdb]" />

                    {/* User Icon */}
                    <div className="fixed inset-4 flex items-center justify-center">
                      <UserIcon size={140} />
                    </div>

                    {/* Status indicators */}
                    {/* <div className="absolute -bottom-8 left-0 right-0 text-center">
        <div className="text-[#01ffdb] font-mono text-xs animate-pulse">
          PROFILE SCAN ACTIVE
        </div>
      </div> */}
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16 mt-12 p-8 md:p-12">
                {/* Left side - User Profile Scanner */}
                <div className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-start">
                  <div className="w-48"></div>
                </div>

                {/* Right side - Form */}
                <div className="flex-1 w-full">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 sm:space-y-8"
                  >
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

                    {/* Personal Information Section */}
                    <div className="space-y-4 sm:space-y-6">
                      <h3 className="text-[#01ffdb] font-mono text-base sm:text-lg font-bold border-b border-[#01ffdb]/30 pb-2">
                        PERSONAL INFORMATION
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Username */}
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
                                  name="username"
                                  value={formData.username}
                                  onChange={handleInputChange}
                                  onBlur={() => handleBlur("username")}
                                  placeholder="USERNAME"
                                  required
                                  data-error={
                                    validationErrors.username ? "true" : "false"
                                  }
                                  className="bg-transparent text-[#01ffdb] font-mono text-lg placeholder:text-[#01ffdb]/60 outline-none flex-1"
                                />
                              </div>
                            </div>
                          </div>
                          {validationErrors.username && (
                            <p className="text-red-400 text-xs font-mono">
                              {validationErrors.username}
                            </p>
                          )}
                          {usernameStatus && (
                            <p
                              className={`text-xs font-mono ${
                                usernameStatus.type === "error"
                                  ? "text-red-400"
                                  : usernameStatus.type === "warning"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                              }`}
                            >
                              {usernameStatus.message}
                            </p>
                          )}
                        </div>

                        {/* Full Name */}
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
                                  name="fullName"
                                  value={formData.fullName}
                                  onChange={handleInputChange}
                                  onBlur={() => handleBlur("fullName")}
                                  placeholder="FULL NAME"
                                  required
                                  data-error={
                                    validationErrors.fullName ? "true" : "false"
                                  }
                                  className="bg-transparent text-[#01ffdb] font-mono text-lg placeholder:text-[#01ffdb]/60 outline-none flex-1"
                                />
                              </div>
                            </div>
                          </div>
                          {validationErrors.fullName && (
                            <p className="text-red-400 text-xs font-mono">
                              {validationErrors.fullName}
                            </p>
                          )}
                        </div>

                        {/* Email */}
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
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  onBlur={() => handleBlur("email")}
                                  placeholder="EMAIL ADDRESS"
                                  required
                                  data-error={
                                    validationErrors.email ? "true" : "false"
                                  }
                                  className="bg-transparent text-[#01ffdb] font-mono text-lg placeholder:text-[#01ffdb]/60 outline-none flex-1"
                                />
                              </div>
                            </div>
                          </div>
                          {validationErrors.email && (
                            <p className="text-red-400 text-xs font-mono">
                              {validationErrors.email}
                            </p>
                          )}
                        </div>

                        {/* Mobile Number */}
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
                                  type="number"
                                  name="mobile"
                                  value={formData.mobile}
                                  onChange={handleInputChange}
                                  onBlur={() => handleBlur("mobile")}
                                  placeholder="MOBILE NUMBER"
                                  required
                                  data-error={
                                    validationErrors.mobile ? "true" : "false"
                                  }
                                  className="bg-transparent text-[#01ffdb] font-mono text-lg placeholder:text-[#01ffdb]/60 outline-none flex-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none [-moz-appearance:textfield]"
                                />
                              </div>
                            </div>
                          </div>
                          {validationErrors.mobile && (
                            <p className="text-red-400 text-xs font-mono">
                              {validationErrors.mobile}
                            </p>
                          )}
                          {phoneStatus && (
                            <p
                              className={`text-xs font-mono ${
                                phoneStatus.type === "error"
                                  ? "text-red-400"
                                  : phoneStatus.type === "warning"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                              }`}
                            >
                              {phoneStatus.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Academic Information Section */}
                    <div className="space-y-4 sm:space-y-6">
                      <h3 className="text-[#01ffdb] font-mono text-base sm:text-lg font-bold border-b border-[#01ffdb]/30 pb-2">
                        ACADEMIC INFORMATION
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {/* Registration Number */}
                        <div className="lg:col-span-2 space-y-2">
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
                                  name="regNumber"
                                  value={formData.regNumber}
                                  onChange={handleInputChange}
                                  onBlur={() => handleBlur("regNumber")}
                                  placeholder="REGISTRATION NUMBER"
                                  required
                                  data-error={
                                    validationErrors.regNumber
                                      ? "true"
                                      : "false"
                                  }
                                  className="bg-transparent text-[#01ffdb] font-mono text-lg placeholder:text-[#01ffdb]/60 outline-none flex-1"
                                />
                              </div>
                            </div>
                          </div>
                          {validationErrors.regNumber && (
                            <p className="text-red-400 text-xs font-mono">
                              {validationErrors.regNumber}
                            </p>
                          )}
                        </div>

                        {/* Official Email */}
                        <div className="lg:col-span-2 space-y-2">
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
                                  type="email"
                                  name="officialEmail"
                                  value={formData.officialEmail}
                                  onChange={handleInputChange}
                                  onBlur={() => handleBlur("officialEmail")}
                                  placeholder="OFFICIAL EMAIL"
                                  required
                                  data-error={
                                    validationErrors.officialEmail
                                      ? "true"
                                      : "false"
                                  }
                                  className="bg-transparent text-[#01ffdb] font-mono text-lg placeholder:text-[#01ffdb]/60 outline-none flex-1"
                                />
                              </div>
                            </div>
                          </div>
                          {validationErrors.officialEmail && (
                            <p className="text-red-400 text-xs font-mono">
                              {validationErrors.officialEmail}
                            </p>
                          )}
                          {officialEmailStatus && (
                            <p
                              className={`text-xs font-mono ${
                                officialEmailStatus.type === "error"
                                  ? "text-red-400"
                                  : officialEmailStatus.type === "warning"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                              }`}
                            >
                              {officialEmailStatus.message}
                            </p>
                          )}
                        </div>

                        {/* Department */}
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
                                <select
                                  name="dept"
                                  value={formData.dept}
                                  onChange={handleInputChange}
                                  onBlur={() => handleBlur("dept")}
                                  required
                                  data-error={
                                    validationErrors.dept ? "true" : "false"
                                  }
                                  className="bg-transparent text-[#01ffdb] font-mono text-lg outline-none flex-1 appearance-none"
                                >
                                  <option
                                    value=""
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    DEPARTMENT
                                  </option>
                                  <option
                                    value="CSE"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    CSE
                                  </option>
                                  <option
                                    value="ECE"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    ECE
                                  </option>
                                  <option
                                    value="EEE"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    EEE
                                  </option>
                                  <option
                                    value="MECH"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    MECH
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          {validationErrors.dept && (
                            <p className="text-red-400 text-xs font-mono">
                              {validationErrors.dept}
                            </p>
                          )}
                        </div>

                        {/* Section */}
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
                                <select
                                  name="section"
                                  value={formData.section}
                                  onChange={handleInputChange}
                                  onBlur={() => handleBlur("section")}
                                  required
                                  data-error={
                                    validationErrors.section ? "true" : "false"
                                  }
                                  className="bg-transparent text-[#01ffdb] font-mono text-lg outline-none flex-1 appearance-none"
                                >
                                  <option
                                    value=""
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    SECTION
                                  </option>
                                  <option
                                    value="A"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    A
                                  </option>
                                  <option
                                    value="B"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    B
                                  </option>
                                  <option
                                    value="C"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    C
                                  </option>
                                  <option
                                    value="D"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    D
                                  </option>
                                  <option
                                    value="E"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    E
                                  </option>
                                  <option
                                    value="F"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    F
                                  </option>
                                  <option
                                    value="G"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    G
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          {validationErrors.section && (
                            <p className="text-red-400 text-xs font-mono">
                              {validationErrors.section}
                            </p>
                          )}
                        </div>

                        {/* Year */}
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
                                <select
                                  name="year"
                                  value={formData.year}
                                  onChange={handleInputChange}
                                  onBlur={() => handleBlur("year")}
                                  required
                                  data-error={
                                    validationErrors.year ? "true" : "false"
                                  }
                                  className="bg-transparent text-[#01ffdb] font-mono text-lg outline-none flex-1 appearance-none"
                                >
                                  <option
                                    value=""
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    YEAR
                                  </option>
                                  <option
                                    value="1"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    1ST YEAR
                                  </option>
                                  <option
                                    value="2"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    2ND YEAR
                                  </option>
                                  <option
                                    value="3"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    3RD YEAR
                                  </option>
                                  <option
                                    value="4"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    4TH YEAR
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          {validationErrors.year && (
                            <p className="text-red-400 text-xs font-mono">
                              {validationErrors.year}
                            </p>
                          )}
                        </div>

                        {/* Gender */}
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
                                <select
                                  name="gender"
                                  value={formData.gender}
                                  onChange={handleInputChange}
                                  onBlur={() => handleBlur("gender")}
                                  required
                                  data-error={
                                    validationErrors.gender ? "true" : "false"
                                  }
                                  className="bg-transparent text-[#01ffdb] font-mono text-lg outline-none flex-1 appearance-none"
                                >
                                  <option
                                    value=""
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    GENDER
                                  </option>
                                  <option
                                    value="Male"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    MALE
                                  </option>
                                  <option
                                    value="Female"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    FEMALE
                                  </option>
                                  <option
                                    value="Other"
                                    className="bg-gray-900 text-[#01ffdb]"
                                  >
                                    OTHER
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          {validationErrors.gender && (
                            <p className="text-red-400 text-xs font-mono">
                              {validationErrors.gender}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Security Section */}
                    <div className="space-y-4 sm:space-y-6">
                      <h3 className="text-[#01ffdb] font-mono text-base sm:text-lg font-bold border-b border-[#01ffdb]/30 pb-2">
                        SECURITY
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Password */}
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
                                  name="password"
                                  value={formData.password}
                                  onChange={handleInputChange}
                                  onBlur={() => handleBlur("password")}
                                  placeholder="••••••••••••••••"
                                  required
                                  data-error={
                                    validationErrors.password ? "true" : "false"
                                  }
                                  className="bg-transparent text-[#01ffdb] font-mono text-lg placeholder:text-[#01ffdb]/60 outline-none flex-1"
                                />
                              </div>
                            </div>
                          </div>
                          {validationErrors.password && (
                            <p className="text-red-400 text-xs font-mono">
                              {validationErrors.password}
                            </p>
                          )}
                          {passwordStatus && (
                            <p
                              className={`text-xs font-mono ${
                                passwordStatus.type === "error"
                                  ? "text-red-400"
                                  : passwordStatus.type === "warning"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                              }`}
                            >
                              {passwordStatus.message}
                            </p>
                          )}
                        </div>

                        {/* Confirm Password */}
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
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleInputChange}
                                  onBlur={() => handleBlur("confirmPassword")}
                                  placeholder="••••••••••••••••"
                                  required
                                  data-error={
                                    validationErrors.confirmPassword
                                      ? "true"
                                      : "false"
                                  }
                                  className="bg-transparent text-[#01ffdb] font-mono text-lg placeholder:text-[#01ffdb]/60 outline-none flex-1"
                                />
                              </div>
                            </div>
                          </div>
                          {validationErrors.confirmPassword && (
                            <p className="text-red-400 text-xs font-mono">
                              {validationErrors.confirmPassword}
                            </p>
                          )}
                          {confirmPasswordStatus && (
                            <p
                              className={`text-xs font-mono ${
                                confirmPasswordStatus.type === "error"
                                  ? "text-red-400"
                                  : confirmPasswordStatus.type === "warning"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                              }`}
                            >
                              {confirmPasswordStatus.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Terms and Submit */}
                    <div className="space-y-6">
                      {/* Terms */}
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="terms"
                          id="terms"
                          checked={formData.terms}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("terms")}
                          className="w-4 h-4 bg-transparent border-2 border-[#01ffdb]/50 rounded-none 
                                   checked:bg-[#01ffdb] checked:border-[#01ffdb] 
                                   focus:ring-[#01ffdb]/50 focus:ring-2"
                        />
                        <label
                          htmlFor="terms"
                          className="text-[#01ffdb]/70 font-mono"
                        >
                          ACCEPT TERMS AND CONDITIONS
                        </label>
                        {validationErrors.terms && (
                          <p className="text-red-400 text-xs font-mono ml-2">
                            {validationErrors.terms}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={!isFormComplete() || isLoading}
                        className="cyber-button w-full py-3 px-6 bg-[#01ffdb]/10 border-2 border-[#01ffdb]/50
                                 text-[#01ffdb] font-mono text-lg font-bold
                                 hover:bg-[#01ffdb]/20 hover:border-[#01ffdb]
                                 transition-all duration-300 relative overflow-hidden
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                        }}
                      >
                        <div className="relative z-10">
                          {isLoading ? "PROCESSING..." : "CREATE ACCOUNT"}
                        </div>

                        {/* Animated background effect */}
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#01ffdb]/10 to-transparent 
                                      transform -skew-x-12 -translate-x-full animate-pulse"
                        />
                      </button>

                      {/* Login link */}
                      <div className="text-center text-[#01ffdb]/70 font-mono">
                        ALREADY REGISTERED?{" "}
                        <Link to="/login">
                          <span className="text-[#01ffdb] hover:text-[#01ffdb]/80 transition-colors font-bold">
                            LOGIN HERE
                          </span>
                        </Link>
                      </div>
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

      {/* Additional cyberpunk elements */}
      {/* <div className="absolute top-10 right-10 text-[#01ffdb]/30 font-mono text-xs">
        <div>SYS_STATUS: ONLINE</div>
        <div>REG_MODE: ACTIVE</div>
        <div>CONN_STATE: SECURE</div>
      </div>

      <div className="absolute bottom-10 left-10 text-[#01ffdb]/30 font-mono text-xs">
        <div>PROTOCOL: HTTPS/2.0</div>
        <div>ENCRYPTION: AES-256</div>
        <div>NODE: REGISTRATION</div>
      </div> */}
    </div>
  );
}

export { Signup };
