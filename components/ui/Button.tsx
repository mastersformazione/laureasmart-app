"use client";

type Props = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  label,
  onClick,
  variant = "secondary",
  disabled = false,
  type = "button",
}: Props) {
  const base =
    "w-full rounded-2xl py-4 text-base font-medium transition active:scale-[0.98]";

  const styles =
    variant === "primary"
      ? "bg-black text-white"
      : variant === "danger"
      ? "bg-gray-100 text-red-500"
      : "bg-gray-100 text-black";

  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${disabledStyle}`}
    >
      {label}
    </button>
  );
}
