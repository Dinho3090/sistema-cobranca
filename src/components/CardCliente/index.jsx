import React, { useState } from "react";
import { db } from "../../services/firebase/config";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  formatCurrency,
  moneyToNumber,
  maskMoney,
} from "../../utils/formatters";
import "./CardCliente.css";

export function CardCliente({ item, onEditar }) {
  const [valorRecebido, setValorRecebido] = useState("");
  const [carregando, setCarregando] = useState(false);

  const saldoDevedor = item.valorTotalContrato - (item.totalPago || 0);

  // Tratamento de endereço para evitar "undefined" na tela
  const rua = item.rua || "Rua não informada";
  const numero = item.numero || "S/N";
  const bairro = item.bairro ? ` - ${item.bairro}` : "";
  const enderecoFormatado = `${rua}, ${numero}${bairro}`;

  const darBaixa = async () => {
    const valorNum = moneyToNumber(valorRecebido);
    if (valorNum <= 0) return alert("Digite um valor válido");
    if (valorNum > saldoDevedor)
      return alert("O valor não pode ser maior que a dívida");

    setCarregando(true);
    try {
      const novoTotalPago = (item.totalPago || 0) + valorNum;
      const dataAtual = new Date(item.dataProximaCobranca + "T00:00:00");
      dataAtual.setMonth(dataAtual.getMonth() + 1);
      const novaDataCobranca = dataAtual.toISOString().split("T")[0];

      await updateDoc(doc(db, "clientes", item.id), {
        totalPago: novoTotalPago,
        dataProximaCobranca:
          novoTotalPago >= item.valorTotalContrato
            ? item.dataProximaCobranca
            : novaDataCobranca,
      });

      setValorRecebido("");
      alert("Sucesso!");
    } catch {
      alert("Erro ao processar.");
    } finally {
      setCarregando(false);
    }
  };

  const enviarCobranca = () => {
    const telefoneLimpo = item.telefone.replace(/\D/g, "");
    const mensagem = window.encodeURIComponent(
      `Olá ${item.nome}, referente ao produto ${item.produto}. Consta um saldo em aberto de ${formatCurrency(saldoDevedor)}. Podemos agendar o pagamento?`,
    );
    window.open(`https://wa.me/55${telefoneLimpo}?text=${mensagem}`, "_blank");
  };

  const handleExcluir = async () => {
    if (window.confirm(`Excluir ${item.nome}?`)) {
      try {
        await deleteDoc(doc(db, "clientes", item.id));
      } catch {
        alert("Erro ao excluir.");
      }
    }
  };

  return (
    <div
      className={`card-moderno ${saldoDevedor <= 0 ? "quitado" : "pendente"}`}
    >
      {/* CABEÇALHO COM NOME E STATUS */}
      <div className="header-card">
        <div className="cliente-info">
          <h3>{item.nome}</h3>
          <span className="produto-label">{item.produto}</span>
        </div>
        <span
          className={`status-badge ${saldoDevedor <= 0 ? "pago" : "devedor"}`}
        >
          {saldoDevedor <= 0 ? "QUITADO" : "PENDENTE"}
        </span>
      </div>

      {/* CORPO COM ENDEREÇO */}
      <div className="corpo-card">
        <p className="endereco">
          <span>📍</span> {enderecoFormatado}
        </p>

        {/* FINANCEIRO EM CAIXINHAS */}
        <div className="financeiro-grid-novo">
          <div className="fin-caixa">
            <small>Total Contrato</small>
            <strong>{formatCurrency(item.valorTotalContrato)}</strong>
          </div>
          <div className="fin-caixa">
            <small>Restante</small>
            <strong className="vermelho">{formatCurrency(saldoDevedor)}</strong>
          </div>
        </div>

        {/* BAIXA RÁPIDA (Só aparece se houver dívida) */}
        {saldoDevedor > 0 && (
          <div className="area-baixa">
            <input
              type="text"
              placeholder="R$ 0,00"
              value={valorRecebido}
              onChange={(e) => setValorRecebido(maskMoney(e.target.value))}
            />
            <button onClick={darBaixa} disabled={carregando}>
              {carregando ? "..." : "BAIXA"}
            </button>
          </div>
        )}
      </div>

      {/* AÇÕES NO RODAPÉ */}
      <div className="footer-card">
        <button className="btn-acao edit" onClick={() => onEditar(item)}>
          ✏️ Editar
        </button>
        <button className="btn-acao zap" onClick={enviarCobranca}>
          💬 WhatsApp
        </button>
        <button className="btn-acao trash" onClick={handleExcluir}>
          🗑️
        </button>
      </div>
    </div>
  );
}
