// ===============================
// Declarando
// ===============================

let tarefaEmEdicao = null;
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

// -------------------------------
// ADICIONAR ou salvar
// -------------------------------
function adicionarTarefa() {

    const input = document.getElementById("tarefaInput");
    const inputData = document.getElementById("dataInput");
    const inputPrioridade = document.getElementById("prioridade");

    const texto = input.value.trim();
    const data = inputData.value;
    const prioridade = inputPrioridade.value;

    console.log("Sua tarefa foi adicionada como pendente");

    if (texto === "") {
        alert("Digite uma tarefa.");
        return;
    }

    // ==========================
    // Editar uma tarefa
    // ==========================

    if (tarefaEmEdicao != null) {

        const textoAntigo =
            tarefaEmEdicao.querySelector(".texto-tarefa").textContent;

        tarefaEmEdicao.querySelector(".texto-tarefa").textContent = texto;
        tarefaEmEdicao.querySelector(".data-tarefa").textContent = "📅 " + data;

        tarefaEmEdicao.querySelector(".prioridade").innerHTML =
            `⭐ Prioridade: <strong>${prioridade.toUpperCase()}</strong>`;

        tarefaEmEdicao.dataset.prioridade = prioridade;

        tarefaEmEdicao.className = "";
        tarefaEmEdicao.classList.add("prioridade-" + prioridade);

        // Atualiza também o array
        const tarefa = tarefas.find(t => t.texto === textoAntigo);

        if (tarefa) {
            tarefa.texto = texto;
            tarefa.data = data;
            tarefa.prioridade = prioridade;
        }

        salvarTarefas();

        tarefaEmEdicao.remove();
        inserirPorPrioridade(tarefaEmEdicao);

        tarefaEmEdicao = null;

        document.getElementById("botaoAdicionar").textContent = "Adicionar";

        input.value = "";
        inputData.value = "";
        inputPrioridade.value = "baixa";

        atualizarResumo();

        return;
    }

    // ==========================
    // Nova tarefa
    // ==========================

    const item = document.createElement("li");

    item.dataset.prioridade = prioridade;

    item.classList.add("prioridade-" + prioridade);

    item.innerHTML = `
        <span class="texto-tarefa">${texto}</span><br>

        <span class="data-tarefa">📅 ${data}</span><br>

        <span class="prioridade">
            ⭐ Prioridade: <strong>${prioridade.toUpperCase()}</strong>
        </span>

        <br><br>

        <button class="botao-editar" onclick="editarTarefa(this)">
            Editar
        </button>

        <button class="botao-concluir" onclick="concluirTarefa(this)">
            Concluir
        </button>

        <button class="botao-excluir" onclick="excluirTarefa(this)">
            Excluir
        </button>
    `;

    tarefas.push({
        texto: texto,
        data: data,
        prioridade: prioridade,
        concluida: false
    });

    salvarTarefas();

    inserirPorPrioridade(item);

    input.value = "";
    inputData.value = "";
    inputPrioridade.value = "baixa";

    atualizarResumo();
}
// -------------------------------
// EDITAR
// -------------------------------

function editarTarefa(botao){

    tarefaEmEdicao = botao.parentElement;

    document.getElementById("tarefaInput").value =
        tarefaEmEdicao.querySelector(".texto-tarefa").textContent;

    document.getElementById("dataInput").value =
        tarefaEmEdicao.querySelector(".data-tarefa").textContent.replace("📅 ", "");

    document.getElementById("prioridade").value =
        tarefaEmEdicao.dataset.prioridade;

    document.getElementById("botaoAdicionar").textContent =
        "Salvar Alterações";

    console.log("Sua tarefa foi editada com sucesso");
}


// -------------------------------
// Concluir
// -------------------------------

function concluirTarefa(botao){

    const item = botao.parentElement;

    document.getElementById("listaConcluidas").appendChild(item);

    const editar = item.querySelector(".botao-editar");

    if(editar){
        editar.remove();
    }

    botao.remove();

    const texto = item.querySelector(".texto-tarefa").textContent;

    const tarefa = tarefas.find(t => t.texto === texto);

    if(tarefa){
        tarefa.concluida = true;
        salvarTarefas();
    }

    atualizarResumo();

    console.log("Sua tarefa foi concluida com sucesso");
}


// -------------------------------
// Apagar
// -------------------------------

function excluirTarefa(botao){

    const item = botao.parentElement;

    const texto = item.querySelector(".texto-tarefa").textContent;

    tarefas = tarefas.filter(t => t.texto !== texto);

    salvarTarefas();

    item.remove();

    atualizarResumo();

    console.log("Sua tarefa foi excluida com sucesso");
}


// -------------------------------
// INSERIR or prioridade
// -------------------------------

function inserirPorPrioridade(item){

    const lista = document.getElementById("listaPendentes");

    const prioridade = item.dataset.prioridade;

    if(prioridade === "alta"){

        lista.insertBefore(item, lista.firstChild);

        console.log("Sua tarefa foi priorizada");

        return;
    }

    if(prioridade === "media"){

        const listaItens = lista.querySelectorAll("li");

        for(let tarefa of listaItens){

            if(tarefa.dataset.prioridade === "baixa"){

                lista.insertBefore(item, tarefa);

                console.log("Sua tarefa foi priorizada");

                return;
            }

        }

    }

    lista.appendChild(item);

}
// -------------------------------
// SALVAR TAREFAS
// -------------------------------

function salvarTarefas() {

    localStorage.setItem("tarefas", JSON.stringify(tarefas));

}

function carregarTarefas() {

    tarefas.forEach(tarefa => {

        const item = document.createElement("li");

        item.dataset.prioridade = tarefa.prioridade;

        item.classList.add("prioridade-" + tarefa.prioridade);

        item.innerHTML = `
            <span class="texto-tarefa">${tarefa.texto}</span><br>

            <span class="data-tarefa">📅 ${tarefa.data}</span><br>

            <span class="prioridade">
                ⭐ Prioridade:
                <strong>${tarefa.prioridade.toUpperCase()}</strong>
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

        if (tarefa.concluida) {

            document.getElementById("listaConcluidas").appendChild(item);

        } else {

            inserirPorPrioridade(item);

        }

    });

    atualizarResumo();

}

// -------------------------------
// Resumo
// -------------------------------

function atualizarResumo(){

    const pendentes =
        document.querySelectorAll("#listaPendentes li").length;

    const concluidas =
        document.querySelectorAll("#listaConcluidas li").length;

    document.getElementById("totalPendentes").textContent =
        pendentes;

    document.getElementById("totalConcluidas").textContent =
        concluidas;

    document.getElementById("totalTarefas").textContent =
        pendentes + concluidas;

}

// -------------------------------
// Iniciar salvamento de dados
// -------------------------------

carregarTarefas();
