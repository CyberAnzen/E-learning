import React from "react";

const CertificateList = () => {
  const courses = [
    {
      title: "Sustainable Development in the 21st Century",
      provider: "Yonsei University",
      grade: 94.3,
    },
    {
      title: "Generative AI: Foundation Models and Platforms",
      provider: "IBM",
      grade: 93.7,
    },
    {
      title: "Social Business Model and Planning for Social Innovation",
      provider: "Copenhagen Business School",
      grade: 75,
    },
    {
      title:
        "Introduction to the Nonprofit Sector, Nonprofit Organizations, Nonprofit Leadership and Governance",
      provider: "University at Buffalo, The State University of New York",
      grade: 92.5,
    },
    
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-85% via-black to-black border-[#01ffdb]/20">
      <div className="max-w-5xl mx-auto p-4 space-y-10 min-h-155 py-10">
        <h1 className="text-2xl font-bold text-white">My Certificates</h1>

        {courses.map((course, index) => (
          <div
            key={index}
            className="glass-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-cyan-500/20 bg-white/5 rounded-xl p-4 shadow-md hover:shadow-cyan-500/10 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-2">
                <div
                  className="radial-progress text-cyan-400 text-sm"
                  style={{
                    "--value": course.grade,
                    "--size": "4rem",
                    "--thickness": "3px",
                  }}
                  role="progressbar"
                  aria-valuenow={course.grade}
                >
                  {course.grade}%
                </div>
              </div>
              <div className="">
                <h2 className="font-semibold text-lg text-white">{course.title}</h2>
                <p className="text-sm text-gray-400">{course.provider}</p>
              </div>
            </div>

            <button className="btn bg-cyan-800 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition">
              Get your certificate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateList;
