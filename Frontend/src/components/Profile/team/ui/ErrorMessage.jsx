import React from "react";


export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  );
}