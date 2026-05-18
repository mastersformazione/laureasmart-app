"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, MapPin, TrendingUp } from "lucide-react";

type ProfileSummaryCardProps = {
  corsoAttuale?: string;
  ateneoAttuale?: string;
  categoriaAteneo?: string;
  modalitaStudio?: string;
  cfuConseguiti?: string | number;
  cfuTotali?: string | number;
  esamiMancanti?: string | number;
  traguardoStimato?: string;
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
  onEdit,
}: ProfileSummaryCardProps) {
  const hasCfu =
    cfuConseguiti !== undefined &&
    cfuConseguiti !== "" &&
    cfuTotali !== undefined &&
    cfuTotali !== "";

  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, rgba(31,111,178,0.92), rgba(15,35,58,0.96))",
        border: "1px solid rgba(147,197,253,0.28)",
        borderRadius: 22,
        padding: 16,
        color: "#ffffff",
        boxShadow: "0 20px 45px rgba(0,0,0,0.22)",
      }}
    >
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
              margin: "0 0 6px",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "#bfdbfe",
              fontWeight: 900,
            }}
          >
            Riepilogo percorso
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: 19,
              lineHeight: 1.2,
              fontWeight: 950,
            }}
          >
            {corsoAttuale || "Percorso universitario da completare"}
          </h2>

          {ateneoAttuale && (
            <p
              style={{
                margin: "7px 0 0",
                color: "#dbeafe",
                fontSize: 12,
                lineHeight: 1.45,
              }}
            >
              {ateneoAttuale}
            </p>
          )}
        </div>

        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 15,
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <GraduationCap size={22} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginTop: 14,
        }}
      >
        <MiniInfo
          icon={<BookOpen size={15} />}
          label="CFU"
          value={hasCfu ? `${cfuConseguiti}/${cfuTotali}` : "Da indicare"}
        />

        <MiniInfo
          icon={<TrendingUp size={15} />}
          label="Esami"
          value={
            esamiMancanti !== undefined && esamiMancanti !== ""
              ? `${esamiMancanti} mancanti`
              : "Da indicare"
          }
        />

        <MiniInfo
          icon={<MapPin size={15} />}
          label="Modalità"
          value={modalitaStudio || "Da indicare"}
        />

        <MiniInfo
          icon={<GraduationCap size={15} />}
          label="Traguardo"
          value={traguardoStimato || "Da stimare"}
        />
      </div>

      {(categoriaAteneo || modalitaStudio) && (
        <p
          style={{
            margin: "12px 0 0",
            color: "#bfdbfe",
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          {categoriaAteneo ? `Categoria: ${categoriaAteneo}. ` : ""}
          {modalitaStudio ? `Studio: ${modalitaStudio}.` : ""}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 8,
          marginTop: 14,
        }}
      >
        <Link
          href="/dashboard/percorso-smart"
          style={{
            border: "none",
            borderRadius: 14,
            padding: "12px 14px",
            background: "#ffffff",
            color: "#1F6FB2",
            textAlign: "center",
            fontWeight: 900,
            fontSize: 13,
            textDecoration: "none",
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
              borderRadius: 14,
              padding: "12px 14px",
              background: "rgba(255,255,255,0.08)",
              color: "#ffffff",
              textAlign: "center",
              fontWeight: 900,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Modifica dati percorso
          </button>
        )}
      </div>
    </section>
  );
}

function MiniInfo({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "rgba(15,23,42,0.25)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 16,
        padding: 10,
        minHeight: 62,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          color: "#bfdbfe",
          fontSize: 11,
          fontWeight: 900,
          marginBottom: 6,
        }}
      >
        {icon}
        {label}
      </div>

      <div
        style={{
          color: "#ffffff",
          fontSize: 13,
          fontWeight: 900,
          lineHeight: 1.25,
        }}
      >
        {value}
      </div>
    </div>
  );
}
