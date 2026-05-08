"use client";

type Props = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: Props) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-bold text-[#1F6FB2]">
          Domanda {current} di {total}
        </span>
        <span className="font-semibold text-[#71717A]">{percentage}%</span>
      </div>

      <div className="h-3 w-full rounded-full bg-[rgba(31,111,178,0.10)]">
        <div
          className="h-3 rounded-full bg-[#1F6FB2] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
