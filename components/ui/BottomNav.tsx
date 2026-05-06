"use client";

import { Home, Bell, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const items = [
  {
    label: "Home",
    icon: Home,
    path: "/dashboard",
  },
  {
    label: "Notifiche",
    icon: Bell,
    path: "/dashboard/notifiche",
  },
  {
    label: "Profilo",
    icon: User,
    path: "/dashboard/profilo",
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
        height: 78,
        background: "#FFFFFF",
        borderTop: "1px solid #E4E4E7",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 50,
        paddingBottom: 8,
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
              gap: 5,
              color: active ? "#FFFFFF" : "#09090B",
              cursor: "pointer",
              minWidth: 76,
            }}
          >
            <div
              style={{
                width: 48,
                height: 42,
                borderRadius: 12,
                background: active ? "#09090B" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={22} strokeWidth={2.4} />
            </div>

            <span
              style={{
                fontSize: 11,
                fontWeight: active ? 700 : 500,
                color: active ? "#09090B" : "#52525B",
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
