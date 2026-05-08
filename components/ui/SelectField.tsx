"use client";

type Option = {
  value: string;
  label: string;
};

type Props = {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export default function SelectField({
  label,
  value,
  options,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-bold text-[#102033]">{label}</label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full
            h-[52px]
            rounded-[20px]
            border
            border-[rgba(31,111,178,0.12)]
            bg-white
            px-4
            pr-11
            text-[14px]
            font-semibold
            text-[#102033]
            outline-none
            appearance-none
            shadow-[0_10px_28px_rgba(31,111,178,0.06)]
            transition
            focus:border-[#1F6FB2]
            focus:shadow-[0_12px_30px_rgba(31,111,178,0.14)]
          "
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div
          className="
            pointer-events-none
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-[#1F6FB2]
            text-sm
            font-bold
          "
        >
          ▼
        </div>
      </div>
    </div>
  );
}
