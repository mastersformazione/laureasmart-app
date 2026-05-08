"use client";

type Props = {
  items: string[];
};

export default function WeeklyPlan({ items }: Props) {
  return (
    <div className="rounded-[28px] border border-[rgba(31,111,178,0.10)] bg-white p-5 shadow-[0_14px_36px_rgba(31,111,178,0.10)]">
      <h3 className="text-xl font-extrabold text-[#102033]">
        La tua settimana tipo
      </h3>

      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-[rgba(31,111,178,0.08)] px-4 py-3 text-sm font-bold text-[#102033]"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
