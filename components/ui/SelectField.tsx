"use client";

type SelectOption = {
  value: string;
  label: string;
};

export default function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label
        style={{
          fontSize: 14,
          fontWeight: 850,
          color: "#FFFFFF",
          lineHeight: 1.35,
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            minHeight: 58,
            appearance: "none",
            WebkitAppearance: "none",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.07)",
            color: "#FFFFFF",
            padding: "0 48px 0 18px",
            fontSize: 15,
            fontWeight: 850,
            fontFamily: "inherit",
            outline: "none",
            boxShadow: "0 10px 24px rgba(0,0,0,0.14)",
          }}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              style={{
                background: "#102033",
                color: "#FFFFFF",
              }}
            >
              {option.label}
            </option>
          ))}
        </select>

        <span
          style={{
            position: "absolute",
            right: 18,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#78C2FF",
            fontSize: 18,
            fontWeight: 900,
            pointerEvents: "none",
          }}
        >
          ▼
        </span>
      </div>
    </div>
  );
}
