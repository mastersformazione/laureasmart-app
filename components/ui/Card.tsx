"use client";

type Props = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

export default function Card({ title, description, children, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition active:scale-[0.99] cursor-pointer"
    >
      {title && (
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      )}

      {description && (
        <p className="mt-1 text-xs text-gray-500 leading-5">{description}</p>
      )}

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
