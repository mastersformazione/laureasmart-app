"use client";

export default function AppBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #163A63 0%, #0B1728 38%, #07111F 100%)",
        color: "#FFFFFF",
      }}
    >
      {children}
    </main>
  );
}
