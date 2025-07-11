 
    // Verifica se o usuário está autenticado ao carregar a página
    if (!sessionStorage.getItem("loggedIn")) {
      // Se não estiver autenticado, redireciona para a página de login
      window.location.href = "login.html";
    }
  