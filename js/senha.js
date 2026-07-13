import { auth } from "./firebase.js";

import {
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const formulario = document.getElementById("formRecuperarSenha");
const mensagem = document.getElementById("mensagemSenha");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const email = document.getElementById("email").value;

  try {
    await sendPasswordResetEmail(auth, email);
    mensagem.textContent = "E-mail enviado. Verifique sua caixa de entrada.";
  } catch (erro) {
    mensagem.textContent = "Não foi possível enviar o e-mail de recuperação.";
  }
});