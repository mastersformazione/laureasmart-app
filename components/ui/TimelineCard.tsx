"use client";

type Props = {
  items: {
    periodo: string;
    testo: string;
  }[];
};

export default function TimelineCard({ items }: Props) {
  return (
    <div className="rounded-[28px] border border-[rgba(31,111,178,0.10)] bg-white p-5 shadow-[0_14px_36px_rgba(31,111,178,0.10)]">
      <h3 className="text-xl font-extrabold text-[#102033]">
        Timeline realistica
      </h3>

      <div className="mt-5 grid gap-4">
        {items.map((item) => (
          <div key={item.periodo} className="flex gap-3">
            <div className="mt-1 h-4 w-4 rounded-full bg-[#1F6FB2]" />

            <div>
              <p className="text-sm font-extrabold text-[#1F6FB2]">
                {item.periodo}
              </p>
              <p className="mt-1 text-sm leading-5 text-[#71717A]">
                {item.testo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
