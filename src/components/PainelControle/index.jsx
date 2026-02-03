import React, { useState } from "react";
import { db } from "../../services/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { formatCurrency } from "../../utils/formatters";
import "./PainelControle.css";

export function PainelControle({ clientes }) {
  // --- NOVO: Lógica de Metas ---
  const [meta, setMeta] = useState(() => {
    return localStorage.getItem("@sistema:meta") || "5000";
  });

  const handleMetaChange = (e) => {
    const valor = e.target.value;
    setMeta(valor);
    localStorage.setItem("@sistema:meta", valor);
  };

  // --- FUNÇÕES EXISTENTES ---
  const handleBackup = () => {
    if (!clientes || clientes.length === 0)
      return alert("Não há dados para exportar");
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(clientes));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `backup_sistema_${new Date().toLocaleDateString()}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleRestaurar = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (
      !window.confirm(
        "Deseja importar esses clientes? Isso não apagará os atuais.",
      )
    )
      return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dados = JSON.parse(e.target.result);
        let importados = 0;

        for (const cliente of dados) {
          // 1. Remove o ID antigo para o Firebase gerar um novo
          const { id: _, ...dadosLimpos } = cliente;

          // 2. Normalização de Endereço (Garante que rua, bairro e numero fiquem na raiz)
          if (dadosLimpos.endereco) {
            dadosLimpos.rua = dadosLimpos.rua || dadosLimpos.endereco.rua || "";
            dadosLimpos.bairro =
              dadosLimpos.bairro || dadosLimpos.endereco.bairro || "";
            dadosLimpos.numero =
              dadosLimpos.numero || dadosLimpos.endereco.numero || "";
            delete dadosLimpos.endereco; // Remove o objeto aninhado para manter o padrão
          }

          // 3. Conversão de Timestamps do Firestore para Objetos de Data Reais
          // Se houver dataCriacao no formato {seconds, nanoseconds}, convertemos
          if (
            dadosLimpos.dataCriacao &&
            typeof dadosLimpos.dataCriacao === "object"
          ) {
            // Se for o formato do backup: {seconds, nanoseconds}
            if (dadosLimpos.dataCriacao.seconds) {
              dadosLimpos.dataCriacao = new Date(
                dadosLimpos.dataCriacao.seconds * 1000,
              );
            }
          } else if (!dadosLimpos.dataCriacao) {
            // Se não tiver data de criação, coloca a data de hoje
            dadosLimpos.dataCriacao = new Date();
          }

          // 4. Garantir que valores financeiros sejam Números
          dadosLimpos.valorTotalContrato =
            Number(dadosLimpos.valorTotalContrato) || 0;
          dadosLimpos.totalPago = Number(dadosLimpos.totalPago) || 0;

          // 5. Salva no Firebase
          await addDoc(collection(db, "clientes"), dadosLimpos);
          importados++;
        }

        alert(
          `Sucesso! ${importados} clientes foram importados e normalizados.`,
        );
        // Recarrega a página para atualizar os dados
        window.location.reload();
      } catch (error) {
        console.error("Erro na restauração:", error);
        alert(
          "Erro ao ler o arquivo de backup. Verifique se o formato está correto.",
        );
      }
    };
    reader.readAsText(file);
  };

  const handleImprimir = () => window.print();

  return (
    <div className="painel-controle-container">
      {/* --- TUDO DENTRO DE "no-print" NÃO APARECE NA IMPRESSÃO --- */}
      <div className="no-print">
        {/* 🎯 SEÇÃO DE METAS */}
        <div className="card-acoes meta-section">
          <h2>🎯 Meta de Faturamento</h2>
          <p>Defina seu objetivo mensal para acompanhar no Dashboard.</p>
          <div className="meta-input-container">
            <div className="input-wrapper">
              <span>R$</span>
              <input
                type="number"
                value={meta}
                onChange={handleMetaChange}
                placeholder="Ex: 10000"
              />
            </div>
            <div className="meta-badge">
              Meta Atual: <strong>{formatCurrency(Number(meta))}</strong>
            </div>
          </div>
        </div>

        {/* 🛠️ FERRAMENTAS DE DADOS */}
        <div className="card-acoes">
          <h2>🛠️ Ferramentas de Dados</h2>
          <p>Gerencie seus arquivos de segurança e relatórios.</p>

          <div className="botoes-grid">
            <button onClick={handleBackup} className="btn-painel backup">
              <span>💾</span> Gerar Backup (JSON)
            </button>

            <label className="btn-painel restaurar">
              <span>📥</span> Restaurar Backup
              <input
                type="file"
                accept=".json"
                onChange={handleRestaurar}
                style={{ display: "none" }}
              />
            </label>

            <button onClick={handleImprimir} className="btn-painel imprimir">
              <span>🖨️</span> Imprimir Planilha Geral
            </button>
          </div>
        </div>
      </div>

      {/* --- SEÇÃO EXCLUSIVA PARA IMPRESSÃO --- */}
      <div className="apenas-impressao">
        <div className="header-impressao">
          <h1>Relatório Geral de Clientes</h1>
          <p>Data do Relatório: {new Date().toLocaleDateString("pt-BR")}</p>
        </div>

        <table className="tabela-impressao">
          <thead>
            <tr>
              <th>Nome / Endereço</th>
              <th>Produto</th>
              <th>Total Contrato</th>
              <th>Total Pago</th>
              <th>Saldo Devedor</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => {
              const rua = c.rua || c.endereco?.rua || "---";
              const bairro = c.bairro || c.endereco?.bairro || "";
              const numero = c.numero || c.endereco?.numero || "";

              const totalContrato = Number(c.valorTotalContrato) || 0;
              const pago = Number(c.totalPago) || 0;
              const saldo = totalContrato - pago;

              return (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: "bold" }}>{c.nome}</div>
                    <small style={{ color: "#333" }}>
                      {rua}, {numero} - {bairro}
                    </small>
                  </td>
                  <td>{c.produto}</td>
                  <td>{formatCurrency(totalContrato)}</td>
                  <td>{formatCurrency(pago)}</td>
                  <td
                    style={{
                      color: saldo > 0 ? "#000" : "#000",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(saldo)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="footer-impressao">
          <p>
            <strong>Total de Clientes:</strong> {clientes.length}
          </p>
          <p
            style={{
              marginTop: "40px",
              borderTop: "1px solid #000",
              width: "300px",
              textAlign: "center",
              paddingTop: "5px",
            }}
          >
            Assinatura do Responsável
          </p>
        </div>
      </div>
    </div>
  );
}
