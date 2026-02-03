// Formata CPF: 000.000.000-00
export const maskCPF = (value) => {
  if (!value) return "";
  const limpo = value.replace(/\D/g, ""); // Remove tudo que não é número

  if (limpo.length <= 3) return limpo;
  if (limpo.length <= 6) return limpo.replace(/(\d{3})(\d+)/, "$1.$2");
  if (limpo.length <= 9)
    return limpo.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");

  return limpo
    .replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4")
    .slice(0, 14);
};
// Formata Telefone: (00) 00000-0000
export const maskPhone = (value) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
};

// Validação Real de CPF (Algoritmo básico)
export const isCPFValid = (cpf) => {
  const limpo = cpf.replace(/\D/g, "");
  if (limpo.length !== 11 || /^(\d)\1{10}$/.test(limpo)) return false;
  return true;
};
export const maskMoney = (value) => {
  if (!value) return "0,00";

  // Converte para string e remove tudo que não é dígito
  let v = String(value).replace(/\D/g, "");

  // Garante que o número tenha pelo menos 3 dígitos para a vírgula (ex: 005 vira 0,05)
  while (v.length < 3) {
    v = "0" + v;
  }

  // Separa centavos e inteiros
  let inteiros = v.slice(0, -2);
  let centavos = v.slice(-2);

  // Remove zeros à esquerda dos inteiros, mas mantém um zero se for menor que 1 real
  inteiros = String(Number(inteiros));

  // Adiciona o ponto de milhar
  inteiros = inteiros.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

  return `${inteiros},${centavos}`;
};

// Função para converter a string formatada de volta para número antes de salvar no Firebase
export const moneyToNumber = (value) => {
  if (!value) return 0;
  return Number(value.replace(/\./g, "").replace(",", "."));
};
// Transforma número em string de moeda brasileira
export const formatCurrency = (valor) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor || 0);
};
