import React, { useRef, useState } from "react";
import RadialProgess from "./RadialProgess";
import Avatargroup from "./Avatargroup";
import SkillsSelector from "./SkillsSelector";
import { Link } from "react-router-dom";
import {
  Contact,
  Copy,
  FileUser,
  Github,
  Linkedin,
  Pencil,
  SquarePen,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import LinkForm from "./LinkForm";
import Modal from "./Modal";
import Carousel from "./Carousel";

const ProfileDashboard = () => {
  const [image, setImage] = useState(
    "https://i.pinimg.com/736x/af/70/bb/af70bb880077591b711b83ee7717c91b.jpg"
  );
  const { savedSkills, savedLinks } = useAppContext();
  console.log(savedLinks);
  
  const [myResume, setMyResume] = useState(null);
  const fileInputRef = useRef();

  const handleImageClick = () => {
    fileInputRef.current.click(); // trigger file input click
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMyResume(URL.createObjectURL(file));
    }
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("748589549");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // hide after 1.5s
  };

  const dummyskills = ["Css", "Javascript(Intermediate)"];
  const dummyData = [
    {
      missiondetails: "Frontend Development",
      missiondescription: "Build responsive UI with React and Tailwind CSS.",
      missiondata: 80,
    },
    {
      missiondetails: "Backend Integration",
      missiondescription: "Connect frontend with Node.js and Express APIs.",
      missiondata: 60,
    },
    {
      missiondetails: "Database Design",
      missiondescription: "Design MongoDB schemas and queries.",
      missiondata: 45,
    },
    {
      missiondetails: "Testing & Deployment",
      missiondescription: "Write tests and deploy to production.",
      missiondata: 70,
    },
  ];

  const MyCertifications = [
    "https://tse4.mm.bing.net/th?id=OIP.yYwNZAfYKu7bt1tDMXIkbgHaFm&pid=Api&P=0&h=180",
    "https://tse2.mm.bing.net/th?id=OIP.7ZoCMCnNIfCjPZJia2Bq0QHaE4&pid=Api&P=0&h=180",
    "https://tse1.mm.bing.net/th?id=OIP.-kVdIcJXAaLK6XBKiiTPQQHaFY&pid=Api&P=0&h=180",
    "https://tse1.mm.bing.net/th?id=OIP.iIuEYq48GYIbLeqHfuajoAHaFP&pid=Api&P=0&h=180",
    "https://tse1.mm.bing.net/th?id=OIP.BZytSwOaaretcAGUwO-rbwHaFR&pid=Api&P=0&h=180",
  ];

  const SavedLinks = {
    linkedin: "https://www.linkedin.com/feed/",
    github: "https://github.com/yogesh4617",
    portfolio: "https://github.com/yogesh4617",
  };

  return (
    <div className="h-full bg-gradient-to-br from-black via-98% via-gray-900 to-black text-white p-6 space-y-6 overflow-y-auto">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-transparent cyber text-[#01ffdb] border-[#01ffdb]/20 rounded-xl border hover:border-[#01ffdb]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#01ffd922] p-4 flex flex-col items-center text-center relative">
          <Link
            to="/profile/editprofile"
            className="absolute top-3 right-4 text-[#01ffdb] hover:text-cyan-700 cursor-pointer"
          >
            <SquarePen size={18} />
          </Link>
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold">
            <img src={image} alt="" className="rounded-full" />
          </div>
          {/* Phone Number with Copy */}
          <div className="relative flex items-center gap-2 mt-1">
            <p className="text-xs">748589549</p>
            <button
              onClick={handleCopy}
              className="text-[#01ffdb] cursor-pointer hover:text-[#01ffdb]/50 transition"
              title="Copy number"
            >
              <Copy size={14} />
            </button>
            {copied && (
              <span className="absolute -top-4 left-90 -translate-x-60 text-xs text-black font-medium bg-[#01ffdb] px-2 py-0.5 rounded shadow ">
                Copied!
              </span>
            )}
          </div>{" "}
          <h2 className="mt-2 text-xl font-semibold">shadcn 🇮🇳</h2>
          <p className="text-sm text-gray-400">m@example.com</p>
        </div>

        {/* Complete Profile Prompt (Spans 2 columns on large screens) */}
        <Carousel data={dummyData} dataKey="progessdata" carouselId="progress">
          <RadialProgess />
        </Carousel>
      </div>

      {/* Second Row: Personal Info, Resume, EEO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className=" bg-transparent cyber-cart text-[#01ffdb] border-[#01ffdb]/20 backdrop-blur-xl rounded-xl border hover:border-[#01ffdb]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#01ffd922]  p-4 relative">
          <Link
            to="/profile/editprofile"
            className="absolute top-3 right-4 text-[#01ffdb] hover:text-cyan-700 cursor-pointer"
          >
            <SquarePen size={18} />
          </Link>
          <h3 className="font-bold mb-2">Personal Information</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>📧 mexample@gmail.com</li>
            <li>📱 Add your mobile number</li>
            <li>📍 Add your location</li>
          </ul>
        </div>

        {/* Resume */}
        <div className="bg-transparent cyber-cart text-[#01ffdb] border-[#01ffdb]/20 rounded-xl border hover:border-[#01ffdb]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#01ffd922] p-4">
          <h3 className="font-bold mb-2 ">My Resume</h3>
          {/* Dynamic label */}
          {!myResume ? (
            <p className="text-sm text-gray-300 ">Add your resume here</p>
          ) : (
            <p className="text-sm text-cyan-400">Resume Preview :</p>
          )}

          {/* Show Add Button Only If No Resume */}
          {!myResume && (
            <button
              className="bg-cyan-800/90 hover:bg-cyan-900 px-3 py-1 text-sm rounded cursor-pointer"
              onClick={handleImageClick}
            >
              + Add Resume
            </button>
          )}

          <input
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />

          {/* Show View Button If Resume is Added */}
          {myResume && (
            <div className="flex flex-wrap gap-2 mt-2">
              <a
                title="Resume Preview"
                href={myResume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1
                 bg-cyan-600 px-3 py-1 rounded-full text-sm text-black font-bold hover:underline"
              >
                <FileUser size={24} />
                View Uploaded Resume
              </a>
            </div>
          )}
        </div>

        {/* EEO Settings */}
        {/* <div className="bg-[#0f172a]/50 text-white border-[#38bdf8]/20 backdrop-blur-xl rounded-xl border hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 p-4">
          <h3 className="font-bold mb-2">EEO Settings</h3>
          <p className="text-sm text-gray-300">No data added</p>
        </div> */}
      </div>

      {/* Badges, Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Badges */}
        <div className="bg-transparent cyber-cart text-[#01ffdb] border-[#01ffdb]/20 rounded-xl border hover:border-[#01ffdb]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#01ffd922] p-4 relative">
          <h3 className="font-bold mb-1">Links</h3>
          <p className="text-sm text-gray-300">
            Add all the relevant links that help in knowing you as a cyberAnzen{" "}
          </p>
          <button
            className="btn btn-ghost text-[#01ffdb] absolute top-4 right-1 cursor-pointer bg-transparent shadow-none border-none font-normal"
            onClick={() => document.getElementById("link_modal").showModal()}
          >
            {savedLinks ? (
              <SquarePen size={20} className="hover:text-cyan-700" />
            ) : (
              "+ Add Links"
            )}
          </button>
          <Modal id="link_modal">
            <LinkForm />
          </Modal>
          <div className="flex flex-wrap gap-2 mt-2">
            {savedLinks &&
              Object.entries(savedLinks).map(([key, value]) =>
                value ? (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={key}
                    className="flex items-center gap-2 bg-cyan-600 text-black font-bold px-3 py-1 mt-3 rounded-full text-sm hover:underline"
                  >
                    {key === "github" && <Github size={16} />}
                    {key === "linkedin" && <Linkedin size={16} />}
                    {key === "portfolio" && <Contact size={16} />}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </a>
                ) : null
              )}
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-transparent cyber-cart text-[#01ffdb] border-[#01ffdb]/20 rounded-xl border hover:border-[#01ffdb]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#01ffd922] p-4 ">
        <h3 className="font-bold mb-1">My Certifications</h3>
        <p className="text-sm text-gray-300">
          You have not earned any certificates yet.{" "}
          <Link
            to="/profile/certificatelist"
            className="text-blue-400 cursor-pointer"
          >
            Get Certified
          </Link>
        </p>
      </div>

      {/* Work & Education */}
      <div className="">
        {/* Work Experience */}
        {/* <div className="bg-[#0f172a]/50 text-white border-[#38bdf8]/20 backdrop-blur-xl rounded-xl border hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Work Experience</h3>
            <button className="text-blue-400 text-sm">
              + Add Work Experience
            </button>
          </div>
          <p className="text-sm text-gray-300 mt-1">
            Add your work experience. Don’t forget to add those internships as
            well.
          </p>
        </div> */}
      </div>
      <div>
        {/* Education */}
        <div className="bg-transparent cyber-cart text-[#01ffdb] border-[#01ffdb]/20 rounded-xl border hover:border-[#01ffdb]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#01ffd922] p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">My Skills</h3>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button
              className="btn btn-ghost text-[#01ffdb] cursor-pointer bg-transparent shadow-none border-none font-normal"
              onClick={() =>
                document.getElementById("skills_modal").showModal()
              }
            >
              {savedSkills.length > 0 ? (
                <SquarePen size={20} className="hover:text-cyan-700" />
              ) : (
                "+ Add Skills"
              )}
            </button>
            <Modal id="skills_modal">
              <SkillsSelector />
            </Modal>
          </div>
          <p className="text-sm text-gray-300 mt-1">
            We believe in skills over pedigree but go ahead add your education
            for the recruiters who don’t.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {savedSkills.map((skill) => (
              <span
                key={skill}
                className="flex items-center bg-cyan-600 text-black font-bold px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
