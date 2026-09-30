"use strict";

const API_URL = "https://economia.awesomeapi.com.br/json/last/USD-BRL";
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

async function loadQuote() {
  const status = document.getElementById("status");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(API_URL, { signal: controller.signal });
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    const data = await response.json();
    const quote = data.USDBRL;
    // bid: valor de compra; high: máxima; low: mínima.
    if (!quote || ![quote.bid, quote.high, quote.low].every(
      value => typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) > 0
    )) throw new Error("Resposta da API inválida");

    document.getElementById("current-value").textContent = currencyFormatter.format(Number(quote.bid));
    document.getElementById("high-value").textContent = currencyFormatter.format(Number(quote.high));
    document.getElementById("low-value").textContent = currencyFormatter.format(Number(quote.low));
    status.textContent = "Cotação carregada com sucesso";

    const timestamp = Number(quote.timestamp);
    const date = new Date(timestamp * 1000);
    if (timestamp > 0 && !Number.isNaN(date.getTime())) {
      document.getElementById("quote-time").textContent = `Data da cotação: ${new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short", timeStyle: "medium", timeZone: "America/Sao_Paulo"
      }).format(date)} (horário de Brasília)`;
    }
  } catch (error) {
    status.textContent = "Não foi possível carregar a cotação. Tentaremos novamente na próxima atualização.";
    status.classList.add("error");
    console.error("Falha ao consultar a AwesomeAPI:", error);
  } finally {
    clearTimeout(timeout);
  }
}

loadQuote();