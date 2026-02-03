import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./Dashboard.css";

export function Dashboard({ clientes = [] }) {
  const dataExibicao = new Date().toLocaleDateString("pt-BR");
  const hojeISO = new Date().toISOString().split("T")[0];

  const converter = (v) => {
    if (typeof v === "number") return v;
    if (!v) return 0;
    const n = parseFloat(
      String(v)
        .replace(/[R$\s.]/g, "")
        .replace(",", "."),
    );
    return isNaN(n) ? 0 : n;
  };

  // 1. Cálculos Financeiros
  const total = clientes.reduce(
    (acc, c) => acc + converter(c.valorTotalContrato),
    0,
  );
  const recebido = clientes.reduce((acc, c) => acc + converter(c.totalPago), 0);
  const falta = Math.max(0, total - recebido);
  const porcentagem = total > 0 ? (recebido / total) * 100 : 0;

  // 2. Filtrando Clientes Atrasados (USANDO A VARIÁVEL)
  const clientesAtrasados = clientes.filter((c) => {
    const saldoDevedor =
      converter(c.valorTotalContrato) - converter(c.totalPago);
    const dataCobranca = c.dataProximaCobranca || "";
    return dataCobranca !== "" && dataCobranca < hojeISO && saldoDevedor > 0;
  });

  // 3. Preparação dos Gráficos
  const produtosAgrupados = clientes.reduce((acc, c) => {
    const nomeProd = c.produto || "Outros";
    acc[nomeProd] = (acc[nomeProd] || 0) + converter(c.valorTotalContrato);
    return acc;
  }, {});

  const dadosGraficoBarras = Object.keys(produtosAgrupados)
    .map((prod) => ({
      name: prod,
      total: produtosAgrupados[prod],
    }))
    .sort((a, b) => b.total - a.total);

  const dadosPizza = [
    { name: "Recebido", value: recebido, color: "#22c55e" },
    { name: "Falta", value: falta, color: "#64748b" },
  ];

  const f = (v) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  return (
    <div className="dash-container">
      <div className="dash-header-info">
        <h2 className="dash-title">📊 Resumo Estratégico</h2>
        <span className="dash-date">Relatório: {dataExibicao}</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card card-total">
          <span className="stat-label">Faturamento Total</span>
          <strong className="stat-number">{f(total)}</strong>
        </div>
        <div className="stat-card card-recebido">
          <span className="stat-label">Total Recebido ✅</span>
          <strong className="stat-number">{f(recebido)}</strong>
        </div>
        <div className="stat-card card-falta">
          <span className="stat-label">Saldo em Aberto</span>
          <strong className="stat-number">{f(falta)}</strong>
        </div>
      </div>

      <div className="charts-wrapper">
        <div className="chart-item">
          <h3>Saúde Financeira (%)</h3>
          <div className="chart-inner">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dadosPizza}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                  contentStyle={{
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
                    background: "#fff",
                  }}
                  formatter={(value) => [f(value), "Faturamento"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-center-label">
              <strong>{porcentagem.toFixed(0)}%</strong>
              <span>PAGO</span>
            </div>
          </div>
        </div>

        <div className="chart-item">
          <h3>Vendas por Categoria</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dadosGraficoBarras} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => f(value)}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="total" fill="#2563eb" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🚩 NOVA SEÇÃO: LISTA DE AÇÃO (Lê a variável clientesAtrasados) */}
      {clientesAtrasados.length > 0 && (
        <div className="atrasados-section">
          <h3>
            ⚠️ Atenção: {clientesAtrasados.length} cobrança(s) pendente(s)
          </h3>
          <div className="atrasados-list">
            {clientesAtrasados.map((c) => (
              <div key={c.id} className="atrasado-item">
                <span className="atrasado-nome">{c.nome}</span>
                <span className="atrasado-data">
                  Venceu em:{" "}
                  {new Date(c.dataProximaCobranca).toLocaleDateString("pt-BR")}
                </span>
                <span className="atrasado-valor">
                  {f(converter(c.valorCobranca))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
