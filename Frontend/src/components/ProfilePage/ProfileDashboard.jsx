import React, { useState } from "react";
import RadialProgess from "./RadialProgess";
import Avatargroup from "./Avatargroup";
import SkillsSelector from "./SkillsSelector";
import { Link } from "react-router-dom";
import { SquarePen } from "lucide-react";

const ProfileDashboard = () => {
  const [image, setImage] = useState(
    "https://i.pinimg.com/736x/af/70/bb/af70bb880077591b711b83ee7717c91b.jpg"
  );

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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold">
            <img src={image} alt="" className="rounded-full" />
          </div>
          <h2 className="mt-2 text-xl font-semibold">shadcn 🇮🇳</h2>
          <p className="text-sm text-gray-400">m@example.com</p>
        </div>

        {/* Complete Profile Prompt (Spans 2 columns on large screens) */}
        <div className="carousel col-span-1 lg:col-span-2 rounded-xl w-full h-auto">
          {dummyData.map((item, index) => {
            const prevSlide = `#slide${index === 0 ? dummyData.length : index}`;
            const nextSlide = `#slide${
              index === dummyData.length - 1 ? 1 : index + 2
            }`;
            return (
              <div
                key={index}
                id={`slide${index + 1}`}
                className="carousel-item relative w-full"
              >
                <RadialProgess progessdata={item} />
                <div className="absolute left-15 right-15 max-ms:left-right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                  <a href={prevSlide} className="btn btn-circle opacity-30">
                    ❮
                  </a>
                  <a href={nextSlide} className="btn btn-circle opacity-30">
                    ❯
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Second Row: Personal Info, Resume, EEO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-2">Personal Information</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>📧 mexample@gmail.com</li>
            <li>📱 Add your mobile number</li>
            <li>📍 Add your location</li>
          </ul>
        </div>

        {/* Resume */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-2">My Resume</h3>
          <p className="text-sm text-gray-300 mb-2">Add your resume here</p>
          <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded">
            + Add Resume
          </button>
        </div>

        {/* EEO Settings */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-2">EEO Settings</h3>
          <p className="text-sm text-gray-300">No data added</p>
        </div>
      </div>

      {/* Badges, Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Badges */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-1">Links</h3>
          <p className="text-sm text-gray-300">
            Add all the relevant links that help in knowing you as a cyberAnzen{" "}
            <span className="text-blue-400 cursor-pointer">Add Links</span>
          </p>
        </div>

        {/* Certifications */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-1">My Certifications</h3>
          <p className="text-sm text-gray-300">
            You have not earned any certificates yet.{" "}
            <Link to='/learn' className="text-blue-400 cursor-pointer">Get Certified</Link>
          </p>
          <Avatargroup certifications={MyCertifications} />
        </div>
      </div>

      {/* Work & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Work Experience */}
        <div className="bg-gray-800 rounded-xl p-4">
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
        </div>

        {/* Education */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">My Skills</h3>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button
              className="btn btn-ghost text-blue-400 cursor-pointer bg-transparent shadow-none border-none font-normal"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              + Add Skills
            </button>
            <dialog id="my_modal_3" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                
                <SkillsSelector/>
              </div>
            </dialog>{" "}
          </div>
          <p className="text-sm text-gray-300 mt-1">
            We believe in skills over pedigree; but go ahead add your education
            for the recruiters who don’t.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
