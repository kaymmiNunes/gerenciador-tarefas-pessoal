import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  ref,
  push,
  set,
  update,
  remove,
  onValue
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
const dataInput = document.getElementById("dataInput");

const hoje = new Date();
const dataMinima =
  `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

dataInput.min = dataMinima;

let tarefaEmEdicao = null;
let tarefas = [];
let usuarioAtual = null;

function escaparHtml(texto) {
  const elemento = document.createElement("div");
  elemento.textContent = texto || "";
  return elemento.innerHTML;
}

function inserirPorPrioridade(item) {
  const lista = document.getElementById("listaPendentes");
  const prioridade = item.dataset.prioridade;

  if (prioridade === "alta") {
    lista.insertBefore(item, lista.firstChild);
    return;
  }

  if (prioridade === "media") {
    const itens = lista.querySelectorAll("li");

    for (const tarefa of itens) {
      if (tarefa.dataset.prioridade === "baixa") {
        lista.insertBefore(item, tarefa);
        return;
      }
    }
  }

  lista.appendChild(item);
}

function criarItem(tarefa) {
  const item = document.createElement("li");

  item.dataset.id = tarefa.id;
  item.dataset.prioridade = tarefa.prioridade;
  item.classList.add(`prioridade-${tarefa.prioridade}`);

  const texto = escaparHtml(tarefa.texto);
  const data = escaparHtml(tarefa.data || "Sem data");
  const prioridade = escaparHtml(tarefa.prioridade.toUpperCase());

  item.innerHTML = `
    <span class="texto-tarefa">${texto}</span><br>
    <span class="data-tarefa">📅 ${data}</span><br>
    <span class="prioridade">
      ⭐ Prioridade: <strong>${prioridade}</strong>
    </span>
    <br><br>

    ${
      tarefa.concluida
        ? ""
        : `
          <button class="botao-editar" onclick="editarTarefa(this)">
            Editar
          </button>

          <button class="botao-concluir" onclick="concluirTarefa(this)">
            Concluir
          </button>
        `
    }

    <button class="botao-excluir" onclick="excluirTarefa(this)">
      Excluir
    </button>
  `;

  return item;
}

function carregarTarefas() {
  const pendentes = document.getElementById("listaPendentes");
  const concluidas = document.getElementById("listaConcluidas");

  pendentes.innerHTML = "";
  concluidas.innerHTML = "";

  tarefas.forEach((tarefa) => {
    const item = criarItem(tarefa);

    if (tarefa.concluida) {
      concluidas.appendChild(item);
    } else {
      inserirPorPrioridade(item);
    }
  });

  atualizarResumo();
}

function atualizarResumo() {
  const pendentes = document.querySelectorAll("#listaPendentes li").length;
  const concluidas = document.querySelectorAll("#listaConcluidas li").length;

  document.getElementById("totalPendentes").textContent = pendentes;
  document.getElementById("totalConcluidas").textContent = concluidas;
  document.getElementById("totalTarefas").textContent =
    pendentes + concluidas;
}

window.adicionarTarefa = async function () {
  const input = document.getElementById("tarefaInput");
  const inputData = document.getElementById("dataInput");
  const inputPrioridade = document.getElementById("prioridade");

  const texto = input.value.trim();
  const data = inputData.value;
  const prioridade = inputPrioridade.value;
  if (data === "") {
  alert("Escolha uma data.");
  return;
}

if (data < dataMinima) {
  alert("Não é permitido adicionar tarefas com datas passadas.");
  return;
}

  if (texto === "") {
    alert("Digite uma tarefa.");
    return;
  }

  try {
    const tarefasRef = ref(db, `usuarios/${usuarioAtual.uid}/tarefas`);

    if (tarefaEmEdicao) {
      await update(
        ref(db, `usuarios/${usuarioAtual.uid}/tarefas/${tarefaEmEdicao}`),
        { texto, data, prioridade }
      );

      tarefaEmEdicao = null;
      document.getElementById("botaoAdicionar").textContent = "Adicionar";
    } else {
      const novaTarefaRef = push(tarefasRef);

      await set(novaTarefaRef, {
        texto,
        data,
        prioridade,
        concluida: false
      });
    }

    input.value = "";
    inputData.value = "";
    inputPrioridade.value = "baixa";
  } catch (erro) {
    alert("Não foi possível salvar a tarefa.");
  }
};

window.editarTarefa = function (botao) {
  const item = botao.parentElement;
  const tarefa = tarefas.find((t) => t.id === item.dataset.id);

  if (!tarefa) return;

  tarefaEmEdicao = tarefa.id;

  document.getElementById("tarefaInput").value = tarefa.texto;
  document.getElementById("dataInput").value = tarefa.data;
  document.getElementById("prioridade").value = tarefa.prioridade;
  document.getElementById("botaoAdicionar").textContent = "Salvar alterações";
};

window.concluirTarefa = async function (botao) {
  const item = botao.parentElement;

  try {
    await update(
      ref(db, `usuarios/${usuarioAtual.uid}/tarefas/${item.dataset.id}`),
      { concluida: true }
    );
  } catch (erro) {
    alert("Não foi possível concluir a tarefa.");
  }
};

window.excluirTarefa = async function (botao) {
  const item = botao.parentElement;

  try {
    await remove(
      ref(db, `usuarios/${usuarioAtual.uid}/tarefas/${item.dataset.id}`)
    );
  } catch (erro) {
    alert("Não foi possível excluir a tarefa.");
  }
};

document.getElementById("botaoSair").addEventListener("click", async (evento) => {
  evento.preventDefault();

  await signOut(auth);
  window.location.href = "login.html";
});

onAuthStateChanged(auth, (usuario) => {
  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  usuarioAtual = usuario;

  const tarefasRef = ref(db, `usuarios/${usuario.uid}/tarefas`);

  onValue(tarefasRef, (resultado) => {
    const dados = resultado.val() || {};

    tarefas = Object.entries(dados).map(([id, tarefa]) => ({
      id,
      ...tarefa
    }));

    carregarTarefas();
  });
});