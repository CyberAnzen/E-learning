import React, { useEffect, useState } from "react";

const RadialProgess = ({
  progessdata = {
    missiondetails: "Default Mission",
    missiondescription: "This is a default mission description.",
    missiondata: 50,
  },
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Set thickness and font size based on screen
  const radialStyles = {
    "--value": progessdata.missiondata,
    "--thickness": isMobile ? "3px" : "6px",
    "--size": isMobile ?"4rem" : "5rem"
  };

  return (
    <div className="bg-transparent cyber-cart text-[#01ffdb] transition-all duration-300 hover:shadow-lg hover:shadow-[#01ffd922] p-4 lg:px-12 md:px-11 flex flex-row md:flex-row justify-between items-center w-full">
      <div className="mb-4 max-md:mb-0">
        <h3 className="text-lg max-md:text-md font-bold">
          {progessdata.missiondetails}
        </h3>
        <p className="text-sm max-md:text-sm text-gray-300">
          {progessdata.missiondescription}
        </p>
      </div>
      {/* For TSX uncomment the commented types below */}
      <div className="w-1/2 flex justify-end">
        {/* Right column: radial-progress */}
        <div
          className="radial-progress bg-cyan-900/50 text-cyan-400 border-cyan-800/5 border-4"
          style={
           radialStyles /* as React.CSSProperties */
          }
          aria-valuenow={progessdata.missiondata}
          role="progressbar"
        >
          <span className={isMobile ? "text-sm" : "text-md"}>
            {progessdata.missiondata}%
          </span>{" "}
        </div>
      </div>
    </div>
  );
};

export default RadialProgess;
