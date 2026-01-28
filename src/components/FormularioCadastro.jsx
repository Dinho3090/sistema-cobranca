import React, { useEffect, useMemo } from "react";
import {
  UserPlus,
  MapPin,
  Calendar,
  Phone,
  FileText,
  Plus,
} from "lucide-react";

const calcularDataFutura = () => {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
};

export function FormularioCadastro({
  novoCliente,
  setNovoCliente,
  aoCadastrar,
  rotas,
  // ADICIONADO: Props para o sistema de bairros funcionar aqui dentro
  bairrosCadastrados,
  novoBairroNome,
  setNovoBairroNome,
  adicionarNovoBairro,
}) {
  const calcularParcela = (total, qtd) => {
    const vTotal = parseFloat(total) || 0;
    const vQtd = parseInt(qtd) || 1;
    const resultado = vTotal > 0 ? (vTotal / vQtd).toFixed(2) : "";

    setNovoCliente({
      ...novoCliente,
      valorTotal: total,
      qtdParcelas: qtd,
      valorParcela: resultado,
    });
  };

  const dataTrintaDias = useMemo(() => calcularDataFutura(), []);

  // Corrigido: Apenas um useEffect para a data padrão
  useEffect(() => {
    if (!novoCliente.dataProximaCobranca) {
      setNovoCliente((prev) => ({
        ...prev,
        dataProximaCobranca: dataTrintaDias,
      }));
    }
  }, [dataTrintaDias, setNovoCliente]);

  const aplicarMascaraTelefone = (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    setNovoCliente({ ...novoCliente, telefone: v });
  };

  const aplicarMascaraCPF = (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setNovoCliente({ ...novoCliente, cpf: v });
  };

  // Verificação de formulário aprimorada
  const formularioValido =
    // Nome precisa ter pelo menos 3 letras (sem contar espaços nas pontas)
    novoCliente.nome?.trim().length >= 3 &&
    // Telefone limpo (só números) deve ter entre 10 e 11 dígitos
    novoCliente.telefone?.replace(/\D/g, "").length >= 10 &&
    // CPF limpo (só números) deve ter 11 dígitos
    novoCliente.cpf?.replace(/\D/g, "").length === 11 &&
    // Rota e Bairro não podem estar vazios
    novoCliente.rota &&
    novoCliente.rota !== "" &&
    novoCliente.bairro &&
    novoCliente.bairro !== "" &&
    // Rua precisa de pelo menos 3 letras
    novoCliente.rua?.trim().length >= 3 &&
    // Valor da parcela deve ser um número maior que zero
    parseFloat(novoCliente.valorParcela) > 0;

  return (
    <div className="bg-white p-6 rounded-[32px] shadow-lg border border-gray-100 mb-10">
      <header className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-xl">
          <UserPlus className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900 leading-none">
            Novo Cliente
          </h2>
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">
            Novo contrato
          </p>
        </div>
      </header>

      <div className="space-y-4">
        {/* Nome e Produto */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">
              Nome Completo
            </label>
            <input
              placeholder="Ex: João Silva"
              className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none transition-all font-semibold text-gray-700"
              value={novoCliente.nome}
              onChange={(e) =>
                setNovoCliente({ ...novoCliente, nome: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block">
              Produto / Serviço
            </label>
            <input
              placeholder="Ex: Empréstimo, Venda..."
              className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none transition-all font-semibold text-gray-700"
              value={novoCliente.produto || ""}
              onChange={(e) =>
                setNovoCliente({ ...novoCliente, produto: e.target.value })
              }
            />
          </div>
        </div>

        {/* WhatsApp e CPF */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-black text-gray-400 uppercase ml-4 mb-1 block">
              WhatsApp
            </label>
            <div className="relative">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                size={18}
              />
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                className="w-full bg-gray-50 p-4 pl-12 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-semibold text-gray-700"
                value={novoCliente.telefone}
                onChange={aplicarMascaraTelefone}
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-black text-gray-400 uppercase ml-4 mb-1 block">
              CPF
            </label>
            <div className="relative">
              <FileText
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                size={18}
              />
              <input
                placeholder="000.000.000-00"
                className="w-full bg-gray-50 p-4 pl-12 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-semibold text-gray-700"
                value={novoCliente.cpf}
                onChange={aplicarMascaraCPF}
              />
            </div>
          </div>
        </div>

        {/* ROTA E BAIRRO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-black text-gray-400 uppercase ml-4 mb-1 block">
              Rota
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                size={18}
              />
              <select
                className="w-full bg-gray-50 p-4 pl-12 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none appearance-none font-semibold text-gray-700"
                value={novoCliente.rota}
                onChange={(e) =>
                  setNovoCliente({ ...novoCliente, rota: e.target.value })
                }
              >
                <option value="">Selecione a Rota</option>
                {rotas.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-gray-400 uppercase ml-4 mb-1 block">
              Bairro
            </label>
            <select
              className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-semibold text-gray-700"
              value={novoCliente.bairro}
              onChange={(e) =>
                setNovoCliente({ ...novoCliente, bairro: e.target.value })
              }
            >
              <option value="">Selecione o Bairro</option>
              {bairrosCadastrados.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CAMPO ADICIONAR BAIRRO */}
        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 border-dashed">
          <label className="text-[10px] font-black text-blue-400 uppercase mb-2 block ml-2">
            + Novo Bairro
          </label>
          <div className="flex gap-2">
            <input
              placeholder="Nome do bairro"
              className="flex-1 bg-white p-3 rounded-xl outline-none font-semibold text-gray-700 text-sm"
              value={novoBairroNome}
              onChange={(e) => setNovoBairroNome(e.target.value)}
            />
            <button
              type="button"
              onClick={adicionarNovoBairro}
              className="bg-blue-600 text-white px-5 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* RUA E NÚMERO */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="text-[11px] font-black text-gray-400 uppercase ml-4 mb-1 block">
              Rua
            </label>
            <input
              placeholder="Rua..."
              className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-semibold text-gray-700"
              value={novoCliente.rua}
              onChange={(e) =>
                setNovoCliente({ ...novoCliente, rua: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[11px] font-black text-gray-400 uppercase ml-4 mb-1 block">
              Nº
            </label>
            <input
              placeholder="123"
              className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-semibold text-gray-700"
              value={novoCliente.numero}
              onChange={(e) =>
                setNovoCliente({ ...novoCliente, numero: e.target.value })
              }
            />
          </div>
        </div>

        {/* FINANCEIRO */}
        <div className="bg-blue-50/50 p-6 rounded-[28px] space-y-4 border border-blue-100/50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-blue-400 uppercase mb-1 block">
                Valor Total
              </label>
              <input
                type="number"
                placeholder="R$ 0,00"
                className="w-full bg-white p-3 rounded-xl outline-none font-bold text-gray-700 text-lg"
                value={novoCliente.valorTotal || ""}
                onChange={(e) =>
                  calcularParcela(e.target.value, novoCliente.qtdParcelas)
                }
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-blue-400 uppercase mb-1 block">
                Parcelas
              </label>
              <select
                className="w-full bg-white p-3 rounded-xl outline-none font-bold text-gray-700 text-lg"
                value={novoCliente.qtdParcelas || "1"}
                onChange={(e) =>
                  calcularParcela(novoCliente.valorTotal, e.target.value)
                }
              >
                {[...Array(24)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}x
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-blue-100">
            <div>
              <label className="text-[10px] font-black text-blue-400 uppercase mb-1 block">
                Parcela
              </label>
              <div className="bg-blue-600 p-3 rounded-xl font-black text-white text-lg text-center shadow-md">
                R$ {novoCliente.valorParcela || "0.00"}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-blue-400 uppercase mb-1 block">
                1ª Cobrança
              </label>
              <input
                type="date"
                className="w-full bg-white p-3 rounded-xl outline-none font-bold text-gray-600 text-xs h-[52px]"
                value={novoCliente.dataProximaCobranca || dataTrintaDias}
                onChange={(e) =>
                  setNovoCliente({
                    ...novoCliente,
                    dataProximaCobranca: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <button
          onClick={(e) => formularioValido && aoCadastrar(e)}
          disabled={!formularioValido}
          className={`w-full font-black py-5 rounded-2xl transition-all uppercase tracking-[2px] text-sm mt-4 shadow-xl ${
            formularioValido
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
          }`}
        >
          {formularioValido
            ? "Finalizar Cadastro"
            : "Preencha os dados obrigatórios"}
        </button>
      </div>
    </div>
  );
}
