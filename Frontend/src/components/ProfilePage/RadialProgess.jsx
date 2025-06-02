import React from "react";

const RadialProgess = ({
  progessdata = {
    missiondetails: "Default Mission",
    missiondescription: "This is a default mission description.",
    missiondata: 50,
  },
}) => {
  return (
    <div className="bg-cyan-900  p-4 flex flex-col md:flex-row justify-between items-center w-full">
      <div className="mb-4 md:mb-0">
        <h3 className="text-lg font-bold">{progessdata.missiondetails}</h3>
        <p className="text-sm text-gray-300">
          {progessdata.missiondescription}
        </p>
      </div>
      {/* For TSX uncomment the commented types below */}
      <div
        className="radial-progress bg-gray-800 text-primary-content border-gray-800 border-4"
        style={
          { "--value": progessdata.missiondata } /* as React.CSSProperties */
        }
        aria-valuenow={progessdata.missiondata}
        role="progressbar"
      >
        {progessdata.missiondata}%
      </div>
    </div>
  );
};

export default RadialProgess;
