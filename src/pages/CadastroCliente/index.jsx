import React, { useState } from "react";
import { db } from "../../services/firebase/config";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import {
  maskCPF,
  maskPhone,
  maskMoney,
  moneyToNumber,
} from "../../utils/formatters"; // Certifique-se que o caminho está correto
import "./CadastroCliente.css";

export function CadastroCliente({ aoSalvar, clienteParaEditar }) {
  // Inicializa o estado aplicando as máscaras caso exista um cliente sendo editado
  const [formData, setFormData] = useState({
    nome: clienteParaEditar?.nome || "",
    cpf: maskCPF(clienteParaEditar?.cpf || ""),
    telefone: maskPhone(clienteParaEditar?.telefone || ""),
    rua: clienteParaEditar?.rua || "",
    numero: clienteParaEditar?.numero || "",
    bairro: clienteParaEditar?.bairro || "",
    produto: clienteParaEditar?.produto || "",
    // Multiplicamos por 100 na edição pois o maskMoney espera uma string de centavos
    valorProduto: clienteParaEditar?.valorProduto
      ? maskMoney(clienteParaEditar.valorProduto * 100)
      : "0,00",
    parcelas: clienteParaEditar?.parcelas || "1",
    totalPago: clienteParaEditar?.totalPago
      ? maskMoney(clienteParaEditar.totalPago * 100)
      : "0,00",
    dataProximaCobranca: clienteParaEditar?.dataProximaCobranca || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let valorFormatado = value;

    // Aplica as regras de máscara conforme o campo
    if (name === "cpf") valorFormatado = maskCPF(value);
    if (name === "telefone") valorFormatado = maskPhone(value);
    if (name === "valorProduto" || name === "totalPago")
      valorFormatado = maskMoney(value);

    setFormData((prev) => ({ ...prev, [name]: valorFormatado }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Converte as strings formatadas de volta para números antes de enviar ao Firebase
      const valorNumericoProduto = moneyToNumber(formData.valorProduto);
      const valorNumericoPago = moneyToNumber(formData.totalPago);

      const dadosParaSalvar = {
        ...formData,
        valorProduto: valorNumericoProduto,
        totalPago: valorNumericoPago,
        valorTotalContrato: valorNumericoProduto, // Regra: contrato = valor do produto
      };

      if (clienteParaEditar?.id) {
        await updateDoc(
          doc(db, "clientes", clienteParaEditar.id),
          dadosParaSalvar,
        );
      } else {
        await addDoc(collection(db, "clientes"), dadosParaSalvar);
      }
      aoSalvar();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    }
  };

  const valorTotalVenda = moneyToNumber(formData.valorProduto);

  // 2. Definimos a quantidade de parcelas (mínimo 1 para evitar divisão por zero)
  const qtdParcelas = Math.max(1, parseInt(formData.parcelas) || 1);

  // 3. Calculamos o valor da parcela individual
  const valorParcelaIndividual = valorTotalVenda / qtdParcelas;

  // 4. Formatamos o resultado para exibição visual
  const valorParcelaFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorParcelaIndividual);

  return (
    <div className="cadastro-container">
      <h2 className="cadastro-title">📋 Ficha de Cadastro</h2>

      <form onSubmit={handleSubmit}>
        {/* SEÇÃO 1: PESSOAL */}
        <section className="form-section">
          <h3>Identificação</h3>
          <div className="form-grid">
            <div className="form-group col-6">
              <label>Nome Completo</label>
              <input
                className="form-input"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group col-3">
              <label>CPF</label>
              <input
                className="form-input"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="form-group col-3">
              <label>Telefone</label>
              <input
                className="form-input"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
        </section>

        {/* SEÇÃO 2: ENDEREÇO */}
        <section className="form-section">
          <h3>Localização</h3>
          <div className="form-grid">
            <div className="form-group col-4">
              <label>Rua / Logradouro</label>
              <input
                className="form-input"
                name="rua"
                value={formData.rua}
                onChange={handleChange}
              />
            </div>
            <div className="form-group col-2">
              <label>Nº</label>
              <input
                className="form-input"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
              />
            </div>
            <div className="form-group col-6">
              <label>Bairro</label>
              <input
                className="form-input"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* SEÇÃO 3: PRODUTO E PAGAMENTO */}
        <section className="form-section">
          <h3>Detalhes da Venda</h3>
          <div className="form-grid">
            <div className="form-group col-6">
              <label>Produto Vendido</label>
              <input
                className="form-input"
                name="produto"
                value={formData.produto}
                onChange={handleChange}
              />
            </div>

            <div className="form-group col-2">
              <label>Valor Total R$</label>
              <input
                className="form-input"
                name="valorProduto"
                value={formData.valorProduto}
                onChange={handleChange}
              />
            </div>

            <div className="form-group col-2">
              <label>Parcelas</label>
              <input
                className="form-input"
                type="number"
                name="parcelas"
                min="1"
                value={formData.parcelas}
                onChange={handleChange}
              />
            </div>

            {/* NOVO CAMPO: VALOR DA PARCELA (CÁLCULO AUTOMÁTICO) */}
            <div className="form-group col-2">
              <label>Valor da Parcela</label>
              <input
                className="form-input"
                style={{
                  backgroundColor: "#f1f5f9",
                  fontWeight: "bold",
                  color: "#2563eb",
                }}
                value={valorParcelaFormatado}
                readOnly
              />
            </div>

            <div className="form-group col-3">
              <label>Já Pago R$</label>
              <input
                className="form-input"
                name="totalPago"
                value={formData.totalPago}
                onChange={handleChange}
              />
            </div>

            <div className="form-group col-3">
              <label>Data da Próxima Cobrança</label>
              <input
                className="form-input"
                type="date"
                name="dataProximaCobranca"
                value={formData.dataProximaCobranca}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <div className="btn-group">
          <button type="submit" className="btn-salvar">
            Salvar Cliente
          </button>
          <button type="button" className="btn-cancelar" onClick={aoSalvar}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
