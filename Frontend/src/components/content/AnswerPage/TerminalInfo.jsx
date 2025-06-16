import React from 'react';
import PropTypes from 'prop-types';
import { Zap } from 'lucide-react';

const TerminalInfo = ({ ip, chapterPath }) => {
  return (
    <div className="flex-shrink-0 bg-black/30 backdrop-blur-sm px-6 py-4 border-b border-white/5">
      <div className="font-mono text-sm">
        <div className="flex items-center gap-2 text-green-400">
          <span className="text-gray-500">┌──(</span>
          <span className="text-blue-400">student@assessment</span>
          <span className="text-gray-500">)-[</span>
          <span className="text-amber-400">~/{chapterPath}</span>
          <span className="text-gray-500">]</span>
        </div>
        <div className="flex items-center gap-2 text-green-400 mt-1">
          <span className="text-gray-500">└─</span>
          <span className="text-green-400">$</span>
          <span className="text-white ml-2 flex items-center gap-2">
            Connection: {ip}
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-400">Auto-submit enabled</span>
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