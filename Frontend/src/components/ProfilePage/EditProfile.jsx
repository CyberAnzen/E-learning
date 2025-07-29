import React, { useState, useEffect, useCallback, useRef } from "react";
import { User, Lock, Mail, Phone, UserPen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import "../../index.css";

export default function EditProfile() {
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
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const SignupSubmit = async (data) => {
    try {
      const numericData = {
        ...data,
        mobile: parseInt(data.mobile, 10) || 0,
        year: parseInt(data.year, 10) || 0,
      };
      const response = await axios.post(
        "http://localhost:4000/user/signup",
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

  const fileInputRef = useRef();
  const handleImageClick = () => {
    fileInputRef.current.click(); // trigger file input click
  };
  const [image, setImage] = useState(
    "https://i.pinimg.com/736x/af/70/bb/af70bb880077591b711b83ee7717c91b.jpg"
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
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
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.regNumber)
      newErrors.regNumber = "Registration number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.dept) newErrors.dept = "Department is required";
    if (!formData.section) newErrors.section = "Section is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.terms)
      newErrors.terms = "You must accept the terms and conditions";

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const regNumberError = validateRegNumber(formData.regNumber);
    if (regNumberError) newErrors.regNumber = regNumberError;

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
      "email",
      "fullName",
      "regNumber",
      "dept",
      "section",
      "year",
      "gender",
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
    <div className="min-h-screen bg-gradient-to-br from-black via-98% via-gray-900 to-black  flex items-center justify-center relative ">
      <div className="w-full max-w-[1400px] px-4 mt-3 mb-2">
        <div className=" pt-14 bg-transparent cyber-cart text-[#01ffdb] border-[#01ffdb]/20 rounded-xl border hover:border-[#01ffdb]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#01ffd922]">
          <div className="flex max-md:flex-col items-center justify-center gap-20 mb-2 md:mb-10 ">
            <h1
              className="text-2xl  sm:text-4xl md:text-5xl font-bold text-white motion-safe:animate-glitch "
              data-text="Sign up"
            >
              Edit Profile
            </h1>
            <div>
              <label htmlFor="">
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <img
                  src={image}
                  alt="uploadArea"
                  className="w-44 h-44 cursor-pointer rounded-full object-cover transform transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleImageClick}
                />
              </label>
            </div>
          </div>

          <form
            className="grid grid-cols-1 p-4 sm:p-7 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="col-span-full bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-center text-sm text-red-400 font-mono">
                  {error}
                </p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2 transform transition-all duration-300 hover:scale-[1.02] lg:col-span-2">
              <label className="text-sm font-medium text-teal-400 block font-mono tracking-wider">
                EMAIL
              </label>
              <div className="relative group">
                <div className="absolute left-0 pl-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-all duration-300 group-hover:text-teal-300">
                  <Mail className="h-5 w-5 text-teal-400/40" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("email")}
                  placeholder="Enter email address"
                  required
                  data-error={validationErrors.email ? "true" : "false"}
                  className="
                    block w-full
                     bg-gray-400/5 border border-[#01ffdb]/20 rounded-lg
                    text-white font-mono placeholder:text-white/20
                    text-sm sm:text-base
                    pl-12 pr-4 py-3
                    focus:outline-none focus:ring-2 focus:ring-[#01ffdb]/50 focus:border-transparent
                    transition-all duration-300
                    hover:bg-black/60 hover:border-[#01ffdb]/30
                  "
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2 transform transition-all duration-300 hover:scale-[1.02] lg:col-span-2">
              <label className="text-sm font-medium text-teal-400 block font-mono tracking-wider">
                FULL NAME
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                onBlur={() => handleBlur("fullName")}
                placeholder="Enter your full name"
                required
                data-error={validationErrors.fullName ? "true" : "false"}
                className="
                   bg-gray-400/5 border border-teal-400/30 text-white rounded-lg
                  w-full py-3 px-4
                  focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-transparent
                  font-mono placeholder:text-white/20 text-sm sm:text-base
                  transition-all duration-300
                  hover:bg-black/60 hover:border-[#01ffdb]/30
                "
              />
              {validationErrors.fullName && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.fullName}
                </p>
              )}
            </div>

            {/* Registration Number */}
            <div className="space-y-2 transform transition-all duration-300 hover:scale-[1.02] lg:col-span-2">
              <label className="text-sm font-medium text-teal-400 block font-mono tracking-wider">
                REGISTRATION NUMBER
              </label>
              <input
                type="text"
                name="regNumber"
                value={formData.regNumber}
                onChange={handleInputChange}
                onBlur={() => handleBlur("regNumber")}
                placeholder="Enter registration number"
                required
                data-error={validationErrors.regNumber ? "true" : "false"}
                className="
                   bg-gray-400/5 border border-teal-400/30 text-white rounded-lg
                  w-full py-3 px-4
                  focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-transparent
                  font-mono placeholder:text-white/20 text-sm sm:text-base
                  transition-all duration-300
                  hover:bg-black/60 hover:border-[#01ffdb]/30
                "
              />
              {validationErrors.regNumber && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.regNumber}
                </p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2 relative z-10 transform transition-all duration-300 hover:scale-[1.02] lg:col-span-1">
              <label className="text-sm font-medium text-teal-400 block font-mono tracking-wider">
                DEPARTMENT
              </label>
              <select
                name="dept"
                value={formData.dept}
                onChange={handleInputChange}
                onBlur={() => handleBlur("dept")}
                required
                data-error={validationErrors.dept ? "true" : "false"}
                className="
                   bg-gray-400/5 border border-teal-400/30 text-white rounded-lg
                  w-full py-3 px-4
                  focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-transparent
                  font-mono text-sm sm:text-base appearance-none
                  transition-all duration-300
                  hover:bg-black/60 hover:border-[#01ffdb]/30
                "
              >
                <option value="">Select Department</option>
                <option value="CSE">Computer Science</option>
                <option value="ECE">Electronics</option>
                <option value="EEE">Electrical</option>
                <option value="MECH">Mechanical</option>
              </select>
              {validationErrors.dept && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.dept}
                </p>
              )}
            </div>

            {/* Section */}
            <div className="space-y-2 relative z-10 transform transition-all duration-300 hover:scale-[1.02] lg:col-span-1">
              <label className="text-sm font-medium text-teal-400 block font-mono tracking-wider">
                SECTION
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                onBlur={() => handleBlur("section")}
                required
                data-error={validationErrors.section ? "true" : "false"}
                className="
                   bg-gray-400/5 border border-teal-400/30 text-white rounded-lg
                  w-full py-3 px-4
                  focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-transparent
                  font-mono text-sm sm:text-base appearance-none
                  transition-all duration-300
                  hover:bg-black/60 hover:border-[#01ffdb]/30
                "
              >
                <option value="">Select section</option>
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
                <option value="e">E</option>
                <option value="f">F</option>
                <option value="g">G</option>
              </select>
              {validationErrors.section && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.section}
                </p>
              )}
            </div>

            {/* Year */}
            <div className="space-y-2 relative z-10 transform transition-all duration-300 hover:scale-[1.02] lg:col-span-2">
              <label className="text-sm font-medium text-teal-400 block font-mono tracking-wider">
                YEAR
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                onBlur={() => handleBlur("year")}
                required
                data-error={validationErrors.year ? "true" : "false"}
                className="
                   bg-gray-400/5 border border-teal-400/30 text-white rounded-lg
                  w-full py-3 px-4
                  focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-transparent
                  font-mono text-sm sm:text-base appearance-none
                  transition-all duration-300
                  hover:bg-black/60 hover:border-[#01ffdb]/30
                "
              >
                <option value="">Select Year</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
              </select>
              {validationErrors.year && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.year}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2 relative z-10 transform transition-all duration-300 hover:scale-[1.02] lg:col-span-2">
              <label className="text-sm font-medium text-teal-400 block font-mono tracking-wider">
                GENDER
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                onBlur={() => handleBlur("gender")}
                required
                data-error={validationErrors.gender ? "true" : "false"}
                className="
                   bg-gray-400/5 border border-teal-400/30 text-white rounded-lg
                  w-full py-3 px-4
                  focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-transparent
                  font-mono text-sm sm:text-base appearance-none
                  transition-all duration-300
                  hover:bg-black/60 hover:border-[#01ffdb]/30
                "
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {validationErrors.gender && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.gender}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="col-span-full flex items-center transform transition-all duration-300 hover:scale-[1.02]">
              <input
                type="checkbox"
                name="terms"
                id="terms"
                checked={formData.terms}
                onChange={handleInputChange}
                onBlur={() => handleBlur("terms")}
                className="h-4 w-4  bg-gray-400/5 border-teal-400/30 rounded focus:ring-teal-400/50 focus:ring-offset-gray-800"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-teal-400/70 font-mono"
              >
                I accept the{" "}
                <Link to="/terms" className="text-teal-400 hover:text-cyan-400">
                  Terms and Conditions
                </Link>
              </label>
              {validationErrors.terms && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.terms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="col-span-full">
              <button
                type="submit"
                disabled={!isFormComplete() || isLoading}
                className="cyber-button w-full py-2.5 px-4 bg-[#01ffdb]/10 border border-[#01ffdb]/50
                  text-[#01ffdb] font-medium rounded-lg hover:bg-[#01ffdb]/20 
                  transition-all duration-300 font-mono relative overflow-hidden text-xl
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "PROCESSING..." : "SAVE"}
              </button>
            </div>

            <div className="col-span-full text-center text-sm text-white/50 font-mono">
              ANY REQUEST{" "}
              <Link to="/login">
                <span className="text-teal-400 hover:text-cyan-400 transition-colors">
                  SUPPORT
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
