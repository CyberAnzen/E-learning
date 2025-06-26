import React from "react";

const RadialProgess = ({
  progessdata = {
    missiondetails: "Default Mission",
    missiondescription: "This is a default mission description.",
    missiondata: 50,
  },
}) => {
  console.log(progessdata);

  return (
    <div className="bg-cyan-800/50 text-black border-[#38bdf8]/20 backdrop-blur-xl rounded-xl border hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10  p-4 md:px-12 lg:px-10 flex flex-col md:flex-row justify-between items-center w-full">
      <div className="mb-4 md:mb-0">
        <h3 className="text-lg font-bold">{progessdata.missiondetails}</h3>
        <p className="text-sm text-gray-300">
          {progessdata.missiondescription}
        </p>
      </div>
      {/* For TSX uncomment the commented types below */}
      <div
        className="radial-progress bg-cyan-900/50 text-cyan-400 border-cyan-800/5 border-4"
        style={
          { "--value": progessdata.missiondata ,"--thickness": "5px"} /* as React.CSSProperties */
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
