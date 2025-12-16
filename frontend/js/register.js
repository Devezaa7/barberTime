const API_URL = 'https://barbertime-api.onrender.com';

const registerBtn = document.getElementById("register-btn");
const errorMsg = document.getElementById("error-msg");

registerBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  // Inputs
  const nome = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefone = document.getElementById("phone")?.value.trim() || ""; // Se tiver campo telefone
  const senha = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Limpa mensagens
  errorMsg.textContent = "";
  errorMsg.classList.remove("success");

  // Validações básicas
  if (!nome || !email || !senha || !confirmPassword) {
    errorMsg.textContent = "Preencha todos os campos.";
    return;
  }

  if (senha.length < 6) {
    errorMsg.textContent = "A senha deve ter no mínimo 6 caracteres.";
    return;
  }

  if (senha !== confirmPassword) {
    errorMsg.textContent = "As senhas não coincidem.";
    return;
  }

  // Dados para API (com os nomes corretos que o backend espera)
  const payload = {
    nome,
    email,
    telefone,
    senha
  };

  try {
    registerBtn.disabled = true;
    registerBtn.textContent = "CRIANDO CONTA...";

    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      errorMsg.textContent = data.error || data.message || "Erro ao criar conta.";
      return;
    }

    // Sucesso
    errorMsg.textContent = "Conta criada com sucesso! Redirecionando...";
    errorMsg.classList.add("success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);

  } catch (error) {
    errorMsg.textContent = "Erro de conexão com o servidor.";
  } finally {
    registerBtn.disabled = false;
    registerBtn.textContent = "CRIAR CONTA";
  }
});
