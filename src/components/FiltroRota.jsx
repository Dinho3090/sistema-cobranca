import React from "react";

export function FiltroRota({ rotas, filtroRota, setFiltroRota }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
      <button
        onClick={() => setFiltroRota("Todos")}
        className={`px-6 py-2 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
          filtroRota === "Todos"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
            : "bg-white text-gray-400 border border-gray-100"
        }`}
      >
        Todos
      </button>
      {rotas.map((rota) => (
        <button
          key={rota}
          onClick={() => setFiltroRota(rota)}
          className={`px-6 py-2 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
            filtroRota === rota
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "bg-white text-gray-400 border border-gray-100"
          }`}
        >
          {rota}
        </button>
      ))}
    </div>
  );
}
