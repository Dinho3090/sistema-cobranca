import { useState, useEffect } from "react";
import {
  DollarSign,
  Users,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Phone,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  addDoc,
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase/config.js";

// COMPONENTES
import { Header } from "./components/Header";
import { FiltroRota } from "./components/FiltroRota";
import { PainelResumo } from "./components/PainelResumo";
import { CardCliente } from "./components/CardCliente";
import { FormularioCadastro } from "./components/FormularioCadastro";
import { ModalPagamento } from "./components/ModalPagamento";
import { MenuInferior } from "./components/MenuInferior";
import { Financeiro } from "./components/Financeiro";

// UTILS
const formatarMoeda = (valor) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    valor || 0,
  );
const somSucesso = new Audio(
  "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
);
const hojeData = new Date().toISOString().split("T")[0];

export default function App() {
  // --- ESTADOS ---
  const [bairrosCadastrados, setBairrosCadastrados] = useState([]);
  const [cobrancasDia, setCobrancasDia] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("hoje");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroRota, setFiltroRota] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [clientePagando, setClientePagando] = useState(null);
  const [idFinalizando, setIdFinalizando] = useState(null);
  const [confirmarWhatsApp, setConfirmarWhatsApp] = useState(true);
  const [valorDigitadoPagamento, setValorDigitadoPagamento] = useState("");
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    telefone: "",
    rua: "",
    numero: "",
    bairro: "",
    rota: "",
    valorParcela: "",
    qtdParcelas: "",
    dataProximaCobranca: "",
  });
  const [novoBairroNome, setNovoBairroNome] = useState("");
  // Este guarda o ID do cliente que você clicou para editar
  const [editandoId, setEditandoId] = useState(null);

  // Este guarda o valor que você está digitando antes de salvar
  const [valorTemporario, setValorTemporario] = useState("");

  // Adicione este estado no topo do App.jsx junto com os outros
  const [novaDataTemporaria, setNovaDataTemporaria] = useState("");

  const abrirRemarcacao = (item) => {
    setEditandoId(item.id);
    setValorTemporario(""); // Deixa vazio para não alterar o valor original
    setNovaDataTemporaria(item.dataProximaCobranca || ""); // Sugere a data atual do cliente
  };
  // Adicione a função salvarNovoValor
  const salvarNovoValor = async (id) => {
    try {
      const clienteRef = doc(db, "clientes", id);

      // Criamos um objeto apenas com o que será atualizado
      const atualizacao = {};

      // Se o valor temporário não estiver vazio, adicionamos à atualização
      if (valorTemporario !== "" && valorTemporario !== null) {
        atualizacao.valorParcela = valorTemporario;
      }

      // Se a nova data foi preenchida, adicionamos à atualização
      if (novaDataTemporaria !== "" && novaDataTemporaria !== null) {
        atualizacao.dataProximaCobranca = novaDataTemporaria;
      }

      // Só chama o banco de dados se houver alguma mudança real
      if (Object.keys(atualizacao).length > 0) {
        await updateDoc(clienteRef, atualizacao);
        alert("📅 Alterações salvas com sucesso!");
      }

      // Limpa os estados e fecha o modo de edição
      setEditandoId(null);
      setValorTemporario("");
      setNovaDataTemporaria("");
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      alert("❌ Erro ao salvar. Verifique sua conexão.");
    }
  };

  const adicionarNovoBairro = async () => {
    if (novoBairroNome.trim() === "") return;

    try {
      // 1. Salva no Firebase (Coleção exclusiva para bairros)
      await addDoc(collection(db, "bairros"), {
        nome: novoBairroNome.trim(),
        dataCriacao: new Date().toISOString(),
      });

      // 2. O useEffect acima vai detectar a mudança e atualizar a lista sozinho!
      setNovoBairroNome("");
      alert("✅ Bairro salvo permanentemente!");
    } catch (error) {
      console.error("Erro ao salvar bairro:", error);
    }
  };
  const limparFormulario = () => {
    setNovoCliente({
      nome: "",
      telefone: "",
      rua: "",
      numero: "",
      bairro: "",
      rota: "Centro", // ou ""
      produto: "",
      valorTotal: "",
      valorParcela: "",
      qtdParcelas: "1",
      dataProximaCobranca: "",
      cpf: "",
    });
    setClienteSendoEditado(null); // Importante para sair do modo edição
  };

  const cadastrarCliente = async (e) => {
    if (e) e.preventDefault();

    const dadosFormatados = {
      ...novoCliente,
      nome: novoCliente.nome.trim(),
      telefone: novoCliente.telefone.replace(/\D/g, ""),
      valorParcela: Number(novoCliente.valorParcela) || 0,
      qtdParcelas: Number(novoCliente.qtdParcelas) || 0,
      valorTotal: Number(novoCliente.valorTotal) || 0,
      endereco: `${novoCliente.rua}, ${novoCliente.numero} - ${novoCliente.bairro}`,
      proximaCobranca: novoCliente.dataProximaCobranca,
    };

    try {
      if (clienteSendoEditado) {
        // SE ESTIVER EDITANDO: Usa o ID que já existe e a função updateDoc
        const clienteRef = doc(db, "clientes", clienteSendoEditado);
        await updateDoc(clienteRef, dadosFormatados);
        alert("✅ Cliente atualizado com sucesso!");
        setClienteSendoEditado(null); // Limpa o estado de edição
      } else {
        // SE FOR NOVO: Usa addDoc
        await addDoc(collection(db, "clientes"), {
          ...dadosFormatados,
          dataCriacao: new Date().toISOString(),
          pagamentos: [],
        });
        alert("✅ Cliente cadastrado com sucesso!");
      }

      // Limpeza após salvar (funciona para ambos)
      limparFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("❌ Erro ao salvar.");
    }
  };

  // Certifique-se de que o objeto do formulário tenha as novas chaves
  const [clienteSendoEditado, setClienteSendoEditado] = useState(null);

  // --- FUNÇÃO 1: BACKUP PARA RESTAURAÇÃO (JSON) ---
  const fazerBackup = () => {
    try {
      const dadosParaBackup = JSON.stringify(cobrancasDia, null, 2);
      const blob = new Blob([dadosParaBackup], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `backup_sistema_${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      alert("Cópia de segurança gerada!");
    } catch (err) {
      alert("Erro no backup: " + err.message);
    }
  };

  // --- FUNÇÃO 2: EXPORTAR PARA EXCEL/IMPRESSÃO (CSV) ---
  const exportarCSV = () => {
    try {
      const cabecalho = [
        "Nome",
        "Telefone",
        "Rota",
        "Valor Parcela",
        "Total",
        "Proxima",
      ];
      const linhas = cobrancasDia.map((item) =>
        [
          `"${item.nome}"`,
          `"${item.telefone}"`,
          `"${item.rota}"`,
          item.valorParcela,
          item.valorTotal,
          item.dataProximaCobranca,
        ].join(","),
      );
      const csv = "\uFEFF" + [cabecalho.join(","), ...linhas].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "relatorio_cobrancas.csv";
      link.click();
    } catch {
      alert("Erro ao gerar planilha.");
    }
  };

  // --- FUNÇÃO 3: RESTAURAR DADOS ---
  const restaurarBackup = async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = async (e) => {
      try {
        const dados = JSON.parse(e.target.result);

        if (!Array.isArray(dados)) {
          alert("Arquivo inválido!");
          return;
        }

        const confirmar = window.confirm(`Importar ${dados.length} clientes?`);
        if (!confirmar) return;

        for (const cliente of dados) {
          // Mudamos de 'id' para '_id' para silenciar o aviso do compilador
          const { id: _id, ...dadosSemId } = cliente;

          await addDoc(collection(db, "clientes"), {
            ...dadosSemId,
            dataImportacao: new Date().toISOString(),
          });
        }

        alert("Backup restaurado!");
      } catch {
        alert("Erro ao ler o backup.");
      }
    };
    leitor.readAsText(arquivo);
  };

  const rotasDisponiveis = [
    "Centro",
    "Divisa",
    "Prado",
    "Industrial",
    "Jardins",
    "Santa Rosa",
  ];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bairros"), (snapshot) => {
      const listaBairros = snapshot.docs.map((doc) => doc.data().nome);
      // Se o banco estiver vazio, coloca um padrão, senão usa o que está lá
      setBairrosCadastrados(
        listaBairros.length > 0 ? listaBairros : ["Centro"],
      );
    });
    return () => unsubscribe();
  }, []);

  // --- FIREBASE ---
  useEffect(() => {
    const q = query(collection(db, "clientes"));
    return onSnapshot(q, (snapshot) => {
      const dados = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCobrancasDia(dados);
    });
  }, []);

  // --- LÓGICA FINANCEIRA CENTRALIZADA ---
  const calcularFinanceiro = () => {
    let recebidoHoje = 0;
    let pendenteHoje = 0;
    let totalNaRua = 0;

    cobrancasDia.forEach((item) => {
      const totalVenda = Number(item.valorTotal) || 0;
      const valorParcela = Number(item.valorParcela) || 0;

      // Garantimos que pagamentos seja sempre um array para não dar erro
      const pagamentos = item.pagamentos || [];

      const pagoAteAgora = pagamentos.reduce(
        (acc, p) => acc + (Number(p.valor) || 0),
        0,
      );
      const restante = totalVenda - pagoAteAgora;

      // Soma o que entrou HOJE
      const pagoHoje = pagamentos
        .filter((p) => p.data?.startsWith(hojeData))
        .reduce((acc, p) => acc + (Number(p.valor) || 0), 0);

      recebidoHoje += pagoHoje;
      totalNaRua += restante;

      // Pendência: Se o saldo é maior que zero e a data é hoje ou passado
      const deveCobrar =
        !item.dataProximaCobranca || item.dataProximaCobranca <= hojeData;

      if (restante > 0 && deveCobrar) {
        pendenteHoje += valorParcela;
      }
    });

    return { recebidoHoje, pendenteHoje, totalNaRua };
  };

  const financeiro = calcularFinanceiro();

  const cobrancasFiltradas = cobrancasDia.filter((item) => {
    const totalVenda = Number(item.valorTotal) || 0;
    const pagoAteAgora =
      item.pagamentos?.reduce((acc, p) => acc + (Number(p.valor) || 0), 0) || 0;
    const matchesRota = filtroRota === "Todos" || item.rota === filtroRota;
    const matchesBusca = item.nome.toLowerCase().includes(busca.toLowerCase());
    const deveCobrar =
      !item.dataProximaCobranca || item.dataProximaCobranca <= hojeData;

    return (
      totalVenda - pagoAteAgora > 0 && matchesRota && matchesBusca && deveCobrar
    );
  });

  // --- FUNÇÃO DE PAGAMENTO UNIFICADA ---
  const registrarPagamentoAvulso = async (
    item,
    valorDigitado,
    proximaData = null,
  ) => {
    const valor = Number(valorDigitado);
    if (!valor || valor <= 0) return alert("Digite um valor válido");

    try {
      const docRef = doc(db, "clientes", item.id);
      const dadosUpdate = {
        pagamentos: arrayUnion({
          valor: valor,
          data: new Date().toISOString(),
        }),
        ultimaDataPagamento: hojeData,
      };

      if (proximaData) dadosUpdate.dataProximaCobranca = proximaData;

      await updateDoc(docRef, dadosUpdate);
      somSucesso.play();
      return true;
    } catch (error) {
      console.error("Erro:", error);
      return false;
    }
  };

  const confirmarPagamentoModal = async () => {
    if (!clientePagando || idFinalizando) return; // Se já estiver processando, não faz nada

    const dataManual = document.getElementById("dataRetorno")?.value;
    const valor = valorDigitadoPagamento || clientePagando.valorParcela;

    setIdFinalizando(clientePagando.id); // Aqui o valor é "setado"

    const sucesso = await registrarPagamentoAvulso(
      clientePagando,
      valor,
      dataManual,
    );

    if (sucesso) {
      if (confirmarWhatsApp) enviarRecibo(clientePagando, valor, dataManual);
      setClientePagando(null);
      setValorDigitadoPagamento("");
    }
    setIdFinalizando(null); // Aqui ele volta a ser null
  };
  const enviarRecibo = (cliente, valor, proximaData) => {
    const tel = cliente.telefone?.replace(/\D/g, "");
    const msg = `*RECIBO*%0A*${cliente.nome}*%0APago: R$ ${Number(valor).toFixed(2)}%0AData retorno: ${proximaData ? new Date(proximaData).toLocaleDateString("pt-BR") : "Não definida"}`;
    window.open(`https://wa.me/55${tel}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40 relative text-slate-900">
      <main className="max-w-md mx-auto w-full px-4 pt-6">
        {abaAtiva === "hoje" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              padding: "16px",
              backgroundColor: "#F8FAFC",
              minHeight: "100vh",
              paddingBottom: "100px",
            }}
          >
            {/* Componentes de busca e filtro com correção de layout */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <Header busca={busca} setBusca={setBusca} />
              <FiltroRota
                rotas={rotasDisponiveis}
                filtroRota={filtroRota}
                setFiltroRota={setFiltroRota}
              />
            </div>

            {/* Componentes de busca e filtro com correção de layout */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "24px",
                padding: "0 4px",
              }}
            >
              {/* CARD VALOR TOTAL  */}
              <div
                style={{
                  background: "linear-gradient(145deg, #1e293b, #0f172a)",
                  padding: "20px",
                  borderRadius: "28px",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 10px 20px -5px rgba(15, 23, 42, 0.3)",
                  border: "1px solid #334155",
                }}
              >
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "10px",
                    }}
                  >
                    <DollarSign size={12} color="#3b82f6" />
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: "900",
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      A Receber •{" "}
                      {filtroRota === "Todos" ? "Geral" : filtroRota}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: "900",
                      color: "#ffffff",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {formatarMoeda(financeiro.pendenteHoje)}
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "60px",
                    height: "60px",
                    background: "#3b82f6",
                    filter: "blur(40px)",
                    opacity: 0.15,
                  }}
                ></div>
              </div>

              {/* CARD VISITAS */}
              <div
                style={{
                  background: "#ffffff",
                  padding: "20px",
                  borderRadius: "28px",
                  boxShadow: "0 10px 20px -5px rgba(0,0,0,0.04)",
                  border: "1px solid #f1f5f9",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "10px",
                  }}
                >
                  <Users size={12} color="#f59e0b" />
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: "900",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Visitas
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "26px",
                      fontWeight: "900",
                      color: "#1e293b",
                      lineHeight: 1,
                    }}
                  >
                    {cobrancasFiltradas.length}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "800",
                      color: "#f59e0b",
                      backgroundColor: "#fef3c7",
                      padding: "2px 8px",
                      borderRadius: "8px",
                    }}
                  >
                    pendentes
                  </span>
                </div>
              </div>
            </div>

            {/* Lista de Clientes */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {cobrancasFiltradas.length > 0 ? (
                cobrancasFiltradas.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "20px",
                      padding: "4px", // Pequeno respiro para o card interno
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <CardCliente
                      item={item}
                      hojeData={hojeData}
                      onPagar={setClientePagando}
                      onExcluir={(id) => deleteDoc(doc(db, "clientes", id))}
                      isFinalizando={idFinalizando === item.id}
                      editandoId={editandoId}
                      setEditandoId={setEditandoId}
                      valorTemporario={valorTemporario}
                      setValorTemporario={setValorTemporario}
                      novaDataTemporaria={novaDataTemporaria}
                      setNovaDataTemporaria={setNovaDataTemporaria}
                      salvarNovoValor={salvarNovoValor}
                      // ADICIONE ESTA LINHA ABAIXO:
                      abrirRemarcacao={abrirRemarcacao}
                    />
                  </div>
                ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#94a3b8",
                  }}
                >
                  Nenhum cliente encontrado.
                </div>
              )}
            </div>
          </div>
        )}

        {abaAtiva === "clientes" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "16px",
              paddingBottom: "120px",
            }}
          >
            {/* BOTÃO NOVO CLIENTE */}
            <button
              onClick={() => {
                setMostrarFormulario(!mostrarFormulario);
                setClienteSendoEditado(null);
              }}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "20px",
                fontWeight: "900",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                border: "none",
                backgroundColor: mostrarFormulario ? "#e2e8f0" : "#2563eb",
                color: mostrarFormulario ? "#475569" : "white",
                boxShadow: mostrarFormulario
                  ? "none"
                  : "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
                transition: "all 0.2s",
              }}
            >
              {mostrarFormulario ? <ArrowLeft size={18} /> : <Plus size={18} />}
              {mostrarFormulario ? "VOLTAR" : "NOVO CLIENTE"}
            </button>

            {mostrarFormulario ? (
              <FormularioCadastro
                novoCliente={novoCliente}
                setNovoCliente={setNovoCliente}
                aoCadastrar={cadastrarCliente}
                rotas={rotasDisponiveis}
                // PASSE ESTAS NOVAS PROPS AQUI:
                bairrosCadastrados={bairrosCadastrados}
                novoBairroNome={novoBairroNome}
                setNovoBairroNome={setNovoBairroNome}
                adicionarNovoBairro={adicionarNovoBairro}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <h2
                  style={{
                    fontSize: "10px",
                    fontWeight: "900",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    paddingLeft: "4px",
                  }}
                >
                  Base de Clientes ({cobrancasDia.length})
                </h2>

                {cobrancasDia.map((item) => {
                  const vTotal = Number(item.valorTotal) || 0;
                  const vParcela = Number(item.valorParcela) || 0;
                  const pago =
                    item.pagamentos?.reduce(
                      (acc, p) => acc + (Number(p.valor) || 0),
                      0,
                    ) || 0;
                  const restante = vTotal - pago;
                  const parcelasTexto = item.qtdParcelas
                    ? `${item.qtdParcelas}x`
                    : "1x";

                  return (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: "white",
                        padding: "24px",
                        borderRadius: "28px",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                        border: "1px solid #f1f5f9",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {/* CABEÇALHO DO CARD */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize: "18px",
                              fontWeight: "900",
                              color: "#1e293b",
                              margin: 0,
                            }}
                          >
                            {item.nome}
                          </h3>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: "#3b82f6",
                              textTransform: "uppercase",
                            }}
                          >
                            {item.produto || "Geral"}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => {
                              setNovoCliente(item);
                              setClienteSendoEditado(item.id);
                              setMostrarFormulario(true);
                            }}
                            style={{
                              border: "none",
                              background: "#eff6ff",
                              color: "#3b82f6",
                              padding: "8px",
                              borderRadius: "10px",
                            }}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() =>
                              window.confirm("Excluir?") &&
                              deleteDoc(doc(db, "clientes", item.id))
                            }
                            style={{
                              border: "none",
                              background: "#fff1f2",
                              color: "#f43f5e",
                              padding: "8px",
                              borderRadius: "10px",
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* GRID DE VALORES */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                          padding: "12px 0",
                          borderTop: "1px solid #f8fafc",
                          borderBottom: "1px solid #f8fafc",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontSize: "8px",
                              fontWeight: "900",
                              color: "#94a3b8",
                              textTransform: "uppercase",
                              margin: 0,
                            }}
                          >
                            Total Emprestado
                          </p>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "700",
                              margin: 0,
                            }}
                          >
                            {formatarMoeda(vTotal)}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p
                            style={{
                              fontSize: "8px",
                              fontWeight: "900",
                              color: "#94a3b8",
                              textTransform: "uppercase",
                              margin: 0,
                            }}
                          >
                            Parcela
                          </p>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "700",
                              margin: 0,
                            }}
                          >
                            {formatarMoeda(vParcela)}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "8px",
                              fontWeight: "900",
                              color: "#10b981",
                              textTransform: "uppercase",
                              margin: 0,
                            }}
                          >
                            Total Pago
                          </p>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "#10b981",
                              margin: 0,
                            }}
                          >
                            {formatarMoeda(pago)}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p
                            style={{
                              fontSize: "8px",
                              fontWeight: "900",
                              color: "#f43f5e",
                              textTransform: "uppercase",
                              margin: 0,
                            }}
                          >
                            Saldo Restante
                          </p>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "900",
                              color: "#f43f5e",
                              margin: 0,
                            }}
                          >
                            {formatarMoeda(restante)}
                          </p>
                        </div>
                      </div>

                      {/* INPUT DE BAIXA RÁPIDA */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          type="number"
                          placeholder="Valor pago"
                          id={`pgto-${item.id}`}
                          style={{
                            flex: 1,
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            padding: "10px",
                            fontSize: "12px",
                            fontWeight: "700",
                            outline: "none",
                          }}
                        />
                        <button
                          onClick={() => {
                            const inp = document.getElementById(
                              `pgto-${item.id}`,
                            );
                            registrarPagamentoAvulso(item, inp.value);
                            inp.value = "";
                          }}
                          style={{
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            padding: "0 16px",
                            fontSize: "10px",
                            fontWeight: "900",
                          }}
                        >
                          BAIXAR
                        </button>
                      </div>

                      {/* FOOTER DO CARD */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "#64748b",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          <Phone size={12} /> {item.telefone}
                        </div>
                        <div
                          style={{
                            backgroundColor: "#f1f5f9",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "800",
                            color: "#475569",
                          }}
                        >
                          PLANO: {parcelasTexto}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {abaAtiva === "relatorio" && (
          <div
            style={{
              padding: "16px",
              paddingBottom: "120px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* COMPONENTE FINANCEIRO (Onde ficam os cards de totais) */}
            <Financeiro
              totalRecebido={financeiro.recebidoHoje}
              totalPendente={financeiro.pendenteHoje}
              capitalNaRua={financeiro.totalNaRua}
              qtdClientes={cobrancasDia.length}
            />

            {/* SEÇÃO DE FERRAMENTAS / BACKUP */}
            <div
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "28px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "900",
                  color: "#1e293b",
                  margin: "0 0 4px 0",
                }}
              >
                Segurança dos Dados
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: "500",
                  marginBottom: "20px",
                }}
              >
                Exporte todos os seus clientes e históricos de pagamentos para
                um arquivo de segurança.
              </p>

              <div
                style={{
                  backgroundColor: "white",
                  padding: "24px",
                  borderRadius: "32px",
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "900",
                    color: "#1e293b",
                    marginBottom: "16px",
                  }}
                >
                  Gestão de Dados
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {/* BOTÃO PLANILHA */}
                  <button
                    onClick={exportarCSV}
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "16px",
                      border: "2px solid #f1f5f9",
                      background: "white",
                      color: "#475569",
                      fontWeight: "800",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    📊 Gerar Planilha (Excel/CSV)
                  </button>

                  {/* BOTÃO BACKUP JSON */}
                  <button
                    onClick={fazerBackup}
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "16px",
                      border: "none",
                      background: "#f8fafc",
                      color: "#64748b",
                      fontWeight: "800",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    📥 Baixar Backup de Segurança
                  </button>

                  {/* BOTÃO RESTAURAR */}
                  <label
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "16px",
                      border: "none",
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "white",
                      fontWeight: "900",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                  >
                    📤 Restaurar Dados
                    <input
                      type="file"
                      accept=".json"
                      onChange={restaurarBackup}
                      hidden
                    />
                  </label>
                </div>
              </div>

              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "12px",
                  fontSize: "10px",
                  color: "#94a3b8",
                  textAlign: "center",
                  fontWeight: "700",
                }}
              >
                Último backup automático: Hoje às {new Date().getHours()}:00
              </div>
            </div>
          </div>
        )}
      </main>

      <MenuInferior abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />

      {clientePagando && (
        <ModalPagamento
          cliente={clientePagando}
          onClose={() => setClientePagando(null)}
          valorDigitado={valorDigitadoPagamento}
          setValorDigitado={setValorDigitadoPagamento}
          onConfirmar={confirmarPagamentoModal}
          confirmarWhatsApp={confirmarWhatsApp}
          setConfirmarWhatsApp={setConfirmarWhatsApp}
        />
      )}
    </div>
  );
}
