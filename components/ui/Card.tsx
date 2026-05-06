"use client";

type Props = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  badge?: string;
  icon?: React.ReactNode;
  className?: string;
};

export default function Card({
  title,
  description,
  children,
  onClick,
  badge,
  icon,
  className = "",
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        w-full
        rounded-[26px]
        border
        border-[#E4EAF1]
        bg-white
        p-5
        shadow-[0_10px_32px_rgba(15,23,42,0.06)]
        transition-all
        duration-200
        ${onClick ? "cursor-pointer active:scale-[0.99]" : ""}
        ${className}
      `}
    >
      {(title || badge || icon) && (
        <div className="flex items-start gap-4">
          {icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF4FC] text-[#1F6FB2] font-bold">
              {icon}
            </div>
          )}

          <div className="min-w-0 flex-1">
            {(title || badge) && (
              <div className="flex items-start justify-between gap-3">
                {title && (
                  <h3 className="text-[20px] leading-[23px] font-bold tracking-[-0.03em] text-[#09090B]">
                    {title}
                  </h3>
                )}

                {badge && (
                  <div className="whitespace-nowrap rounded-full bg-[#EEF4FF] px-3 py-1 text-[11px] font-semibold text-[#1F6FB2]">
                    {badge}
                  </div>
                )}
              </div>
            )}

            {description && (
              <p className="mt-2 text-[15px] leading-[22px] font-normal tracking-[-0.01em] text-[#71717A]">
                {description}
              </p>
            )}
          </div>
        </div>
      )}

      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
