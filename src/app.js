require("dotenv").config();
const http = require("http");
const sequelize = require("./database/sequelize");
const BolsaController = require("./controllers/BolsaController");

const server = http.createServer(async (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  console.log(req.method, req.url);

  if (req.method === "POST" && req.url === "/bolsas") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        req.body = JSON.parse(body);
        await BolsaController.criarBolsa(req, res);
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "JSON inválido" }));
      }
    });

    return;
  }

  if (req.method === "GET" && req.url === "/bolsas") {
    try {
      await BolsaController.listarBolsas(req, res);
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Erro ao listar bolsas" }));
    }
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Rota não encontrada" }));
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Banco conectado");

    await sequelize.sync();
    console.log("Tabelas sincronizadas");

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
  }
}

startServer();