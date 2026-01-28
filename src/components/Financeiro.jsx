import React from "react";
import {
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  DollarSign,
} from "lucide-react";

export function Financeiro({
  totalRecebido = 0,
  totalPendente = 0,
  capitalNaRua = 0,
  qtdClientes = 0,
}) {
  const format = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(val) || 0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "16px",
        paddingBottom: "120px",
        backgroundColor: "#F8FAFC",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER ESTILO GLASS */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
          border: "1px solid #f1f5f9",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "900",
              color: "#1e293b",
              margin: 0,
              letterSpacing: "-1px",
            }}
          >
            Dashboard
          </h2>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "800",
              color: "#94a3b8",
              textTransform: "uppercase",
              margin: "2px 0 0 0",
              letterSpacing: "1px",
            }}
          >
            Visão Geral
          </p>
        </div>
        <div
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            padding: "12px",
            borderRadius: "18px",
            color: "white",
            boxShadow: "0 8px 15px rgba(99, 102, 241, 0.3)",
          }}
        >
          <TrendingUp size={22} />
        </div>
      </div>

      {/* CARD PRINCIPAL - RECEBIDO HOJE (GRADIENTE VIBRANTE) */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "40px",
          padding: "32px",
          background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
          boxShadow: "0 20px 30px -10px rgba(16, 185, 129, 0.4)",
          color: "white",
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              width: "fit-content",
              padding: "6px 14px",
              borderRadius: "100px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <DollarSign size={14} />
            <span
              style={{
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Recebido Hoje
            </span>
          </div>
          <h3
            style={{
              fontSize: "40px",
              fontWeight: "900",
              margin: 0,
              letterSpacing: "-2px",
            }}
          >
            {format(totalRecebido)}
          </h3>
          <p
            style={{
              fontSize: "12px",
              marginTop: "8px",
              opacity: 0.9,
              fontWeight: "500",
            }}
          >
            Seu fluxo está saudável!
          </p>
        </div>
        {/* Detalhe Decorativo de Fundo */}
        <div
          style={{
            position: "absolute",
            top: "-30px",
            right: "-30px",
            width: "150px",
            height: "150px",
            background: "white",
            opacity: 0.15,
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        ></div>
      </div>

      {/* GRID DE CARDS MÉDIOS */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        {/* CARD CLIENTES */}
        <div
          style={{
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            padding: "24px",
            borderRadius: "32px",
            color: "white",
            boxShadow: "0 15px 20px -5px rgba(59, 130, 246, 0.3)",
          }}
        >
          <Users size={24} style={{ marginBottom: "12px", opacity: 0.8 }} />
          <p
            style={{
              fontSize: "10px",
              fontWeight: "800",
              textTransform: "uppercase",
              margin: 0,
              opacity: 0.8,
            }}
          >
            Clientes
          </p>
          <p
            style={{ fontSize: "26px", fontWeight: "900", margin: "4px 0 0 0" }}
          >
            {qtdClientes}
          </p>
        </div>

        {/* CARD PENDENTES */}
        <div
          style={{
            background: "linear-gradient(135deg, #f43f5e, #e11d48)",
            padding: "24px",
            borderRadius: "32px",
            color: "white",
            boxShadow: "0 15px 20px -5px rgba(244, 63, 94, 0.3)",
          }}
        >
          <Clock size={24} style={{ marginBottom: "12px", opacity: 0.8 }} />
          <p
            style={{
              fontSize: "10px",
              fontWeight: "800",
              textTransform: "uppercase",
              margin: 0,
              opacity: 0.8,
            }}
          >
            Pendentes
          </p>
          <p
            style={{ fontSize: "26px", fontWeight: "900", margin: "4px 0 0 0" }}
          >
            {format(totalPendente).replace("R$", "")}
          </p>
        </div>
      </div>

      {/* CARD CAPITAL NA RUA (DARK MODE) */}
      <div
        style={{
          backgroundColor: "#0f172a",
          padding: "28px",
          borderRadius: "38px",
          color: "white",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          border: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#1e293b",
              padding: "8px",
              borderRadius: "10px",
            }}
          >
            <TrendingUp size={16} color="#38bdf8" />
          </div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "900",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Capital na Rua
          </span>
        </div>
        <h3 style={{ fontSize: "30px", fontWeight: "900", margin: 0 }}>
          {format(capitalNaRua)}
        </h3>
        <p
          style={{
            fontSize: "11px",
            color: "#475569",
            marginTop: "10px",
            fontWeight: "500",
          }}
        >
          Total investido em {qtdClientes} clientes ativos.
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            padding: "10px 14px",
            borderRadius: "12px",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <CheckCircle2 size={14} color="#10b981" />
          <span
            style={{
              color: "#10b981",
              fontSize: "10px",
              fontWeight: "900",
              textTransform: "uppercase",
            }}
          >
            Sistema Sincronizado
          </span>
        </div>
      </div>
    </div>
  );
}
