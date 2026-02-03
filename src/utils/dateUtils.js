export const formatarDataBR = (data) => {
  if (!data) return "Sem data";
  return data.split("-").reverse().join("/");
};

export const hojeDataISO = new Date().toISOString().split("T")[0];
export const obterStatusCobranca = (dataCobranca, hoje) => {
  if (!dataCobranca) return "remarcado";
  if (dataCobranca < hoje) return "atrasado";
  if (dataCobranca === hoje) return "hoje";
  return "remarcado";
};
