import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  ref,
  set
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const formulario = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagemCadastro");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmar-senha").value;

  if (senha !== confirmarSenha) {
    mensagem.textContent = "As senhas não são iguais.";
    return;
  }

  try {
    const resultado = await createUserWithEmailAndPassword(auth, email, senha);
    const usuario = resultado.user;

    await updateProfile(usuario, {
      displayName: nome
    });

    await set(ref(db, `usuarios/${usuario.uid}`), {
      nome: nome,
      email: email,
      criadoEm: new Date().toISOString()
    });

    window.location.href = "index.html";
  } catch (erro) {
    if (erro.code === "auth/email-already-in-use") {
      mensagem.textContent = "Este e-mail já está cadastrado.";
    } else if (erro.code === "auth/weak-password") {
      mensagem.textContent = "A senha precisa ter pelo menos 6 caracteres.";
    } else {
      mensagem.textContent = "Não foi possível realizar o cadastro.";
    }
  }
});