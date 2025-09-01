import React, { useEffect, useRef, useState, useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import Usefetch from "../../hooks/Usefetch";

export default function ProfileSettings() {
  const { user } = useAppContext();

  const [formData, setFormData] = useState({
    fullName: user?.userDetails?.name || "",
    regNumber: user?.regNumber || "",
    section: user?.userDetails?.section || "",
    email: user?.email || "",
    year: user?.userDetails?.year || "",
    dept: user?.userDetails?.dept || "",
    officialEmail: user?.officialEmail || "",
    gender: user?.userDetails?.gender || "",
  });

  // refs to hold the initial snapshot so we can compare for changes
  const initialFormRef = useRef(null);
  const initialImageRef = useRef(
    "https://i.pinimg.com/736x/af/70/bb/af70bb880077591b711b83ee7717c91b.jpg"
  );

  useEffect(() => {
    const initial = {
      fullName: user?.userDetails?.name || "",
      regNumber: user?.regNumber || "",
      section: user?.userDetails?.section || "",
      email: user?.email || "",
      year: user?.userDetails?.year || "",
      dept: user?.userDetails?.dept || "",
      officialEmail: user?.officialEmail || "",
      gender: user?.userDetails?.gender || "",
    };
    setFormData(initial);

    // store initial snapshot for change detection
    initialFormRef.current = initial;

    // capture initial image too (if you want the avatar included in change detection)
    initialImageRef.current =
      "https://i.pinimg.com/736x/af/70/bb/af70bb880077591b711b83ee7717c91b.jpg";
  }, [user]);

  const [image, setImage] = useState(initialImageRef.current);
  const [password, setPassword] = useState({ current: "", next: "" });
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [yearOpen, setYearOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));

    // validate new password as user types
    if (name === "next") {
      const err = validatePassword(value);
      setValidationErrors((prev) => ({ ...prev, password: err }));
    } else if (name === "current") {
      // optional: clear current password error if present
      if (validationErrors.currentPassword) {
        setValidationErrors((prev) => ({ ...prev, currentPassword: "" }));
      }
    }
  };

  const fileInputRef = useRef();
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const { Data, loading, retry } = Usefetch(
    "profile/update",
    "post",
    null,
    {},
    false
  );

  const SignupSubmit = async (data) => {
    setIsLoading(true);
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
    try {
      await retry({}, { data: Payload });
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // run field-specific validation on blur
    switch (field) {
      case "email": {
        const err = validateEmail(formData.email);
        setValidationErrors((prev) => ({ ...prev, email: err }));
        break;
      }
      case "regNumber": {
        const err = validateRegNumber(formData.regNumber);
        setValidationErrors((prev) => ({ ...prev, regNumber: err }));
        break;
      }
      case "fullName": {
        const err = validateFullName(formData.fullName);
        setValidationErrors((prev) => ({ ...prev, fullName: err }));
        break;
      }
      case "dept": {
        const err = validateDept(formData.dept);
        setValidationErrors((prev) => ({ ...prev, dept: err }));
        break;
      }
      case "section": {
        const err = formData.section ? "" : "Section is required";
        setValidationErrors((prev) => ({ ...prev, section: err }));
        break;
      }
      case "year": {
        const err =
          formData.year && [1, 2, 3, 4].includes(Number(formData.year))
            ? ""
            : "Year is required";
        setValidationErrors((prev) => ({ ...prev, year: err }));
        break;
      }
      case "gender": {
        const err = formData.gender ? "" : "Gender is required";
        setValidationErrors((prev) => ({ ...prev, gender: err }));
        break;
      }
      default:
        break;
    }
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
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateRegNumber = (regNumber) => {
    if (!regNumber) return "Registration number is required";
    if (typeof regNumber === "string" && regNumber.trim().length < 5)
      return "Registration number is too short";
    if (!/^[A-Za-z0-9\-_.]+$/.test(regNumber))
      return "Registration number contains invalid characters";
    return "";
  };

  const validateFullName = (name) => {
    if (!name) return "Full name is required";
    if (!/^[a-zA-Z ]{3,50}$/.test(name))
      return "Full name must be 3–50 letters (letters and spaces only)";
    return "";
  };

  const validateDept = (dept) => {
    if (!dept) return "Department is required";
    if (dept.trim().length < 2) return "Department name is too short";
    return "";
  };

  const validatePassword = (pwd) => {
    if (!pwd) return "Password is required";
    if (pwd.length < 8 || pwd.length > 12)
      return "Password must be 8–12 characters";
    if (!/[a-z]/.test(pwd))
      return "Password must include at least one lowercase";
    if (!/[A-Z]/.test(pwd))
      return "Password must include at least one uppercase";
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    const fullNameErr = validateFullName(formData.fullName);
    if (fullNameErr) newErrors.fullName = fullNameErr;

    const regErr = validateRegNumber(formData.regNumber);
    if (regErr) newErrors.regNumber = regErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const deptErr = validateDept(formData.dept);
    if (deptErr) newErrors.dept = deptErr;

    if (!formData.section) newErrors.section = "Section is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.gender) newErrors.gender = "Gender is required";

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

  // helper for shallow stable compare on form fields
  const isFormEqual = (a = {}, b = {}) => {
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
    return keys.every((k) => (a[k] || "") === (b[k] || ""));
  };

  // hasChanges: true if form differs from initial snapshot OR image changed OR password fields touched
  const hasChanges = useMemo(() => {
    // if we haven't captured initial snapshot yet, consider no changes
    if (!initialFormRef.current) return false;

    const formChanged = !isFormEqual(initialFormRef.current, formData);
    const imageChanged =
      String(image || "") !== String(initialImageRef.current || "");
    const passwordChanged = Boolean(password.current || password.next);

    return formChanged || imageChanged || passwordChanged;
  }, [formData, image, password]);

  const inputStyle =
    "w-full px-4 py-0 rounded-lg inset-0 h-10 rounded-full bg-gradient-to-r from-[#00bfff]/15 via-[#1e90ff]/10 to-[#00bfff]/5 border border-[#00bfff]/30 transition-all duration-300 text-white placeholder-[#00bfff]/30 outline-none focus:outline-none focus:ring-1 focus:ring-[#00bfff]";

  return (
    <div className="px-0 min-h-screen font-sans">
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
                className={`${inputStyle} opacity-50`}
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
              <div className="relative" data-error={!!validationErrors.gender}>
                <button
                  type="button"
                  onClick={() => setGenderOpen(!genderOpen)}
                  className={`${inputStyle} text-left cursor-pointer`}
                >
                  {formData.gender || "Select Gender"}
                </button>

                {genderOpen && (
                  <>
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
                          className="px-3 py-2 cursor-pointer hover:bg-[#00ffff] hover:text-black"
                        >
                          {gender}
                        </li>
                      ))}
                    </ul>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setGenderOpen(false)}
                    />
                  </>
                )}
              </div>

              <div className="relative" data-error={!!validationErrors.section}>
                <button
                  type="button"
                  onClick={() => setSectionOpen(!sectionOpen)}
                  className={`${inputStyle} text-left cursor-pointer`}
                >
                  {formData.section || "Select Section"}
                </button>

                {sectionOpen && (
                  <>
                    <ul className="absolute z-30 w-full mt-1 bg-[#17181A] border border-[#00ffff] rounded-md shadow-lg">
                      {["A", "B", "C", "D", "E", "F", "G", "No Section"].map(
                        (section) => (
                          <li
                            key={section}
                            onClick={() => {
                              handleInputChange({
                                target: { name: "section", value: section },
                              });
                              setSectionOpen(false);
                            }}
                            className="px-3 py-2 cursor-pointer hover:bg-[#00ffff] hover:text-black"
                          >
                            {section}
                          </li>
                        )
                      )}
                    </ul>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setSectionOpen(false)}
                    />
                  </>
                )}
              </div>

              <div className="relative" data-error={!!validationErrors.year}>
                <button
                  type="button"
                  onClick={() => setYearOpen(!yearOpen)}
                  className={`${inputStyle} text-left cursor-pointer`}
                >
                  {
                    // Find the label based on numeric value, default to "Select Year"
                    [
                      { label: "First Year", value: 1 },
                      { label: "Second Year", value: 2 },
                      { label: "Third Year", value: 3 },
                      { label: "Fourth Year", value: 4 },
                    ].find((y) => y.value === formData.year)?.label ||
                      "Select Year"
                  }
                </button>

                {yearOpen && (
                  <>
                    <ul className="absolute z-30 w-full mt-1 bg-[#17181A] border border-[#00ffff] rounded-md shadow-lg">
                      {[
                        { label: "First Year", value: 1 },
                        { label: "Second Year", value: 2 },
                        { label: "Third Year", value: 3 },
                        { label: "Fourth Year", value: 4 },
                      ].map((year) => (
                        <li
                          key={year.value}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              year: year.value, // numeric value sent to backend
                            }));
                            setYearOpen(false);
                          }}
                          className="px-3 py-2 cursor-pointer hover:bg-[#00ffff] hover:text-black"
                        >
                          {year.label}
                        </li>
                      ))}
                    </ul>
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
                className="px-6 py-2 bg-gradient-to-r from-[#00bfff] to-[#1e90ff] text-white rounded-lg hover:from-[#00bfff]/90 hover:to-[#1e90ff]/90 transition-all duration-300 disabled:opacity-50"
                disabled={
                  !isFormComplete() || isLoading || loading || !hasChanges
                }
              >
                {isLoading || loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>

          {/* Password Info */}
          <div className="bg-black/50 rounded-xl border text-[#00ffff]/25 p-6 space-y-4 shadow-sm blur-xs">
            <h2 className="text-lg text-[#00ffff] font-semibold">
              Password Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="password"
                name="current"
                placeholder="Current Password"
                value={password.current}
                onChange={handlePasswordChange}
                className={inputStyle}
              />
              <input
                type="password"
                name="next"
                placeholder="New Password"
                value={password.next}
                onChange={handlePasswordChange}
                className={inputStyle}
              />
            </div>
            {validationErrors.password && (
              <p className="text-red-400 text-xs mt-1">
                {validationErrors.password}
              </p>
            )}
            <ul className="text-sm text-[#00ffff]/30 list-disc pl-5">
              <li>At least 8 characters and up to 12 characters</li>
              <li>At least one lowercase character</li>
              <li>Password must include at least one uppercase character</li>
            </ul>
            <div className="text-right">
              <button className="px-6 py-2 bg-gradient-to-r from-[#00bfff] to-[#1e90ff] text-white rounded-lg hover:from-[#00bfff]/90 hover:to-[#1e90ff]/90 transition-all duration-300">
                Save all
              </button>
            </div>
          </div>
        </div>

        {/* Right Side (Profile + Settings) */}
        {/* <div className="space-y-6 blur-xs"> */}
        {/* Profile Card */}
        {/* <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6 flex items-center space-x-4 shadow-sm">
            <div className="avatar">
              <div className="w-16 rounded-full">
                <img src={image} alt="avatar" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-[#00ffff]">
                {user?.userDetails?.name || "Cameron Williamson"}
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
          </div> */}

        {/* Language / Timezone */}
        {/* <div className="bg-black/50 rounded-xl border border-[#00ffff]/25 p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-semibold text-[#00ffff]">
              Language | Timezone
            </h2>
            <select className={inputStyle}>
              <option value="en-US">English (US)</option>
              <option value="en-UK">English (UK)</option>
              <option value="es">Spanish</option>
            </select>
            <select className={inputStyle}>
              <option value="GMT+07:00">GMT+07:00</option>
              <option value="GMT+05:30">GMT+05:30</option>
              <option value="GMT+00:00">GMT+00:00</option>
            </select>
            <div className="flex justify-between">
              <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-[#00bfff] to-[#1e90ff] text-white rounded-lg hover:from-[#00bfff]/90 hover:to-[#1e90ff]/90 transition-all duration-300">
                Save
              </button>
            </div>
          </div> */}

        {/* Team Accounts */}
        {/* <div className="bg-black/50 rounded-xl border text-[#00ffff]/25 p-6 space-y-4 shadow-sm">
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
              <button className="px-4 py-1 border border-red-500/30 text-red-400 rounded text-sm hover:border-red-500/50 hover:text-red-300 transition-colors">
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
              <button className="px-4 py-1 border border-red-500/30 text-red-400 rounded text-sm hover:border-red-500/50 hover:text-red-300 transition-colors">
                Remove
              </button>
            </div>
            <div className="flex justify-between">
              <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-[#00bfff] to-[#1e90ff] text-white rounded-lg hover:from-[#00bfff]/90 hover:to-[#1e90ff]/90 transition-all duration-300">
                Save
              </button>
            </div>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
}
