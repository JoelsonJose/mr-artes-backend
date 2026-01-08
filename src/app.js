require("dotenv").config();
const http = require("http");
const sequelize = require("./database/sequelize");
const BolsaController = require("./controllers/BolsaController");

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("Banco de dados conectado com sucesso");

        await sequelize.sync();
        console.log("Tabelas sincronizadas");

        const server = http.createServer(async (req, res) => {
            console.log(req.method, req.url);

            res.setHeader("Content-Type", "application/json");

            if (req.method === "POST" && req.url === "/bolsas") {
                let body = "";

                req.on("data", (chunk) => {
                    body += chunk;
                });

                req.on("end", async () => {
                    try {
                        req.body = JSON.parse(body);
                        await BolsaController.criarBolsa(req, res);
                    } catch (error) {
                        res.statusCode = 400;
                        res.end(
                            JSON.stringify({ error: "JSON inválido ou dados incorretos" })
                        );
                    }
                });

                return;
            }

            if (req.method === "GET" && req.url.startsWith("/bolsas")) {
                try {
                    await BolsaController.listarBolsas(req, res);
                } catch (error) {
                    res.statusCode = 500;
                    res.end(
                        JSON.stringify({ error: "Erro ao listar bolsas" })
                    );
                }
                return;
            }

            res.statusCode = 404;
            res.end(
                JSON.stringify({ error: "Rota não encontrada" })
            );
        });

        const PORT = process.env.PORT || 3000;

        server.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error("Erro ao iniciar servidor:", error);
    }
}

startServer();
