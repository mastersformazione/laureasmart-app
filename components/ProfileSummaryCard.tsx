"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, MapPin, TrendingUp } from "lucide-react";
import { getSmartTheme, type SmartTone } from "@/components/ui/cardThemes";

type ProfileSummaryCardProps = {
  corsoAttuale?: string;
  ateneoAttuale?: string;
  categoriaAteneo?: string;
  modalitaStudio?: string;
  cfuConseguiti?: string | number;
  cfuTotali?: string | number;
  esamiMancanti?: string | number;
  traguardoStimato?: string;
  tone?: SmartTone;
  onEdit?: () => void;
};

export default function ProfileSummaryCard({
  corsoAttuale,
  ateneoAttuale,
  categoriaAteneo,
  modalitaStudio,
  cfuConseguiti,
  cfuTotali,
  esamiMancanti,
  traguardoStimato,
  tone = "green",
  onEdit,
}: ProfileSummaryCardProps) {
  const theme = getSmartTheme(tone);
  const hasCfu =
    cfuConseguiti !== undefined &&
    cfuConseguiti !== "" &&
    cfuTotali !== undefined &&
    cfuTotali !== "";

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: theme.bgStrong,
        border: `1px solid ${theme.borderStrong}`,
        borderRadius: 28,
        padding: 17,
        color: "#ffffff",
        boxShadow: theme.shadow,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -44,
          top: -48,
          width: 160,
          height: 160,
          borderRadius: 999,
          background: "rgba(255,255,255,0.14)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: "rgba(255,255,255,0.86)",
          boxShadow: "0 0 24px rgba(255,255,255,0.18)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 7px",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                color: "rgba(255,255,255,0.76)",
                fontWeight: 950,
              }}
            >
              Riepilogo percorso
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: 20,
                lineHeight: 1.16,
                fontWeight: 950,
                letterSpacing: "-0.03em",
              }}
            >
              {corsoAttuale || "Percorso universitario da completare"}
            </h2>

            {ateneoAttuale && (
              <p
                style={{
                  margin: "8px 0 0",
                  color: "rgba(255,255,255,0.86)",
                  fontSize: 12.5,
                  lineHeight: 1.45,
                }}
              >
                {ateneoAttuale}
              </p>
            )}
          </div>

          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 17,
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <GraduationCap size={24} />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 15,
          }}
        >
          <MiniInfo icon={<BookOpen size={15} />} label="CFU" value={hasCfu ? `${cfuConseguiti}/${cfuTotali}` : "Da indicare"} />
          <MiniInfo icon={<TrendingUp size={15} />} label="Esami" value={esamiMancanti !== undefined && esamiMancanti !== "" ? `${esamiMancanti} mancanti` : "Da indicare"} />
          <MiniInfo icon={<MapPin size={15} />} label="Modalità" value={modalitaStudio || "Da indicare"} />
          <MiniInfo icon={<GraduationCap size={15} />} label="Traguardo" value={traguardoStimato || "Da stimare"} />
        </div>

        {(categoriaAteneo || modalitaStudio) && (
          <p
            style={{
              margin: "13px 0 0",
              color: "rgba(255,255,255,0.78)",
              fontSize: 11.5,
              lineHeight: 1.5,
              fontWeight: 750,
            }}
          >
            {categoriaAteneo ? `Categoria: ${categoriaAteneo}. ` : ""}
            {modalitaStudio ? `Studio: ${modalitaStudio}.` : ""}
          </p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: onEdit ? "1fr" : "1fr", gap: 8, marginTop: 14 }}>
          <Link
            href="/dashboard/percorso-smart"
            style={{
              border: "none",
              borderRadius: 17,
              padding: "13px 14px",
              background: "#ffffff",
              color: "#1F6FB2",
              textAlign: "center",
              fontWeight: 950,
              fontSize: 13,
              textDecoration: "none",
              boxShadow: "0 12px 28px rgba(0,0,0,0.14)",
            }}
          >
            Apri Percorso Smart →
          </Link>

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              style={{
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 17,
                padding: "13px 14px",
                background: "rgba(255,255,255,0.10)",
                color: "#ffffff",
                textAlign: "center",
                fontWeight: 950,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Modifica dati percorso
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function MiniInfo({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div
      style={{
        background: "rgba(15,23,42,0.24)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 17,
        padding: 10,
        minHeight: 64,
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          color: "rgba(255,255,255,0.76)",
          fontSize: 11,
          fontWeight: 950,
          marginBottom: 6,
        }}
      >
        {icon}
        {label}
      </div>

      <div style={{ color: "#ffffff", fontSize: 13, fontWeight: 950, lineHeight: 1.25 }}>
        {value}
      </div>
    </div>
  );
}
