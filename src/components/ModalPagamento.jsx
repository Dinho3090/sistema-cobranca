import React, { useMemo } from "react"; // Adicione o useMemo aqui
import { X, Calendar, DollarSign } from "lucide-react";

const gerarDataPadrao = () => {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
};
export function ModalPagamento({
  cliente,
  onClose,
  onConfirmar,
  valorDigitado,
  setValorDigitado,
  confirmarWhatsApp, // Adicione aqui
  setConfirmarWhatsApp,
}) {
  const dataProximaVisita = useMemo(() => gerarDataPadrao(), []);

  if (!cliente) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[32px] p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-gray-800">
            Confirmar Recebimento
          </h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 bg-blue-50 p-4 rounded-2xl">
          <p className="text-blue-600 text-xs font-black uppercase tracking-widest">
            Cliente
          </p>
          <p className="text-lg font-bold text-gray-800">{cliente.nome}</p>
        </div>

        <div className="space-y-4">
          {/* Campo Valor */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
              Quanto ele está pagando?
            </label>
            <div className="relative mt-1">
              <DollarSign
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="number"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 pl-12 outline-none font-bold text-gray-800 transition-all"
                placeholder={cliente.valorParcela.toFixed(2)}
                value={valorDigitado}
                onChange={(e) => setValorDigitado(e.target.value)}
              />
            </div>
          </div>

          {/* Campo Data de Retorno */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
              Próxima Visita (Agendamento)
            </label>
            <div className="relative mt-1">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="date"
                id="dataRetorno"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 pl-12 outline-none font-bold text-blue-600 transition-all"
                defaultValue={dataProximaVisita} // Use a nova variável aqui
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-4">
          <input
            type="checkbox"
            id="zap"
            checked={confirmarWhatsApp}
            onChange={(e) => setConfirmarWhatsApp(e.target.checked)}
            className="w-5 h-5 accent-green-600"
          />
          <label htmlFor="zap" className="text-sm font-bold text-gray-700">
            Enviar recibo pelo WhatsApp?
          </label>
        </div>

        <button
          onClick={onConfirmar}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg mt-8 shadow-xl shadow-blue-200 active:scale-95 transition-all"
        >
          CONFIRMAR PAGAMENTO
        </button>
      </div>
    </div>
  );
}
