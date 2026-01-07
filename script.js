const ADMIN_PASSWORD = "2026"; // troque depois

let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

let historico = JSON.parse(localStorage.getItem("historico")) || [];

let lutadorAtual = null;

/* PERFIL */

function criarPerfil() {

  const nomeL = nome.value;

  const estiloL = estilo.value;

  lutadorAtual = ranking.find(l => l.nome === nomeL);

  if (!lutadorAtual) {

    lutadorAtual = {

      nome: nomeL,

      estilo: estiloL,

      xp: 0

    };

    ranking.push(lutadorAtual);

  }

  salvar();

  atualizar();

  atualizarRanking();

  atualizarOponentes();

  atualizarHistorico();

}

/* XP */

function ganharXP(valor) {

  if (!lutadorAtual) return alert("Crie um perfil primeiro!");

  lutadorAtual.xp += valor;

  if (lutadorAtual.xp < 0) lutadorAtual.xp = 0;

  salvar();

  atualizar();

  atualizarRanking();

}

/* RANK */

function getRank(xp) {

  if (xp >= 500) return "Mestre";

  if (xp >= 250) return "Ouro";

  if (xp >= 100) return "Prata";

  return "Bronze";

}

/* UI PERFIL */

function atualizar() {

  if (!lutadorAtual) return;

  status.innerHTML = `

    <h2>${lutadorAtual.nome}</h2>

    <p>Estilo: ${lutadorAtual.estilo}</p>

    <p>XP: ${lutadorAtual.xp}</p>

    <p>Rank: ${getRank(lutadorAtual.xp)}</p>

  `;

}

/* RANKING */

function atualizarRanking() {

  ranking.sort((a, b) => b.xp - a.xp);

  rankingDiv.innerHTML = ranking.map((l, i) =>

    `<p>#${i + 1} 🥋 ${l.nome} (${l.estilo}) - ${l.xp} XP</p>`

  ).join("");

  atualizarOponentes();

}

/* OPONENTES */

function atualizarOponentes() {

  if (!lutadorAtual) return;

  oponente.innerHTML = ranking

    .filter(l => l.nome !== lutadorAtual.nome)

    .map(l => `<option value="${l.nome}">${l.nome} (${l.xp} XP)</option>`)

    .join("");

}

/* LUTA PvP */

function lutar() {

  if (!lutadorAtual) return;

  const nomeOp = oponente.value;

  const inimigo = ranking.find(l => l.nome === nomeOp);

  if (!inimigo) return;

  const poderJogador = lutadorAtual.xp + Math.random() * 100;

  const poderInimigo = inimigo.xp + Math.random() * 100;

  let resultado = "";

  if (poderJogador > poderInimigo) {

    ganharXP(30);

    inimigo.xp -= 15;

    resultado = `🏆 ${lutadorAtual.nome} venceu ${inimigo.nome}`;

  } else {

    ganharXP(-10);

    inimigo.xp += 20;

    resultado = `💀 ${lutadorAtual.nome} perdeu para ${inimigo.nome}`;

  }

  historico.unshift(resultado);

  if (historico.length > 10) historico.pop();

  salvar();

  atualizarRanking();

  atualizarHistorico();

  alert(resultado);

}

/* HISTÓRICO */

function atualizarHistorico() {

  historicoDiv.innerHTML = historico.map(h => `<p>${h}</p>`).join("");

}

/* DESAFIO DIÁRIO */

function desafioDiario() {

  if (!lutadorAtual) return;

  const desafios = [

    { nome: "Treino de socos", xp: 20 },

    { nome: "Treino de chutes", xp: 30 },

    { nome: "Condicionamento físico", xp: 25 },

    { nome: "Kata / Técnica", xp: 35 }

  ];

  const d = desafios[Math.floor(Math.random() * desafios.length)];

  ganharXP(d.xp);

  alert(`🎯 Desafio concluído: ${d.nome} (+${d.xp} XP)`);

}

/* CHAT */

function enviarMsg() {

  if (!lutadorAtual) return;

  mensagens.innerHTML += `<p><b>${lutadorAtual.nome}:</b> ${msg.value}</p>`;

  msg.value = "";

}

/* STORAGE */

function salvar() {

  localStorage.setItem("ranking", JSON.stringify(ranking));

  localStorage.setItem("historico", JSON.stringify(historico));

}

atualizarRanking();

atualizarHistorico();

function resetarMeuPerfil() {

  if (!lutadorAtual) return alert("Nenhum perfil ativo.");

  const confirmar = confirm(

    `⚠️ Isso apagará APENAS o perfil "${lutadorAtual.nome}".\nDeseja continuar?`

  );

  if (!confirmar) return;

  ranking = ranking.filter(l => l.nome !== lutadorAtual.nome);

  lutadorAtual = null;

  salvar();

  status.innerHTML = "";

  atualizarRanking();

  atualizarOponentes();

  alert("✅ Seu perfil foi removido com sucesso!");

}

function adminReset() {

  const senha = prompt("🔐 Digite a senha de administrador:");

  if (senha !== ADMIN_PASSWORD) {

    alert("❌ Senha incorreta!");

    return;

  }

  const confirmar = confirm(

    "⚠️ RESET TOTAL!\nIsso apagará TODOS os lutadores e histórico.\nDeseja continuar?"

  );

  if (!confirmar) return;

  localStorage.clear();

  ranking = [];

  historico = [];

  lutadorAtual = null;

  status.innerHTML = "";

  rankingDiv.innerHTML = "";

  historicoDiv.innerHTML = "";

  mensagens.innerHTML = "";

  oponente.innerHTML = "";

  alert("✅ Reset total realizado (Admin Mode).");

}