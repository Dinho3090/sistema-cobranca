import React from "react";
import {
  Phone,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export function RelatorioGeral({ cobrancasDia, hojeData, onExcluir }) {
  // Cálculos de inteligência do painel
  const totalGeralNaRua = cobrancasDia.reduce(
    (acc, c) => acc + Number(c.valorParcela) * Number(c.qtdParcelas),
    0,
  );
  const totalAtrasado = cobrancasDia
    .filter((c) => c.dataProximaCobranca < hojeData)
    .reduce((acc, c) => acc + Number(c.valorParcela), 0);

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* 1. DASHBOARD DE PERFORMANCE */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-[32px] shadow-lg">
          <TrendingUp className="text-blue-400 mb-2" size={20} />
          <p className="text-gray-400 text-[10px] font-black uppercase">
            Capital Total
          </p>
          <p className="text-white text-xl font-black">
            R${" "}
            {totalGeralNaRua.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-white p-5 rounded-[32px] border border-red-100 shadow-sm">
          <AlertCircle className="text-red-500 mb-2" size={20} />
          <p className="text-gray-400 text-[10px] font-black uppercase">
            Atraso Hoje
          </p>
          <p className="text-red-600 text-xl font-black">
            R${" "}
            {totalAtrasado.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* 2. LISTA DETALHADA COM STATUS VISUAL */}
      <div className="flex flex-col gap-3">
        <h3 className="text-gray-400 text-[10px] font-black uppercase ml-4 tracking-widest">
          Detalhamento por Cliente
        </h3>

        {cobrancasDia.map((item) => {
          const isAtrasado = item.dataProximaCobranca < hojeData;
          const saldoTotal =
            Number(item.valorParcela) * Number(item.qtdParcelas);

          return (
            <div
              key={item.id}
              className="bg-white p-5 rounded-[35px] border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-gray-800 text-lg leading-tight">
                      {item.nome}
                    </h4>
                    {isAtrasado ? (
                      <AlertCircle
                        size={16}
                        className="text-red-500 animate-pulse"
                      />
                    ) : (
                      <CheckCircle2 size={16} className="text-green-500" />
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    {item.produto} • {item.rota}
                  </p>
                </div>

                <button
                  onClick={() => onExcluir(item.id)}
                  className="text-gray-300 hover:text-red-500 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* INFO BOX */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl mb-4">
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase">
                    Saldo Restante
                  </p>
                  <p className="font-black text-gray-700">
                    R$ {saldoTotal.toFixed(2)}
                  </p>
                </div>
                <div className="border-l border-gray-200 pl-3">
                  <p className="text-[8px] font-black text-gray-400 uppercase">
                    Próxima Parcela
                  </p>
                  <p
                    className={`font-black ${isAtrasado ? "text-red-500" : "text-blue-600"}`}
                  >
                    {item.dataProximaCobranca?.split("-").reverse().join("/")}
                  </p>
                </div>
              </div>

              {/* BOTÃO DE AÇÃO DIRETA */}
              <a
                href={`https://wa.me/55${item.telefone?.replace(/\D/g, "")}`}
                target="_blank"
                className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-green-100 active:scale-95 transition-all"
              >
                <Phone size={14} /> ENVIAR COBRANÇA WHATSAPP
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
