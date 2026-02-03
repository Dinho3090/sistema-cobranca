import React, { useState } from "react";
import { CardCliente } from "../../components/CardCliente";
import "./ListaClientes.css";

export function ListaClientes({ clientes = [], onEditar }) {
  const [busca, setBusca] = useState("");

  // 🔍 Lógica de Filtro: Busca por Nome ou CPF
  const clientesFiltrados = clientes.filter((c) => {
    const termo = busca.toLowerCase();
    return c.nome?.toLowerCase().includes(termo) || c.cpf?.includes(termo);
  });

  return (
    <div className="lista-container">
      {/* 🔎 Cabeçalho de Busca */}
      <div className="search-box">
        <input
          type="text"
          className="input-busca"
          placeholder="🔍 Buscar por nome ou CPF..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          autoFocus // Abre a aba já pronto para digitar
        />
        <p className="search-count">
          {clientesFiltrados.length} cliente(s) encontrado(s)
        </p>
      </div>

      {/* 📜 Lista Resultante */}
      <div className="lista-cards">
        {clientesFiltrados.map((cliente) => (
          <CardCliente key={cliente.id} item={cliente} onEditar={onEditar} />
        ))}

        {/* 🏜️ Caso não encontre nada */}
        {clientesFiltrados.length === 0 && (
          <div className="empty-msg">
            <p>
              Nenhum resultado para "<strong>{busca}</strong>"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
