"use client";

import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  register,
  required,
  placeholder,
  errors,
  type = "text",
  disabled,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-lg font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={id}
        disabled={disabled}
        placeholder={placeholder}
        {...register(id, { required })}
        className={clsx(
          `
         w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent`,
          errors[id] && "focus:ring-rose-500",
          disabled && "opacity-50 cursor-default"
        )}
      />
    </div>
  );
};

export default Input;
