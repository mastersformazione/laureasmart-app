"use client";

import { Home, ClipboardList, MessageCircle, User } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

import NavIcon from "@/components/ui/NavIcon";

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
    label: "Profilo",
    icon: User,
    path: "/dashboard/profilo",
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
        const active =
          pathname === item.path ||
          (item.path !== "/dashboard" && pathname.startsWith(item.path));

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
              minWidth: 70,
            }}
          >
            <NavIcon active={active}>
              <Icon size={22} strokeWidth={2.4} />
            </NavIcon>

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
