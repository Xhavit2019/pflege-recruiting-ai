import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export default function Select(props: SelectProps) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 ${
        props.className || ""
      }`}
    />
  );
}