"use client";

import Card from "@/components/ui/Card";

type Option = {
  label: string;
  value: string;
};

type Props = {
  domanda: string;
  descrizione?: string;
  options?: Option[];
  onSelect: (value: string) => void;
};

export default function QuizCard({
  domanda,
  descrizione,
  options = [],
  onSelect,
}: Props) {
  return (
    <Card title={domanda} description={descrizione}>
      <div className="grid gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className="
              w-full
              rounded-[22px]
              border
              border-[rgba(31,111,178,0.12)]
              bg-white
              px-4
              py-[18px]
              text-left
              text-[15px]
              font-bold
              text-[#102033]
              shadow-[0_8px_22px_rgba(31,111,178,0.06)]
              transition-all
              duration-200
              active:scale-[0.985]
              hover:border-[#1F6FB2]
              hover:bg-[#F8FBFF]
            "
          >
            {option.label}
          </button>
        ))}
      </div>
    </Card>
  );
}
