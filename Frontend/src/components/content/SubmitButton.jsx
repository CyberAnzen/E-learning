import React from "react";
import { CheckCircle, ChevronRight, Lock } from "lucide-react";

const SubmitButton = ({
  isSubmitted,
  completedSteps,
  totalObjectives,
  onSubmit,
  className = "",
}) => {
  const isDisabled = isSubmitted || completedSteps.length !== totalObjectives;

  return (
    <button
      onClick={onSubmit}
      disabled={isDisabled}
      className={`cyber-button gap-x-2 flex items-center justify-center px-10 py-3 font-bold rounded-lg transition-all duration-300 ${
        completedSteps.length === totalObjectives
          ? "bg-[#01ffdb]/10 border border-[#01ffdb]/50 text-[#01ffdb] hover:bg-[#01ffdb]/20"
          : "bg-gray-700/50 border border-gray-600 text-gray-400 cursor-not-allowed"
      } ${className}`}
    >
      <div className="flex items-center text-xs md:text-md lg:text-lg gap-2">
        {isSubmitted ? (
          <>
            <CheckCircle className="w-5 h-5" /> Submitted
          </>
        ) : (
          <>
            {completedSteps.length === totalObjectives ? (
              <>
                Submit Answers <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Complete all steps to continue <Lock className="w-5 h-5" />
              </>
            )}
          </>
        )}
      </div>
    </button>
  );
};

export default SubmitButton;
