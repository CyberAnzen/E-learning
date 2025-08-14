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
import Usefetch from "../../hooks/Usefetch";
import { NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";
export default function ProfileSettings() {
  const { user, setImage, image } = useAppContext();

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

  const initialFormRef = useRef({
    fullName: user?.userDetails?.name ?? "",
    regNumber: user?.regNumber ?? "",
    section: user?.userDetails?.section ?? "",
    email: user?.email ?? "",
    year: user?.userDetails?.year ?? "",
    dept: user?.userDetails?.dept ?? "",
    officialEmail: user?.officialEmail ?? "",
    gender: user?.userDetails?.gender ?? "",
  });
  useEffect(() => {
    const init = {
      fullName: user?.userDetails?.name ?? "",
      regNumber: user?.regNumber ?? "",
      section: user?.userDetails?.section ?? "",
      email: user?.email ?? "",
      year: user?.userDetails?.year ?? "",
      dept: user?.userDetails?.dept ?? "",
      officialEmail: user?.officialEmail ?? "",
      gender: user?.userDetails?.gender ?? "",
    };

    initialFormRef.current = init; // <-- set baseline
    setFormData(init);
  }, [user]);

  const isFormChanged = () => {
    // fields we want to compare
    const keys = [
      "fullName",
      "regNumber",
      "section",
      "email",
      "year",
      "dept",
      "officialEmail",
      "gender",
    ];

    return keys.some((key) => {
      const a = (formData[key] ?? "").toString().trim();
      const b = (initialFormRef.current[key] ?? "").toString().trim();
      return a !== b;
    });
  };
  const [copied, setCopied] = useState(false);
  const [password, setPassword] = useState({ current: "", next: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // status will control the button text and is managed based on loading transitions
  const [status, setStatus] = useState("idle"); // "idle" | "submitting" | "submitted"
  const timersRef = useRef([]); // holds active timeouts to clear later
  const prevLoadingRef = useRef(false); // track previous loading value for transitions

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
  const { Data, loading, retry } = Usefetch(
    "profile/update", // endpoint
    "post", // method
    null, // we pass null here because we'll send data manually
    {}, // custom headers if any
    false // auto = false
  );

  const SignupSubmit = async (data) => {
    // console.log(data); // This will be the same object as formData at the time you called it
    const Payload = {
      fullName: data.fullName,
      section: data.section,
      dept: data.dept,
      gender: data.gender,
      email: data.email,
      regNumber: data.regNumber,
      year: data.year,
    };
    console.log(Payload);
    retry({}, { data: Payload });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    // clear any existing timers before scheduling new ones
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    // loading started (transition false -> true)
    if (!prevLoadingRef.current && loading) {
      setStatus("submitting");
    }

    // loading finished (transition true -> false)
    if (prevLoadingRef.current && !loading) {
      if (Data?.success) {
        // Ensure at least a short submitting visual, then show "Submitted", then revert to idle
        const toSubmitted = setTimeout(() => {
          setStatus("submitted");
          initialFormRef.current = formData;

          const toIdle = setTimeout(() => {
            setStatus("idle");
          }, 2000); // keep "Submitted" visible for 2s

          timersRef.current.push(toIdle);
        }, 500); // wait 500ms before showing "Submitted"
        timersRef.current.push(toSubmitted);
      } else {
        // not successful (either error or no response) -> go back to idle
        setStatus("idle");
      }
    }

    prevLoadingRef.current = loading;

    // cleanup on dependency change / unmount
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, [loading, Data]);

  // map status to button text
  const buttonText = (() => {
    switch (status) {
      case "submitting":
        return "Submitting...";
      case "submitted":
        return "Submitted";
      default:
        return "Submit";
    }
  })();

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
    { name: "Dashboard", icon: <Home />, to: "/dashboard" },
    { name: "User Profile", icon: <User />, to: "/profile/profile2" },
    { name: "Team", icon: <FileText />, to: "/documents" },
    { name: "Setting", icon: <Settings />, to: "/settings" },
    { name: "Schedule", icon: <Calendar />, to: "/schedule" },
    { name: "Report", icon: <BarChart />, to: "/report" },
  ];
  const inputStyle =
    "w-full px-4 py-0 rounded-lg inset-0 h-10 rounded-full bg-gradient-to-r from-[#00bfff]/15 via-[#1e90ff]/10 to-[#00bfff]/5 border border-[#00bfff]/30 transition-all duration-300 text-white placeholder-[#00bfff]/30 outline-none focus:outline-none focus:ring-1 focus:ring-[#00bfff]";
  return (
    <>
      <div className="min-h-screen bg-[rgb(23,24,26)] text-white flex">
        {/* Sidebar */}
        <Sidebar />
        <main className="flex-1 overflow-x-hidden px-1 md:px-3 py-3 md:mt-0">
          <div className=" px-0	 min-h-screen font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side (Main Info) */}
              <div className="lg:col-span-2 space-y-6">
                {/* formData Information */}
                <form
                  onSubmit={handleSubmit}
                  className="bg-black/50 rounded-xl border text-[#00ffff]/25 p-6 space-y-4 shadow-sm"
                >
                  <h2 className="text-lg text-[#00ffff] font-semibold">
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
                          <ul className="absolute z-30 w-full mt-1 bg-[#17181A] border border-[#00ffff] rounded-md shadow-lg">
                            {["Male", "Female", "Other"].map((gender) => (
                              <li
                                key={gender}
                                onClick={() => {
                                  handleInputChange({
                                    target: { name: "gender", value: gender },
                                  });
                                  setGenderOpen(false);
                                }}
                                className="px-3 py-0 cursor-pointer hover:bg-[#00ffff] hover:text-black"
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
                          <ul className="absolute z-30 w-full mt-1 bg-[#17181A] border border-[#00ffff] rounded-md shadow-lg">
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
                                className="px-3 py-0 cursor-pointer hover:bg-[#00ffff] hover:text-black"
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
                          <ul className="absolute z-30 w-full mt-1 bg-[#17181A] border border-[#00ffff] rounded-md shadow-lg">
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
                                className="px-3 py-0 cursor-pointer hover:bg-[#00ffff] hover:text-black"
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
                      className="btn btn-neutral hover:text-[#00ffff]"
                      disabled={
                        !isFormComplete() ||
                        loading ||
                        status === "submitted" ||
                        !isFormChanged() // <-- disabled when nothing changed
                      }
                    >
                      {buttonText}
                    </button>
                  </div>
                </form>

                {/* Password Info */}
                <div className="bg-black/50	 rounded-xl border text-[#00ffff]/25 p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg text-[#00ffff] font-semibold">
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
                  <ul className="text-sm text-[#00ffff]/30 list-disc pl-5">
                    <li>At least 8 characters and up to 12 characters</li>
                    <li>At least one lowercase character</li>
                    <li>
                      Password must include at least one uppercase character
                    </li>
                  </ul>
                  <div className="text-right">
                    <button className="btn btn-neutral hover:text-[#00ffff]">
                      Save all
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side (Profile + Settings) */}
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-black/50	 rounded-xl border border-[#00ffff]/25 p-6 flex items-center space-x-4 shadow-sm">
                  <div className="avatar">
                    <div className="w-16 rounded-full">
                      <img src={image} alt="avatar" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#00ffff]">
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
                        className="text-sm cursor-pointer text-[#00ffff]/30 hover:text-[#00ffff]"
                      >
                        Change Avatar
                      </button>
                    </label>
                  </div>
                </div>

                {/* Language / Timezone */}
                <div className="bg-black/50	 rounded-xl border border-[#00ffff]/25 p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#00ffff]">
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
                    <button className="btn btn-neutral hover:text-[#00ffff]">
                      Save
                    </button>
                  </div>
                </div>

                {/* Team Accounts */}
                <div className="bg-black/50	 rounded-xl border text-[#00ffff]/25 p-6 space-y-4 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#00ffff]">
                    Team Account
                  </h2>
                  <div className="flex justify-between items-center border text-[#00ffff]/30 rounded-lg px-4 py-2">
                    <div>
                      <p className="font-medium text-white ">Slack account</p>
                      <a
                        className="text-sm text-[#00ffff]/30"
                        href="https://www.slack.com"
                      >
                        www.slack.com
                      </a>
                    </div>
                    <button className="btn btn-outline btn-sm hover:text-[#00ffff]">
                      Remove
                    </button>
                  </div>
                  <div className="flex justify-between items-center border text-[#00ffff]/30 rounded-lg px-4 py-2">
                    <div>
                      <p className="font-medium text-white">Trello account</p>
                      <a
                        className="text-sm text-[#00ffff]/30"
                        href="https://www.trello.com"
                      >
                        www.trello.com
                      </a>
                    </div>
                    <button className="btn btn-outline btn-sm hover:text-[#00ffff]">
                      Remove
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <button className="btn btn-ghost">Cancel</button>
                    <button className="btn btn-neutral hover:text-[#00ffff]">
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
