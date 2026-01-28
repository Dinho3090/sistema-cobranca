import React from "react";
import {
  Calendar,
  MapPin,
  Trash2,
  MessageCircle,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
export function CardCliente({
  item,
  hojeData,
  isFinalizando,
  onPagar,
  onExcluir,
  editandoId,
  setEditandoId,
  valorTemporario,
  setValorTemporario,
  novaDataTemporaria,
  setNovaDataTemporaria,
  salvarNovoValor,
}) {
  const verificarAtraso = (dataCobrancaISO) => {
    if (!dataCobrancaISO) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataCobranca = new Date(dataCobrancaISO);
    return dataCobranca < hoje;
  };
  const atrasado = verificarAtraso(item.dataProximaCobranca);

  // Lógica de tempo
  // --- DEFINIÇÃO DAS CORES E STATUS ---
  const dataCobranca = item.dataProximaCobranca;
  const estaAtrasado = dataCobranca < hojeData;
  const eHoje = dataCobranca === hojeData;
  const estaRemarcado = dataCobranca > hojeData;

  let corPrincipal, corFundo, corTexto, statusTexto;

  if (estaAtrasado) {
    corPrincipal = "#ef4444"; // Vermelho
    corFundo = "#fee2e2"; // Vermelho claro
    corTexto = "#991b1b"; // Vinho
    statusTexto = "⚠️ ATRASADO";
  } else if (eHoje) {
    corPrincipal = "#facc15"; // Amarelo
    corFundo = "#fefce8"; // Amarelo claro
    corTexto = "#854d0e"; // Marrom
    statusTexto = "📅 HOJE";
  } else {
    corPrincipal = "#f97316"; // Laranja
    corFundo = "#fff7ed"; // Laranja claro
    corTexto = "#9a3412"; // Laranja escuro
    statusTexto = "🕒 REMARCADO";
  }

  // FUNÇÃO DE RECIBO - Agora integrada ao clique do botão
  const enviarComprovante = () => {
    const mensagem = window.encodeURIComponent(
      `*RECIBO DE PAGAMENTO* 📄\n\n` +
        `Olá, *${item.nome}*!\n` +
        `Confirmamos o recebimento da parcela de hoje.\n\n` +
        `💰 *Valor pago:* R$ ${Number(item.valorParcela).toFixed(2)}\n` +
        `📅 *Data:* ${new Date().toLocaleDateString("pt-BR")}\n` +
        `✅ *Status:* Parcela Baixada\n\n` +
        `Obrigado! 🙏`,
    );

    const fone = item.telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${fone}?text=${mensagem}`, "_blank");
  };

  const cardStyle = {
    backgroundColor: isFinalizando ? "#f0fdf4" : atrasado ? "#fff1f2" : "white",
    padding: "20px",
    borderRadius: "28px",
    marginBottom: "16px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    // Borda esquerda vermelha se estiver atrasado
    borderLeft: `8px solid ${isFinalizando ? "#22c55e" : atrasado ? "#ef4444" : "#3b82f6"}`,
    transition: "all 0.4s ease",
    opacity: isFinalizando ? 0.8 : 1,
    transform: isFinalizando ? "scale(0.98)" : "scale(1)",
    position: "relative", // Necessário para posicionar o alerta
  };

  return (
    <div style={cardStyle}>
      {/* CONTAINER PRINCIPAL DO CARD (A BASE) */}
      <div
        style={{
          backgroundColor: corFundo, // Fundo muda conforme status (Vermelho, Amarelo ou Laranja)
          borderRadius: "24px",
          padding: "16px",
          marginBottom: "16px",
          borderLeft: `10px solid ${corPrincipal}`, // Borda grossa lateral para bater o olho rápido
          border: `1px solid ${corPrincipal}33`,
          transition: "all 0.3s ease",
          boxShadow: estaAtrasado
            ? "0 4px 12px rgba(239, 68, 68, 0.2)"
            : "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        {/* HEADER DO CARD */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <span
                style={{
                  fontSize: "9px",
                  backgroundColor: corPrincipal,
                  color: "white",
                  width: "fit-content",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                }}
              >
                {item.produto || "Venda Geral"}
              </span>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "900",
                    color: corTexto,
                  }}
                >
                  {item.nome}
                </span>

                {!isFinalizando && (
                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "12px",
                      color: "white",
                      backgroundColor: corPrincipal,
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontWeight: "900",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {/* AQUI USAMOS O ESTA REMARCADO PARA TIRAR O AVISO */}
                    {estaAtrasado && "⚠️ VENCEU: "}
                    {eHoje && "📅 HOJE: "}
                    {estaRemarcado && "🕒 REMARCADO: "}

                    {item.dataProximaCobranca?.split("-").reverse().join("/")}
                  </div>
                )}
              </div>
            </div>

            <p
              style={{
                fontSize: "12px",
                color: corTexto, // Texto da rota na cor do tema
                display: "flex",
                alignItems: "center",
                marginTop: "6px",
                fontWeight: "500",
                opacity: 0.8,
              }}
            >
              <MapPin
                size={14}
                style={{ marginRight: "4px", color: corPrincipal }}
              />
              {item.rota} • {item.endereco}
            </p>

            {/* PRÓXIMA DATA EM DESTAQUE */}
            {!isFinalizando && (
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "12px",
                  color: "white",
                  backgroundColor: corPrincipal,
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontWeight: "900",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {/* AGORA USAMOS A VARIÁVEL AQUI PARA SUMIR O ERRO */}
                <span>{statusTexto}</span>

                <span style={{ marginLeft: "4px", opacity: 0.9 }}>
                  {item.dataProximaCobranca?.split("-").reverse().join("/")}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (window.confirm("Excluir este cliente?")) onExcluir(item.id);
            }}
            style={{
              background: "white",
              border: "none",
              color: corPrincipal,
              padding: "8px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* ALERTA DE QUEM NÃO PAGA (ENROLADOR) */}
        {Number(item.totalPago || 0) <= 0 && (
          <div
            style={{
              marginTop: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              padding: "8px",
              borderRadius: "12px",
              border: `1px dashed ${corPrincipal}`,
              textAlign: "center",
              fontSize: "11px",
              fontWeight: "bold",
              color: "#991b1b",
            }}
          >
            🚨 ATENÇÃO: NENHUM PAGAMENTO REALIZADO AINDA
          </div>
        )}

        {/* ... O restante do seu código de VALORES vem aqui embaixo ... */}
      </div>

      {/* INFO DE VALORES */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "15px",
          padding: "12px",
          backgroundColor: corFundo, // Fundo leve da cor do status
          borderRadius: "18px",
          border: `1px solid ${corPrincipal}22`, // Borda bem clarinha da cor do status
        }}
      >
        {/* Aqui continuaria o restante do seu código de valores... */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "800",
              color: "#94a3b8",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Parcela
          </p>
          {editandoId === item.id ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: "10px",
              }}
            >
              <label
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: "#64748b",
                }}
              >
                VALOR DA PARCELA (OPCIONAL):
              </label>
              <input
                type="number"
                step="any"
                placeholder="Deixe vazio para manter o atual"
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  border: "2px solid #3b82f6",
                }}
                value={valorTemporario}
                onChange={(e) => setValorTemporario(e.target.value)}
              />

              <label
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: "#64748b",
                }}
              >
                REMARCAR PARA:
              </label>
              <input
                type="date"
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  border: "2px solid #3b82f6",
                }}
                value={novaDataTemporaria}
                onChange={(e) => setNovaDataTemporaria(e.target.value)}
              />

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => salvarNovoValor(item.id)}
                  style={{
                    flex: 2,
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  SALVAR
                </button>
                <button
                  onClick={() => setEditandoId(null)}
                  style={{
                    flex: 1,
                    backgroundColor: "#f1f5f9",
                    color: "#64748b",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "900",
                  color: "#1d4ed8",
                  margin: "2px 0",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setEditandoId(item.id);
                  setValorTemporario("");
                  setNovaDataTemporaria(item.dataProximaCobranca);
                }}
              >
                R$ {Number(item.valorParcela || 0).toFixed(2)}
              </p>

              {/* NOVO BOTÃO DE REMARCAR */}
              <button
                onClick={() => {
                  setEditandoId(item.id);
                  setValorTemporario("");
                  setNovaDataTemporaria(item.dataProximaCobranca);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  backgroundColor: "#eff6ff",
                  color: "#3b82f6",
                  border: "1px dashed #3b82f6",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  width: "fit-content",
                }}
              >
                <Calendar size={14} />
                REMARCAR DATA
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            textAlign: "right",
            borderLeft: "1px solid #e2e8f0",
            paddingLeft: "15px",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: "800",
              color: "#94a3b8",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Total Restante
          </p>
          <p
            style={{
              fontSize: "18px",
              fontWeight: "900",
              color: "#1d4ed8",
              margin: "2px 0",
            }}
          >
            R${" "}
            {(
              Number(item.valorParcela || 0) * Number(item.qtdParcelas || 0)
            ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* BOTÕES DE AÇÃO - LÓGICA ATUALIZADA */}
      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <a
          href={`https://wa.me/55${item.telefone?.replace(/\D/g, "")}`}
          style={{
            flex: 1,
            backgroundColor: "#dcfce7",
            color: "#15803d",
            textDecoration: "none",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "13px",
            height: "48px",
          }}
        >
          <MessageCircle size={18} style={{ marginRight: "6px" }} /> WhatsApp
        </a>

        <button
          onClick={() => (isFinalizando ? enviarComprovante() : onPagar(item))}
          style={{
            flex: 1.5,
            backgroundColor: isFinalizando ? "#10b981" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "16px",
            fontWeight: "900",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            boxShadow: isFinalizando
              ? "none"
              : "0 8px 15px rgba(37, 99, 235, 0.2)",
            cursor: "pointer",
            height: "48px",
          }}
        >
          {isFinalizando ? (
            <>
              <MessageCircle size={18} /> ENVIAR RECIBO
            </>
          ) : (
            <>
              <DollarSign size={18} /> BAIXAR PARCELA
            </>
          )}
        </button>
      </div>
    </div>
  );
}
