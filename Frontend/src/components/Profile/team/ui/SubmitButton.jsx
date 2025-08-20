import React from "react";



export default function SubmitButton({
  loading,
  disabled,
  loadingText,
  text,
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full bg-gradient-to-r from-[#00bfff] to-[#1e90ff] text-white py-3 px-6 rounded-lg font-medium hover:from-[#00bfff]/90 hover:to-[#1e90ff]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
    >
      {loading ? loadingText : text}
    </button>
  );
}