import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 ${
        props.className || ""
      }`}
    />
  );
}