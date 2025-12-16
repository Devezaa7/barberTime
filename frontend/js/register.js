const registerBtn = document.getElementById("register-btn");
const errorMsg = document.getElementById("error-msg");

registerBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  // Inputs
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Limpa mensagens
  errorMsg.textContent = "";
  errorMsg.classList.remove("success");

  // Validações básicas
  if (!name || !email || !password || !confirmPassword) {
    errorMsg.textContent = "Preencha todos os campos.";
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "A senha deve ter no mínimo 6 caracteres.";
    return;
  }

  if (password !== confirmPassword) {
    errorMsg.textContent = "As senhas não coincidem.";
    return;
  }

  // Dados para API
  const payload = {
    name,
    email,
    password
  };

  try {
    registerBtn.disabled = true;
    registerBtn.textContent = "CRIANDO CONTA...";

    const response = await fetch("https://barbertime-api.onrender.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      errorMsg.textContent = data.message || "Erro ao criar conta.";
      return;
    }

    // Sucesso
    errorMsg.textContent = "Conta criada com sucesso! Redirecionando...";
    errorMsg.classList.add("success");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);

  } catch (error) {
    errorMsg.textContent = "Erro de conexão com o servidor.";
  } finally {
    registerBtn.disabled = false;
    registerBtn.textContent = "CRIAR CONTA";
  }
});
