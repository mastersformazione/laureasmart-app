"use client";

type Props = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  badge?: string;
};

export default function Card({
  title,
  description,
  children,
  onClick,
  badge,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="
        w-full
        rounded-[24px]
        border
        border-[#E4EAF1]
        bg-white
        p-5
        shadow-[0_8px_28px_rgba(15,23,42,0.05)]
        transition-all
        duration-200
        active:scale-[0.99]
        cursor-pointer
      "
    >
      {(title || badge) && (
        <div className="flex items-start justify-between gap-3">
          {title && (
            <h3 className="text-[20px] leading-[22px] font-bold tracking-[-0.03em] text-[#09090B]">
              {title}
            </h3>
          )}

          {badge && (
            <div
              className="
                whitespace-nowrap
                rounded-full
                bg-[#EEF4FF]
                px-3
                py-1
                text-[11px]
                font-semibold
                text-[#1F6FB2]
              "
            >
              {badge}
            </div>
          )}
        </div>
      )}

      {description && (
        <p className="mt-3 text-[15px] leading-[22px] font-normal tracking-[-0.01em] text-[#71717A]">
          {description}
        </p>
      )}

      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
