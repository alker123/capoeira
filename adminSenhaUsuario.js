import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  databaseURL: "https://dados-teste-8b85d-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Função para mostrar ou esconder a senha
const mostrarSenha = document.getElementById("mostrar-senha");
const senhaInput = document.getElementById("novo-user-senha");

mostrarSenha.addEventListener("change", (e) => {
  senhaInput.type = e.target.checked ? "text" : "password";
});

// Função para cadastrar usuário
document.getElementById("cadastrar-usuario-btn").onclick = () => {
  const user = document.getElementById("novo-user-nome").value.trim();
  const senha = document.getElementById("novo-user-senha").value.trim();

  if (!user || !senha) return alert("Preencha usuário e senha.");
  if (!user.includes('@')) return alert("O usuário deve ser um e-mail válido.");

  const usuarioSemArroba = user.split('@')[0];
  const rota = `${usuarioSemArroba}.html`; // ✅ Salva com .html

  // Salvar usuário no Firebase
  set(ref(db, 'usuarios/' + user), { senha, rota })
    .then(() => {
      alert("Usuário cadastrado com sucesso!");
      document.getElementById("novo-user-nome").value = "";
      document.getElementById("novo-user-senha").value = "";
      mostrarSenha.checked = false;
      senhaInput.type = "password";
    })
    .catch((error) => {
      alert("Erro ao cadastrar o usuário: " + error.message);
    });
};

// Função de login
document.getElementById("btnLogin").addEventListener("click", function () {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const msg = document.getElementById("mensagem");

  if (!usuario || !senha) {
    msg.textContent = "Preencha todos os campos!";
    return;
  }

  if (!usuario.includes('@')) {
    msg.textContent = "Usuário deve ser um e-mail válido!";
    return;
  }

  // Busca no Firebase
  get(ref(db, "usuarios/" + usuario))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const dados = snapshot.val();
        if (dados.senha === senha) {
          const rota = dados.rota || "index.html";
          const rotaSemHtml = rota.replace(".html", ""); // ✅ remove .html da URL
          window.location.href = `/${rotaSemHtml}`; // ✅ redireciona limpo
        } else {
          msg.textContent = "Senha incorreta!";
        }
      } else {
        msg.textContent = "Usuário não encontrado!";
      }
    })
    .catch((error) => {
      msg.textContent = "Erro ao acessar o banco de dados.";
      console.error(error);
    });
});
