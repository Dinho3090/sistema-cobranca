import React from "react";
import { Calendar, UserPlus, FileText } from "lucide-react";

export function MenuInferior({ abaAtiva, setAbaAtiva }) {
  const menus = [
    { id: "hoje", label: "Hoje", icon: Calendar },
    { id: "clientes", label: "Clientes", icon: UserPlus },
    { id: "relatorio", label: "Relatório", icon: FileText },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "0",
        right: "0",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        padding: "0 24px",
        pointerEvents: "none", // Não bloqueia cliques fora do menu
      }}
    >
      <nav
        className="bg-slate-900 shadow-2xl border border-white/10"
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "12px 8px",
          borderRadius: "32px",
          pointerEvents: "auto", // Permite cliques no menu
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {menus.map((item) => {
          const isActive = abaAtiva === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setAbaAtiva(item.id)}
              className="relative flex flex-col items-center justify-center flex-1 transition-all duration-300"
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: isActive ? "#60a5fa" : "#94a3b8",
                transform: isActive
                  ? "scale(1.1) translateY(-2px)"
                  : "scale(1)",
              }}
            >
              <item.icon size={22} strokeWidth={isActive ? 3 : 2} />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "900",
                  marginTop: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "-0.025em",
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                {item.label}
              </span>

              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-6px",
                    width: "4px",
                    height: "4px",
                    backgroundColor: "#60a5fa",
                    borderRadius: "50%",
                    boxShadow: "0 0 8px #60a5fa",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
