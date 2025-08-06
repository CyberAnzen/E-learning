import React, { useEffect, useRef, useState } from "react";
import {
  Home,
  User,
  FileText,
  Settings,
  Calendar,
  BarChart,
  Plus,
  X,
  Menu,
  AlignLeft,
  CircleChevronRight,
  ChevronRight,
  Copy,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
export default function ProfileSettings() {
  const { user } = useAppContext();

  const [formData, setFormData] = useState({
    fullName: user?.userDetails.name,
    regNumber: user?.regNumber,
    section: user?.userDetails.section,
    email: user?.email,
    year: user?.userDetails.year,
    dept: user?.userDetails.dept,
    officialEmail: user?.officialEmail,
    gender: user?.userDetails.gender,
  });
  useEffect(() => {
    setFormData({
      fullName: user?.userDetails?.name,
      regNumber: user?.regNumber,
      section: user?.userDetails?.section,
      email: user?.email,
      year: user?.userDetails?.year,
      dept: user?.userDetails?.dept,
      officialEmail: user?.officialEmail,
      gender: user?.userDetails?.gender,
    });
  }, [user]);

  // const [formData, setFormData] = useState({
  //   username: "",
  //   email: "",
  //   fullName: "",
  //   regNumber: "",
  //   dept: "",
  //   section: "",
  //   year: "",
  //   gender: "",
  //   mobile: "",
  //   officialEmail: "",
  //   password: "",
  //   confirmPassword: "",
  //   terms: false,
  // });
  const [image, setImage] = useState(
    "https://i.pinimg.com/736x/af/70/bb/af70bb880077591b711b83ee7717c91b.jpg"
  );
  const [copied, setCopied] = useState(false);
  const [password, setPassword] = useState({ current: "", next: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText("748589549");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // hide after 1.5s
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const fileInputRef = useRef();
  const handleImageClick = () => {
    fileInputRef.current.click(); // trigger file input click
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const SignupSubmit = async (data) => {
    console.log(formData);
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
    return true;
  };
  const [yearOpen, setYearOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  const menuItems = [
    { name: "Dashboard", icon: <Home /> },
    { name: "User Profile", icon: <User /> },
    { name: "Documents", icon: <FileText /> },
    { name: "Setting", icon: <Settings /> },
    { name: "Schedule", icon: <Calendar /> },
    { name: "Report", icon: <BarChart /> },
  ];
  const inputStyle =
    "w-full px-4 py-0 rounded-lg inset-0 h-10  rounded-full bg-gradient-to-r from-[#00ff00]/15 via-[#32cd32]/10 to-[#00ff00]/5 border border-[#00ff00]/30 transition-all duration-300 text-white border border-[#00ff00]/30 placeholder-[#00ff00]/30 outline-none focus:outline-none focus:ring-1 focus:ring-[#00ff00]";

  return (
    <>
      <div className="min-h-screen bg-[rgb(23,24,26)] text-white flex">
        {/* Sidebar */}
        <div
          className={`fixed z-30 inset-y-0 left-0 w-64 lg:w-70 bg-black/50 shadow transform transition-transform duration-300 ease-in-out md:translate-x-0 lg:m-2 border border-[#00ff00]/30 rounded-2xl ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:z-0 md:block`}
        >
          <div className="p-4 border-b border-[#00ff00]/30">
            <div className="flex items-center space-x-2">
              <img
                src={image}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col gap-0.5">
                <h4 className="text-sm font-semibold text-[#00ff00]">
                  Cameron Williamson
                </h4>
                <p className="text-xs text-gray-400 flex gap-2">
                  ID: 748589549{" "}
                  <Copy
                    onClick={handleCopy}
                    className="cursor-pointer hover:text-[#00ff00]"
                    size={14}
                  />
                  {copied && (
                    <span className="absolute -top-0.1 left-113 -translate-x-60 text-xs text-black font-medium bg-[#00ff00] px-2 py-0.5 rounded shadow ">
                      Copied!
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              className="md:hidden absolute top-4 right-4 text-gray-400"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="mt-4 px-2 space-y-2 text-gray-300">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center px-4 py-2 hover:text-[#00ff00] cursor-pointer"
              >
                <div className="mr-3 ">{item.icon}</div>
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
            <div className="mt-30 px-4 ">
              <button className="w-full flex items-center justify-center border border-dashed border-gray-500 py-2 rounded text-gray-300">
                <Plus className="w-4 h-4 mr-2" />
                Add New Project
              </button>
            </div>
          </nav>
          <div className="mt-6 px-4 space-y-2 text-sm text-gray-400">
            <div>
              Web Design <span className="float-right">25%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded">
              <div className="h-2 bg-green-500 rounded w-1/4" />
            </div>
            <div>
              Design System <span className="float-right">50%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded">
              <div className="h-2 bg-yellow-500 rounded w-1/2" />
            </div>
            <div>
              Webflow Dev <span className="float-right">75%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded">
              <div className="h-2 bg-blue-500 rounded w-3/4" />
            </div>
          </div>
        </div>

        {/* Click-outside overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-1.00 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Navbar */}
        <div className="md:hidden absolute top-1 left-0 z-20 bg-black/50 rounded-2xl p-2 h-12 w-10 shadow mt-20">
          <button onClick={() => setSidebarOpen(true)}>
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        <main className="flex-1 overflow-x-hidden px-1 md:px-3 py-3 md:mt-0">
          <div className=" px-0	 min-h-screen font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side (Main Info) */}
              <div className="lg:col-span-2 space-y-6">
                {/* formData Information */}
                <form
                  onSubmit={handleSubmit}
                  className="bg-black/50 rounded-xl border border-[#00ff00]/30 p-6 space-y-4 shadow-sm"
                >
                  <h2 className="text-lg text-[#00ff00] font-semibold">
                    General Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      name="officialEmail"
                      placeholder="Official Email"
                      value={formData.officialEmail}
                      className={inputStyle}
                      disabled
                    />
                    <div>
                      <input
                        type="text"
                        name="regNumber"
                        placeholder="Registration Number"
                        value={formData.regNumber}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("regNumber")}
                        data-error={!!validationErrors.regNumber}
                        className={inputStyle}
                      />
                      {validationErrors.regNumber && (
                        <p className="text-red-400 text-xs mt-1">
                          {validationErrors.regNumber}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("fullName")}
                        data-error={!!validationErrors.fullName}
                        className={inputStyle}
                      />
                      {validationErrors.fullName && (
                        <p className="text-red-400 text-xs mt-1">
                          {validationErrors.fullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="email"
                        placeholder="Personal Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("email")}
                        data-error={!!validationErrors.email}
                        className={inputStyle}
                      />
                      {validationErrors.email && (
                        <p className="text-red-400 text-xs mt-1">
                          {validationErrors.email}
                        </p>
                      )}
                    </div>
                    <div
                      className="relative"
                      data-error={!!validationErrors.gender}
                    >
                      <button
                        type="button"
                        onClick={() => setGenderOpen(!genderOpen)}
                        className={`${inputStyle} text-left cursor-pointer`}
                      >
                        {formData.gender || "Select Gender"}
                      </button>

                      {genderOpen && (
                        <>
                          {/* Dropdown menu */}
                          <ul className="absolute z-30 w-full mt-1 bg-[#17181A] border border-[#00ff00] rounded-md shadow-lg">
                            {["Male", "Female", "Other"].map((gender) => (
                              <li
                                key={gender}
                                onClick={() => {
                                  handleInputChange({
                                    target: { name: "gender", value: gender },
                                  });
                                  setGenderOpen(false);
                                }}
                                className="px-3 py-0 cursor-pointer hover:bg-[#00ff00] hover:text-black"
                              >
                                {gender}
                              </li>
                            ))}
                          </ul>

                          {/* Click-outside backdrop */}
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setGenderOpen(false)}
                          />
                        </>
                      )}
                    </div>

                    <div
                      className="relative"
                      data-error={!!validationErrors.section}
                    >
                      <button
                        type="button"
                        onClick={() => setSectionOpen(!sectionOpen)}
                        className={`${inputStyle} text-left cursor-pointer`}
                      >
                        {formData.section || "Select Section"}
                      </button>

                      {sectionOpen && (
                        <>
                          {/* Dropdown menu */}
                          <ul className="absolute z-30 w-full mt-1 bg-[#17181A] border border-[#00ff00] rounded-md shadow-lg">
                            {[
                              "A section",
                              "B section",
                              "C section",
                              "D section",
                              "E section",
                              "F section",
                              "G section",
                            ].map((section) => (
                              <li
                                key={section}
                                onClick={() => {
                                  handleInputChange({
                                    target: { name: "section", value: section },
                                  });
                                  setSectionOpen(false);
                                }}
                                className="px-3 py-0 cursor-pointer hover:bg-[#00ff00] hover:text-black"
                              >
                                {section}
                              </li>
                            ))}
                          </ul>

                          {/* Click-outside backdrop */}
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setSectionOpen(false)}
                          />
                        </>
                      )}
                    </div>

                    <div
                      className="relative"
                      data-error={!!validationErrors.year}
                    >
                      <button
                        type="button"
                        onClick={() => setYearOpen(!yearOpen)}
                        className={`${inputStyle} text-left cursor-pointer`}
                      >
                        {formData.year || "Select Year"}
                      </button>

                      {yearOpen && (
                        <>
                          {/* Dropdown menu */}
                          <ul className="absolute z-30 w-full mt-1 bg-[#17181A] border border-[#00ff00] rounded-md shadow-lg">
                            {[
                              "First Year",
                              "Second Year",
                              "Third Year",
                              "Fourth Year",
                            ].map((year) => (
                              <li
                                key={year}
                                onClick={() => {
                                  handleInputChange({
                                    target: { name: "year", value: year },
                                  });
                                  setYearOpen(false);
                                }}
                                className="px-3 py-0 cursor-pointer hover:bg-[#00ff00] hover:text-black"
                              >
                                {year}
                              </li>
                            ))}
                          </ul>

                          {/* Click-outside backdrop */}
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setYearOpen(false)}
                          />
                        </>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        name="dept"
                        placeholder="Department"
                        value={formData.dept}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("dept")}
                        data-error={!!validationErrors.dept}
                        className={inputStyle}
                      />
                      {validationErrors.dept && (
                        <p className="text-red-400 text-xs mt-1">
                          {validationErrors.dept}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right space-x-2">
                    <button
                      type="submit"
                      className="btn btn-neutral hover:text-[#00ff00]"
                      disabled={!isFormComplete() || isLoading}
                    >
                      {isLoading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>

                {/* Password Info */}
                <div className="bg-black/50	 rounded-xl border border-[#00ff00]/30 p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg text-[#00ff00] font-semibold">
                    Password Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className={inputStyle}
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className={inputStyle}
                    />
                  </div>
                  <ul className="text-sm text-[#00ff00]/30 list-disc pl-5">
                    <li>At least 8 characters and up to 12 characters</li>
                    <li>At least one lowercase character</li>
                    <li>
                      Password must include at least one uppercase character
                    </li>
                  </ul>
                  <div className="text-right">
                    <button className="btn btn-neutral hover:text-[#00ff00]">
                      Save all
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side (Profile + Settings) */}
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-black/50	 rounded-xl border border-[#00ff00]/30 p-6 flex items-center space-x-4 shadow-sm">
                  <div className="avatar">
                    <div className="w-16 rounded-full">
                      <img src={image} alt="avatar" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#00ff00]">
                      Cameron Williamson
                    </h3>
                    <p className="text-sm text-gray-500">Lead Product Design</p>

                    <label htmlFor="">
                      <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <button
                        onClick={handleImageClick}
                        className="text-sm cursor-pointer text-[#00ff00]/30 hover:text-[#00ff00]"
                      >
                        Change Avatar
                      </button>
                    </label>
                  </div>
                </div>

                {/* Language / Timezone */}
                <div className="bg-black/50	 rounded-xl border border-[#00ff00]/30 p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#00ff00]">
                    Language | Timezone
                  </h2>
                  <select className={inputStyle}>
                    <option selected>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                  </select>
                  <select className={inputStyle}>
                    <option>GMT+07:00</option>
                    <option selected>GMT+05:30</option>
                    <option>GMT+00:00</option>
                  </select>
                  <div className="flex justify-between">
                    <button className="btn btn-ghost">Cancel</button>
                    <button className="btn btn-neutral hover:text-[#00ff00]">
                      Save
                    </button>
                  </div>
                </div>

                {/* Team Accounts */}
                <div className="bg-black/50	 rounded-xl border border-[#00ff00]/30 p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#00ff00]">
                    Team Account
                  </h2>
                  <div className="flex justify-between items-center border border-[#00ff00]/30 rounded-lg px-4 py-2">
                    <div>
                      <p className="font-medium text-white ">Slack account</p>
                      <a
                        className="text-sm text-[#00ff00]/30"
                        href="https://www.slack.com"
                      >
                        www.slack.com
                      </a>
                    </div>
                    <button className="btn btn-outline btn-sm hover:text-[#00ff00]">
                      Remove
                    </button>
                  </div>
                  <div className="flex justify-between items-center border border-[#00ff00]/30 rounded-lg px-4 py-2">
                    <div>
                      <p className="font-medium text-white">Trello account</p>
                      <a
                        className="text-sm text-[#00ff00]/30"
                        href="https://www.trello.com"
                      >
                        www.trello.com
                      </a>
                    </div>
                    <button className="btn btn-outline btn-sm hover:text-[#00ff00]">
                      Remove
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <button className="btn btn-ghost">Cancel</button>
                    <button className="btn btn-neutral hover:text-[#00ff00]">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
