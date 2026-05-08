"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CompatibilityScore from "@/components/ui/CompatibilityScore";
import StressIndicator from "@/components/ui/StressIndicator";
import WeeklyPlan from "@/components/ui/WeeklyPlan";
import TimelineCard from "@/components/ui/TimelineCard";

type Props = {
  compatibilita: number;
  stress: "Basso" | "Moderato" | "Alto";
  stressText: string;
  strategia: string[];
  settimana: string[];
  rassicurazione: string;
  timeline: {
    periodo: string;
    testo: string;
  }[];
  onRestart: () => void;
  onContact: () => void;
};

export default function SimulationResult({
  compatibilita,
  stress,
  stressText,
  strategia,
  settimana,
  rassicurazione,
  timeline,
  onRestart,
  onContact,
}: Props) {
  return (
    <div className="space-y-5">
      <CompatibilityScore value={compatibilita} />

      <StressIndicator livello={stress} testo={stressText} />

      <WeeklyPlan items={settimana} />

      <Card title="Strategia consigliata" badge="Piano">
        <div className="grid gap-3">
          {strategia.map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-[rgba(31,111,178,0.08)] px-4 py-3 text-sm font-bold text-[#102033]"
            >
              ✅ {item}
            </div>
          ))}
        </div>
      </Card>

      <TimelineCard items={timeline} />

      <Card title="La cosa importante" description={rassicurazione} />

      <Button
        label="Parla gratis con un orientatore"
        variant="primary"
        onClick={onContact}
      />

      <button
        onClick={onRestart}
        className="w-full rounded-2xl bg-white px-4 py-4 text-base font-semibold text-[#102033] shadow-[0_8px_22px_rgba(31,111,178,0.08)] active:scale-[0.98]"
      >
        Modifica simulazione
      </button>
    </div>
  );
}
