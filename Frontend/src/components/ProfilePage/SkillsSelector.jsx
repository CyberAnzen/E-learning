import React, { useState } from "react";
import { X } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const allSkills = [
  "Algorithm",
  "Angular",
  "Css",
  "Data Structure",
  "Javascript(Intermediate)",
  "Python(Advanced)",
  "SQL",
  "Python(Intermediate)",
  "AWS (Amazon Web Services)",
  "HTML5",
  "Machine Learning",
  "MongoDB",
];

const quickSkills = [
  "Algorithm",
  "Angular",
  "Css",
  "Data Structure",
  "Javascript(Intermediate)",
  "Python(Advanced)",
  "SQL",
  "Python(Intermediate)",
];

const SkillsSelector = ({ modalRef }) => {
  const { savedSkills, setSavedSkills } = useAppContext();
  const [draftSkills, setDraftSkills] = useState([...savedSkills]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  console.log(savedSkills);

  const addSkill = (skill) => {
    if (!draftSkills.includes(skill)) {
      setDraftSkills([...draftSkills, skill]);
    }
    setSearch("");
    setShowDropdown(false);
  };

  const removeSkill = (skillToRemove) => {
    setDraftSkills(draftSkills.filter((skill) => skill !== skillToRemove));
  };

  const handleSave = () => {
    setSavedSkills([...draftSkills]);
    modalRef?.current?.close(); // ⬅️ Close the modal
  };

  const filteredSkills = allSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(search.toLowerCase()) &&
      !draftSkills.includes(skill)
  );

  return (
    <div className=" text-white p-6 rounded-lg w-full max-w-xl mx-auto relative">
      <div className="text-lg font-semibold mb-4">My Skills</div>
      {/* Draft selected skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {draftSkills.map((skill) => (
          <span
            key={skill}
            className="flex items-center bg-cyan-500/50 px-3 py-1 rounded-full text-sm"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="ml-2 hover:text-red-400 cursor-pointer"
            >
              <X size={16} />
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search for skills"
        className="w-full h-12 p-2 rounded-md mb-2 bg-slate-800 focus:outline-none text-white placeholder-gray-400 border border-gray-600 hover:border-cyan-500/50"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
      />

      {showDropdown && search && (
        <div className="absolute z-10 w-full max-w-xl bg-slate-800 focus:outline-none text-white placeholder-gray-400 border border-gray-600 hover:border-cyan-500/50 max-h-60 overflow-y-auto">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill) => (
              <div
                key={skill}
                onClick={() => addSkill(skill)}
                className="px-4 py-2 hover:bg-[#3a3a52] cursor-pointer text-sm"
              >
                {skill}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-400 text-sm">
              No matching skills
            </div>
          )}
        </div>
      )}

      <div className="text-sm font-medium mt-6 mb-2">Quick Adds</div>
      <div className="flex flex-wrap gap-3 mb-4">
        {quickSkills.map((skill) => (
          <button
            key={skill}
            onClick={() => addSkill(skill)}
            className="px-3 py-1 rounded-md border border-white hover:border-cyan-500/50 hover:bg-cyan-500/50 hover:text-black transition text-sm"
          >
            {skill}
          </button>
        ))}
      </div>

      <div className="text-right">
        <form method="dialog">
          <button
            onClick={handleSave}
            className="btn bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md font-medium"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default SkillsSelector;
