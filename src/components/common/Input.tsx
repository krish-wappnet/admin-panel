import React from 'react';

interface InputProps {
  type: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}

export const Input: React.FC<InputProps> = ({ type, label, value, onChange, ariaLabel }) => {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded dark:bg-white-700 dark:border-white-600"
        aria-label={ariaLabel || label}
      />
    </div>
  );
};