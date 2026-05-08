"use client";

type Props = {
  value: number;
};

export default function CompatibilityScore({ value }: Props) {
  return (
    <div className="rounded-[28px] border border-[rgba(31,111,178,0.10)] bg-white p-5 shadow-[0_14px_36px_rgba(31,111,178,0.10)]">
      <p className="text-sm font-bold text-[#71717A]">
        Compatibilità con la tua vita reale
      </p>

      <div className="mt-3 flex items-end gap-2">
        <span className="text-[48px] font-extrabold leading-none text-[#1F6FB2]">
          {value}
        </span>
        <span className="mb-1 text-xl font-bold text-[#1F6FB2]">%</span>
      </div>

      <div className="mt-4 h-3 rounded-full bg-[rgba(31,111,178,0.10)]">
        <div
          className="h-3 rounded-full bg-[#1F6FB2]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
