import React from "react";
import { Search } from "lucide-react";

export function Header({ busca, setBusca }) {
  return (
    <header style={{ marginBottom: "24px" }}>
      {/* TÍTULO COM QUEBRA DE LINHA E ESTILO PESADO */}
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "900",
          color: "#1e293b",
          lineHeight: "0.9",
          letterSpacing: "-1.5px",
          margin: "0 0 20px 0",
        }}
      >
        Minhas
        <br />
        <span style={{ color: "#3b82f6" }}>Cobranças</span>
      </h1>

      {/* CONTAINER DA BUSCA */}
      <div style={{ position: "relative", width: "100%" }}>
        <Search
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
          }}
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar cliente..."
          style={{
            width: "100%",
            backgroundColor: "white",
            padding: "16px 16px 16px 48px",
            borderRadius: "20px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            outline: "none",
            fontSize: "16px",
            fontWeight: "600",
            color: "#1e293b",
            boxSizing: "border-box", // Garante que o padding não estoure a largura
          }}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
    </header>
  );
}
