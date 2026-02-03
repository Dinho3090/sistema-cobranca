import React, { useState } from "react";
import { Dashboard } from "../pages/Dashboard/index";
import { CadastroCliente } from "../pages/CadastroCliente/index";
import { ListaClientes } from "../pages/ListaClientes/index";
import { useClientes } from "../hooks/useClientes"; // IMPORTANDO O HOOK
import { TelaCobrancas } from "../pages/TelaCobrancas/index";
import { PainelControle } from "../components/PainelControle";
import "./AppRoutes.css";

export function AppRoutes() {
  const [telaAtiva, setTelaAtiva] = useState("clientes");
  const [clienteSendoEditado, setClienteSendoEditado] = useState(null);
  const { clientes, loading } = useClientes();

  const prepararEdicao = (cliente) => {
    setClienteSendoEditado(cliente);
    setTelaAtiva("cadastro");
  };

  const finalizarAcao = () => {
    setClienteSendoEditado(null);
    setTelaAtiva("clientes");
  };

  return (
    <div className="app-container">
      <nav className="nav-container no-print">
        <button
          onClick={() => setTelaAtiva("cobrancas")}
          className={`nav-button ${telaAtiva === "cobrancas" ? "active" : ""}`}
        >
          <span>📅</span> Cobranças
        </button>

        <button
          onClick={finalizarAcao}
          className={`nav-button ${telaAtiva === "clientes" ? "active" : ""}`}
        >
          <span>👥</span> Clientes
        </button>

        <button
          onClick={() => {
            setClienteSendoEditado(null);
            setTelaAtiva("cadastro");
          }}
          className={`nav-button ${telaAtiva === "cadastro" ? "active" : ""}`}
        >
          <span>➕</span> Novo
        </button>

        <button
          onClick={() => setTelaAtiva("dashboard")}
          className={`nav-button ${telaAtiva === "dashboard" ? "active" : ""}`}
        >
          <span>📊</span> Resumo
        </button>

        <button
          onClick={() => setTelaAtiva("painel")}
          className={`nav-button ${telaAtiva === "painel" ? "active" : ""}`}
        >
          <span>⚙️</span> Painel
        </button>
      </nav>

      <main className="main-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Sincronizando dados...</p>
          </div>
        ) : (
          <>
            {telaAtiva === "cobrancas" && (
              <TelaCobrancas clientes={clientes} onEditar={prepararEdicao} />
            )}
            {telaAtiva === "clientes" && (
              <ListaClientes clientes={clientes} onEditar={prepararEdicao} />
            )}
            {telaAtiva === "cadastro" && (
              <CadastroCliente
                key={clienteSendoEditado?.id || "novo"}
                aoSalvar={finalizarAcao}
                clienteParaEditar={clienteSendoEditado}
              />
            )}
            {telaAtiva === "dashboard" && <Dashboard clientes={clientes} />}
            {telaAtiva === "painel" && <PainelControle clientes={clientes} />}
          </>
        )}
      </main>
    </div>
  );
}
