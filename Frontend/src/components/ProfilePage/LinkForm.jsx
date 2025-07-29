import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";

const LinkForm = () => {
  const [links, setLinks] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
  });
  console.log(links);

  const [errors, setErrors] = useState({
    linkedin: "",
    github: "",
  });

  const { savedLinks, setSavedLinks } = useAppContext();
  console.log(savedLinks);

  useEffect(() => {
    if (savedLinks) {
      setLinks(savedLinks); // ← PREFILL the form if links are saved
    }
  }, [savedLinks]);

  // Validation functions
  const validateLinkedIn = (url) =>
    /^https:\/\/(www\.)?linkedin\.com\/.*$/.test(url);
  const validateGitHub = (url) =>
    /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(url);
  const validateURL = (url) =>
    /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(url); // Generic for portfolio

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinks({ ...links, [name]: value });

    if (name === "linkedin") {
      setErrors((prev) => ({
        ...prev,
        linkedin:
          value.trim() === "" || validateLinkedIn(value)
            ? ""
            : "Invalid LinkedIn link",
      }));
    }

    if (name === "github") {
      setErrors((prev) => ({
        ...prev,
        github:
          value.trim() === "" || validateGitHub(value)
            ? ""
            : "Invalid GitHub link",
      }));
    }
  };
  const isValid = () => {
    const linkedinFilled = links.linkedin.trim() !== "";
    const githubFilled = links.github.trim() !== "";
    const portfolioFilled = links.portfolio.trim() !== "";

    const linkedinValid = linkedinFilled
      ? validateLinkedIn(links.linkedin)
      : true;
    const githubValid = githubFilled 
      ? validateGitHub(links.github) 
      : true;
    const portfolioValid = portfolioFilled
      ? validateURL(links.portfolio)
      : true;

    // At least one link must be filled and valid
    const atLeastOneFilled = linkedinFilled || githubFilled || portfolioFilled;

    return {/*atLeastOneFilled*/} && linkedinValid && githubValid && portfolioValid;
  };

  // Handle Save Button
  const handleSave = () => {
    const linkedinFilled = links.linkedin.trim() !== "";
    const githubFilled = links.github.trim() !== "";
    const portfolioFilled = links.portfolio.trim() !== "";

    const linkedinValid = linkedinFilled
      ? validateLinkedIn(links.linkedin)
      : true;
    const githubValid = githubFilled ? validateGitHub(links.github) : true;
    const portfolioValid = portfolioFilled
      ? validateURL(links.portfolio)
      : true;

    setErrors({
      linkedin: linkedinValid ? "" : "Invalid LinkedIn link",
      github: githubValid ? "" : "Invalid GitHub link",
    });

    if (linkedinValid && githubValid && portfolioValid) {
      setSavedLinks({ ...links });
    } else {
      alert("Please fix validation errors before saving.");
    }
  };

  return (
    <div className="p-6 rounded-lg text-white space-y-4">
      <h2 className="text-xl font-semibold text-[#01ffdb]">Links</h2>

      {/* LinkedIn */}
      <div>
        <label className="label text-sm font-medium text-white">
          <span className="flex items-center text-[#01ffdb] gap-2">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmM2VjZWMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1saW5rZWRpbi1pY29uIGx1Y2lkZS1saW5rZWRpbiI+PHBhdGggZD0iTTE2IDhhNiA2IDAgMCAxIDYgNnY3aC00di03YTIgMiAwIDAgMC0yLTIgMiAyIDAgMCAwLTIgMnY3aC00di03YTYgNiAwIDAgMSA2LTZ6Ii8+PHJlY3Qgd2lkdGg9IjQiIGhlaWdodD0iMTIiIHg9IjIiIHk9IjkiLz48Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMiIvPjwvc3ZnPg=="
              className="w-5 h-5 "
              alt="LinkedIn"
            />
            LinkedIn
          </span>
        </label>
        <input
          type="url"
          name="linkedin"
          placeholder="https://www.linkedin.com/"
          className={`input input-bordered w-full ${
            errors.linkedin && "input-error"
          } bg-slate-800 focus:outline-none`}
          value={links.linkedin}
          onChange={handleChange}
        />
        {errors.linkedin && (
          <span className="text-error text-sm mt-1">{errors.linkedin}</span>
        )}
      </div>

      {/* GitHub */}
      <div>
        <label className="label text-sm font-medium text-white">
          <span className="flex items-center text-[#01ffdb] gap-2">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmM2VjZWMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1naXRodWItaWNvbiBsdWNpZGUtZ2l0aHViIj48cGF0aCBkPSJNMTUgMjJ2LTRhNC44IDQuOCAwIDAgMC0xLTMuNWMzIDAgNi0yIDYtNS41LjA4LTEuMjUtLjI3LTIuNDgtMS0zLjUuMjgtMS4xNS4yOC0yLjM1IDAtMy41IDAgMC0xIDAtMyAxLjUtMi42NC0uNS01LjM2LS41LTggMEM2IDIgNSAyIDUgMmMtLjMgMS4xNS0uMyAyLjM1IDAgMy41QTUuNDAzIDUuNDAzIDAgMCAwIDQgOWMwIDMuNSAzIDUuNSA2IDUuNS0uMzkuNDktLjY4IDEuMDUtLjg1IDEuNjUtLjE3LjYtLjIyIDEuMjMtLjE1IDEuODV2NCIvPjxwYXRoIGQ9Ik05IDE4Yy00LjUxIDItNS0yLTctMiIvPjwvc3ZnPg=="
              className="w-5 h-5"
              alt="GitHub"
            />
            GitHub
          </span>
        </label>
        <input
          type="url"
          name="github"
          placeholder="https://github.com/username"
          className={`input input-bordered w-full ${
            errors.github && "input-error"
          }  bg-slate-800 focus:outline-none`}
          value={links.github}
          onChange={handleChange}
        />
        {errors.github && (
          <span className="text-error text-sm mt-1">{errors.github}</span>
        )}
      </div>

      {/* Portfolio */}
      <div>
        <label className="label text-sm font-medium text-white">
          <span className="flex items-center text-[#01ffdb] gap-2">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmM2VjZWMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jb250YWN0LWljb24gbHVjaWRlLWNvbnRhY3QiPjxwYXRoIGQ9Ik0xNiAydjIiLz48cGF0aCBkPSJNNyAyMnYtMmEyIDIgMCAwIDEgMi0yaDZhMiAyIDAgMCAxIDIgMnYyIi8+PHBhdGggZD0iTTggMnYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMSIgcj0iMyIvPjxyZWN0IHg9IjMiIHk9IjQiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiLz48L3N2Zz4="
              className="w-5 h-5"
              alt="Portfolio"
            />
            Portfolio
          </span>
        </label>
        <input
          type="url"
          name="portfolio"
          placeholder="https://example.com/"
          className="input input-bordered w-full bg-slate-800 focus:outline-none"
          value={links.portfolio}
          onChange={handleChange}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <button className="link text-sm"></button>
        <form method="dialog">
          <button
            className="btn bg-green-500 hover:bg-green-600"
            disabled={!isValid()}
            onClick={handleSave}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default LinkForm;
