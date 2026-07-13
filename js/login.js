import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const formulario = document.getElementById("formLogin");
const mensagem = document.getElementById("mensagemLogin");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    await signInWithEmailAndPassword(auth, email, senha);

    window.location.href = "index.html";
  } catch (erro) {
    if (erro.code === "auth/invalid-credential") {
      mensagem.textContent = "E-mail ou senha incorretos.";
    } else {
      mensagem.textContent = "Não foi possível entrar.";
    }
  }
});
document.getElementById("botaoVisitante").addEventListener("click", async () => {
  try {
    await signInAnonymously(auth);
    window.location.href = "index.html";
  } catch (erro) {
    alert("Não foi possível entrar como visitante.");
  }
});