require("dotenv").config();
const http = require("http");
const sequelize = require("./database/sequelize");
const BolsaController = require("./controllers/BolsaController");
const UsuarioController = require("./controllers/UsuarioController"); // Importado
const FreteController = require("./controllers/FreteController");
const path = require("path");
const fs = require("fs");

const server = http.createServer(async (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Adicionar Authorization
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  console.log(req.method, req.url);

   if (req.method === "GET" && req.url.startsWith("/images/")) {
    const filePath = path.join(__dirname, req.url);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end("Imagem não encontrada");
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp"
      };

      res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
      res.statusCode = 200;
      res.end(data);
    });

    return;
  }

  // ROTA DE CADASTRO DE USUÁRIO
  if (req.method === "POST" && req.url === "/api/auth/register") {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        req.body = JSON.parse(body);
        await UsuarioController.registrar(req, res);
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "JSON inválido" }));
      }
    });
    return;
  }

  // ROTA DE LOGIN DE USUÁRIO
  if (req.method === "POST" && req.url === "/api/auth/login") {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        req.body = JSON.parse(body);
        await UsuarioController.login(req, res);
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "JSON inválido" }));
      }
    });
    return;
  }

  // ROTA DE BOLSAS - CRIAR
  if (req.method === "POST" && req.url === "/api/bolsas") {
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

  // ROTA DE BOLSAS - LISTAR
  if (req.method === "GET" && req.url.startsWith("/api/bolsas")) {
    try {
      await BolsaController.listarBolsas(req, res);
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Erro ao listar bolsas" }));
    }
    return;
  }

  // ROTA DE CÁLCULO DE FRETE
  if (req.method === "POST" && req.url === "/api/frete/calcular") {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        // Adiciona um guarda para o caso do body ser vazio
        if (body) {
          req.body = JSON.parse(body);
        } else {
          req.body = {};
        }
        await FreteController.calcularFrete(req, res);
      } catch (error) {
        console.error("ERRO AO PROCESSAR REQUISIÇÃO DE FRETE:");
        console.error("CORPO BRUTO RECEBIDO:", body);
        console.error("ERRO DE PARSE:", error);
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "JSON inválido ou corpo da requisição vazio." }));
      }
    });
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