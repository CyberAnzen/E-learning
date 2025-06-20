import { div } from "framer-motion/client";
import { ShieldCheck } from "lucide-react";
import React from "react";

const CertificateList = () => {
  const courses = [
    {
      title: "Sustainable Development in the 21st Century",
      provider: "Yonsei University",
      grade: 94.23,
    },
    {
      title: "Generative AI: Foundation Models and Platforms",
      provider: "IBM",
      grade: 93.75,
    },
    {
      title: "Social Business Model and Planning for Social Innovation",
      provider: "Copenhagen Business School",
      grade: 100,
    },
    {
      title:
        "Introduction to the Nonprofit Sector, Nonprofit Organizations, Nonprofit Leadership and Governance",
      provider: "University at Buffalo, The State University of New York",
      grade: 92.5,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-90 via-85% via-black to-black border-[#01ffdb]/20">
    <div className="max-w-5xl mx-auto p-4 space-y-10 min-h-155 py-10">
      <h1 className="text-2xl font-bold mb-10" >My Certificates</h1>

      {courses.map((course, index) => (
        <div
          key={index}
          className=" opacity-70 shadow-md rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0  bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
        >
          <div className="flex items-start space-x-4">
            <div className="p-4 rounded-md">
              <ShieldCheck className="w-10 h-10 text-blue-600"/>
            </div>
            <div>
              <h2 className="font-semibold text-lg">{course.title}</h2>
              <p className="text-sm text-gray-600">{course.provider}</p>
              <p className="text-sm font-medium text-gray-700">
                Grade Achieved:{" "}
                <span className="text-blue-600">{course.grade}%</span>
              </p>
            </div>
          </div>

          <button className="btn self-stretch md:self-auto text-sm  bg-gray-800/50 border border-gray-700 hover:bg-blue-600 hover:border-blue-600">
            Get your certificate
          </button>
        </div>
      ))}
    </div>
    </div>
  );
};

export default CertificateList;