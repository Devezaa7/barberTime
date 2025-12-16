const resetBtn = document.getElementById("reset-btn");
const msg = document.getElementById("msg");

// Pega token da URL (?token=xxxx)
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

resetBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  msg.textContent = "";
  msg.classList.remove("success");

  if (!token) {
    msg.textContent = "Token inválido ou expirado.";
    return;
  }

  if (!password || !confirmPassword) {
    msg.textContent = "Preencha todos os campos.";
    return;
  }

  if (password.length < 6) {
    msg.textContent = "A senha deve ter no mínimo 6 caracteres.";
    return;
  }

  if (password !== confirmPassword) {
    msg.textContent = "As senhas não coincidem.";
    return;
  }

  try {
    resetBtn.disabled = true;
    resetBtn.textContent = "ATUALIZANDO...";

    const response = await fetch("https://barbertime-api.onrender.com/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      msg.textContent = data.message || "Erro ao redefinir senha.";
      return;
    }

    msg.textContent = "Senha atualizada com sucesso! Redirecionando...";
    msg.classList.add("success");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);

  } catch (error) {
    msg.textContent = "Erro de conexão com o servidor.";
  } finally {
    resetBtn.disabled = false;
    resetBtn.textContent = "ATUALIZAR SENHA";
  }
});
