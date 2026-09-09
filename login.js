const usuario = prompt("Digite seu nome de usuário:");
const senha = prompt("Digite sua senha:");

if (usuario === "admin" && senha === "1234") {
  alert("Login bem-sucedido!");
} else if (usuario === "admin") {
  alert("Senha incorreta!");
} else {
  alert("Usuário não encontrado!");
}
