"use client";

type Props = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  badge?: string;
  icon?: string;
};

export default function Card({
  title,
  description,
  children,
  onClick,
  badge,
  icon,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="
        w-full
        rounded-[28px]
        border
        border-[#D7E7F5]
        bg-white
        p-5
        shadow-[0_14px_36px_rgba(15,23,42,0.08)]
        transition-all
        duration-200
        active:scale-[0.985]
        cursor-pointer
      "
    >
      {(title || badge || icon) && (
        <div className="flex items-start gap-4">
          {icon && (
            <div
              className="
                flex
                h-[54px]
                w-[54px]
                shrink-0
                items-center
                justify-center
                rounded-[20px]
                bg-[#EAF4FC]
                text-[18px]
                font-extrabold
                text-[#1F6FB2]
                shadow-[0_8px_18px_rgba(31,111,178,0.10)]
              "
            >
              {icon}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              {title && (
                <h3 className="text-[21px] leading-[24px] font-extrabold tracking-[-0.04em] text-[#09090B]">
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
                    py-1.5
                    text-[12px]
                    font-bold
                    text-[#1F6FB2]
                  "
                >
                  {badge}
                </div>
              )}
            </div>

            {description && (
              <p className="mt-3 text-[15px] leading-[23px] font-normal tracking-[-0.01em] text-[#71717A]">
                {description}
              </p>
            )}
          </div>
        </div>
      )}

      {!icon && description && !title && (
        <p className="text-[15px] leading-[23px] text-[#71717A]">
          {description}
        </p>
      )}

      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
