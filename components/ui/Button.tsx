import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    href?: string;
  };

export default function Button({
  children,
  href,
  type = "button",
  className = "",
  disabled,
  ...buttonProps
}: ButtonProps) {
  const combinedClassName = `
    inline-flex items-center justify-center
    rounded-xl bg-teal-600 px-4 py-2
    text-sm font-semibold text-white
    shadow-sm transition-all duration-200
    hover:bg-teal-500 hover:shadow-md
    active:scale-95
    disabled:cursor-not-allowed
    disabled:opacity-60
    disabled:hover:bg-teal-600
    disabled:hover:shadow-sm
    disabled:active:scale-100
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button
      {...buttonProps}
      type={type}
      disabled={disabled}
      className={combinedClassName}
    >
      {children}
    </button>
  );
}