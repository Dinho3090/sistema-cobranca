import React from "react";

export function PainelResumo({ totalCobranca, qtdClientes, rotaAtiva }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-blue-600 p-5 rounded-[32px] shadow-xl shadow-blue-100">
        <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">
          A Receber • {rotaAtiva}
        </p>
        <p className="text-white text-2xl font-black mt-1">
          R$ {totalCobranca.toFixed(2)}
        </p>
      </div>
      <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
          Visitas
        </p>
        <p className="text-gray-800 text-2xl font-black mt-1">
          {qtdClientes} pendentes
        </p>
      </div>
    </div>
  );
}
