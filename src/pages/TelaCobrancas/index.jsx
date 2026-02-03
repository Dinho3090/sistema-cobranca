import React from "react";
import { CardCliente } from "../../components/CardCliente";
import { formatCurrency } from "../../utils/formatters";
import "./TelaCobrancas.css";

export function TelaCobrancas({ clientes, onEditar }) {
  const hoje = new Date().toLocaleDateString("en-CA"); // Retorna YYYY-MM-DD de forma confiável

  // 1. FILTRO HOJE: Aparece se a data for hoje E ainda deve dinheiro
  const cobrancasHoje = clientes.filter((c) => {
    const saldo = (c.valorTotalContrato || 0) - (c.totalPago || 0);
    return c.dataProximaCobranca === hoje && saldo > 0;
  });

  // 2. FILTRO ATRASADOS: Aparece se a data já passou E ainda deve dinheiro
  const atrasados = clientes.filter((c) => {
    const saldo = (c.valorTotalContrato || 0) - (c.totalPago || 0);
    return c.dataProximaCobranca < hoje && saldo > 0;
  });

  // Cálculo do total que falta receber (apenas dos atrasados)
  const totalAtrasado = atrasados.reduce((acc, c) => {
    return acc + ((c.valorTotalContrato || 0) - (c.totalPago || 0));
  }, 0);

  return (
    <div className="cobrancas-container">
      <header className="cobrancas-header">
        <h2>📅 Agenda de Cobranças</h2>
        <div className="resumo-atraso">
          <span>Total em Atraso:</span>
          <strong className="valor-atrasado">
            {formatCurrency(totalAtrasado)}
          </strong>
        </div>
      </header>

      <section className="cobrancas-section">
        <h3 className="status-title hoje">🔔 Cobranças de Hoje</h3>
        <div className="lista-cards">
          {cobrancasHoje.length > 0 ? (
            cobrancasHoje.map((c) => (
              <CardCliente key={c.id} item={c} onEditar={onEditar} />
            ))
          ) : (
            <p className="empty-msg">Nenhuma cobrança para hoje.</p>
          )}
        </div>
      </section>

      <hr className="divider" />

      <section className="cobrancas-section">
        <h3 className="status-title atraso">⚠️ Clientes em Atraso</h3>
        <div className="lista-cards">
          {atrasados.length > 0 ? (
            atrasados.map((c) => (
              <CardCliente key={c.id} item={c} onEditar={onEditar} />
            ))
          ) : (
            <p className="empty-msg">Nenhum cliente em atraso. Bom trabalho!</p>
          )}
        </div>
      </section>
    </div>
  );
}
