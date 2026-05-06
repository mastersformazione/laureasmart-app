"use client";

import { Home, ClipboardList, MessageCircle } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

const items = [
  {
    label: "Home",
    icon: Home,
    path: "/dashboard",
  },
  {
    label: "Orientamento",
    icon: ClipboardList,
    path: "/dashboard/orientamento",
  },
  {
    label: "Contatti",
    icon: MessageCircle,
    path: "/dashboard/contatti",
  },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        left: "50%",
        bottom: 0,
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        height: 84,
        background: "#FFFFFF",
        borderTop: "1px solid #E4E4E7",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.06)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 999,
        paddingBottom: 10,
      }}
    >
      {items.map((item) => {
        const active = pathname === item.path;
        const Icon = item.icon;

        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            style={{
              border: "none",
              background: "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              cursor: "pointer",
              minWidth: 78,
            }}
          >
            <div
              style={{
                width: 52,
                height: 42,
                borderRadius: 14,
                background: active ? "#09090B" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "0.2s",
                color: active ? "#FFFFFF" : "#09090B",
              }}
            >
              <Icon size={22} strokeWidth={2.4} />
            </div>

            <span
              style={{
                fontSize: 11,
                fontWeight: active ? 700 : 500,
                color: active ? "#09090B" : "#71717A",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
