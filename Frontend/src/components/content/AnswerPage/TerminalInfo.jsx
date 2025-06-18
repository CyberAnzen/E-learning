import React from "react";
import PropTypes from "prop-types";
import { Zap, Shield, Terminal } from "lucide-react";

const TerminalInfo = ({ ip, chapterPath }) => {
  return (
    <div className="flex-shrink-0 bg-gradient-to-r from-black/60 to-gray-900/60 backdrop-blur-sm px-4 sm:px-6 py-4 border-b border-cyan-400/20 relative overflow-hidden">
      {/* Cyber accent line */}
      {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400/50 via-teal-400/50 to-cyan-300/50"></div> */}

      <div className="font-mono text-sm sm:text-base max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-green-400 flex-wrap">
          <span className="text-gray-500">┌──(</span>
          <span className="text-cyan-400 font-bold flex items-center gap-1">
            <Shield className="w-4 h-4" />
            student@cyber-assessment
          </span>
          <span className="text-gray-500">)-[</span>
          <span className="text-amber-400 font-bold">~/{chapterPath}</span>
          <span className="text-gray-500">]</span>
        </div>
        <div className="flex items-center gap-2 text-green-400 mt-1 flex-wrap">
          <span className="text-gray-500">└─</span>
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-green-400 font-bold">$</span>
          <span className="text-cyan-100 ml-2 flex items-center gap-2 flex-wrap">
            <span className="font-bold">Connection: {ip}</span>
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-bold">
              AUTO-SUBMIT ENABLED
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

TerminalInfo.propTypes = {
  ip: PropTypes.string.isRequired,
  chapterPath: PropTypes.string.isRequired,
};

export default TerminalInfo;
