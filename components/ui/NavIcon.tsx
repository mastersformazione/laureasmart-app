"use client";

type Props = {
  active?: boolean;
  children: React.ReactNode;
};

export default function NavIcon({ active = false, children }: Props) {
  return (
    <div
      style={{
        width: 52,
        height: 42,
        borderRadius: 14,
        background: active ? "#1F6FB2" : "#EEF4FA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "0.2s",
        color: active ? "#FFFFFF" : "#1F6FB2",
      }}
    >
      {children}
    </div>
  );
}
