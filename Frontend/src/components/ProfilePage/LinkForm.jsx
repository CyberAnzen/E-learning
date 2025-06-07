import React, { useState } from "react";

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
        linkedin: validateLinkedIn(value) ? "" : "Invalid LinkedIn link",
      }));
    }

    if (name === "github") {
      setErrors((prev) => ({
        ...prev,
        github: validateGitHub(value) ? "" : "Invalid GitHub link",
      }));
    }
  };

  const isValid = () =>
    links.linkedin &&
    validateLinkedIn(links.linkedin) &&
    links.github &&
    validateGitHub(links.github) ||
    links.portfolio;

  return (
    <div className=" p-6 rounded-lg text-white space-y-4">
      <h2 className="text-xl font-semibold">Links</h2>

      {/* LinkedIn */}
      <div>
        <label className="label text-sm font-medium text-white">
          <span className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
              className="w-5 h-5"
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
          }`}
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
          <span className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
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
          }`}
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
          <span className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/565/565547.png"
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
          className="input input-bordered w-full"
          value={links.portfolio}
          onChange={handleChange}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <button className="link text-sm"></button>
        <button className="btn btn-primary" disabled={!isValid()}>
          Save
        </button>
      </div>
    </div>
  );
};

export default LinkForm;
