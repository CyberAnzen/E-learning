// File: src/components/CyberQASection.jsx

import React, { useState } from "react";
import { Lock, Code, Shield, CheckCircle } from "lucide-react";

const CyberQASection = ({
  questions = [],
  initialAnswers = {},
  onAnswerSubmit,
  onSubmitAll,
}) => {
  const [answers, setAnswers] = useState(initialAnswers);

  const handleChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    onAnswerSubmit && onAnswerSubmit(qId, value);
  };

  return (
    <div className="bg-gray-900 text-gray-200 rounded-xl shadow-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
        <Shield className="w-6 h-6 text-cyan-500" /> Cybersecurity Q&A
      </h2>

      {questions.map((qText, idx) => {
        const qId = `q${idx + 1}`;
        return (
          <div
            key={qId}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-cyan-600/30 hover:border-cyan-500 transition"
          >
            <label htmlFor={qId} className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold">{qText}</span>
            </label>
            <textarea
              id={qId}
              rows={3}
              className="w-full bg-gray-700/50 rounded-lg p-3 text-white border border-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition"
              placeholder="Type your answer..."
              value={answers[qId] || ""}
              onChange={(e) => handleChange(qId, e.target.value)}
            />
          </div>
        );
      })}

      <button
        onClick={() => onSubmitAll && onSubmitAll(answers)}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold transition-shadow shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
      >
        <CheckCircle className="w-6 h-6" />
        Submit Answers
      </button>
    </div>
  );
};

export default CyberQASection;
