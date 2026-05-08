"use client";

type Props = {
  livello: "Basso" | "Moderato" | "Alto";
  testo: string;
};

export default function StressIndicator({ livello, testo }: Props) {
  return (
    <div className="rounded-[28px] border border-[rgba(31,111,178,0.10)] bg-white p-5 shadow-[0_14px_36px_rgba(31,111,178,0.10)]">
      <p className="text-sm font-bold text-[#71717A]">Carico previsto</p>

      <h3 className="mt-2 text-2xl font-extrabold text-[#102033]">{livello}</h3>

      <p className="mt-3 text-[15px] leading-6 text-[#71717A]">{testo}</p>
    </div>
  );
}
