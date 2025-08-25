import React from "react";


export default function FormInput({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
}) {
  const inputStyle =
    "w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#00bfff]/15 via-[#1e90ff]/10 to-[#00bfff]/5 border border-[#00bfff]/30 transition-all duration-300 text-white placeholder-[#00bfff]/50 outline-none focus:outline-none focus:ring-1 focus:ring-[#00bfff] focus:border-[#00bfff]/50";

  return (
    <div>
      <label className="block text-sm font-medium text-[#00ffff]/70 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputStyle}
        disabled={disabled}
      />
    </div>
  );
}