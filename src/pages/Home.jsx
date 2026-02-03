import React, { useState } from "react";
import { CardCliente } from "../components/CardCliente";
import "./Home.css"; // Importe o CSS aqui

export function Home({ clientes = [], onEditar }) {
  const [busca, setBusca] = useState("");

  // Filtro de busca funcional
  const clientesFiltrados = clientes.filter((c) =>
    c.nome?.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="home-container">
      <input
        type="text"
        className="home-search-input"
        placeholder="🔍 Buscar cliente..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <h3 className="home-title">Seus Clientes ({clientesFiltrados.length})</h3>

      <div className="home-list">
        {clientesFiltrados.map((cliente) => (
          <CardCliente
            key={cliente.id}
            item={cliente}
            onEditar={onEditar} // Corrigido para onEditar para bater com o Card
          />
        ))}
      </div>
    </div>
  );
}
