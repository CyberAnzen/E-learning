import React from "react";



export default function SuccessMessage({ message }) {
  if (!message) return null;

  return (
    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
      <p className="text-green-400 text-sm">{message}</p>
    </div>
  );
}