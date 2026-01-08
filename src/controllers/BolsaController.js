const BolsaService = require ("../services/BolsaService");
const url = require("url");

class BolsaController {
    async criarBolsa(req, res) {
        try{
            const bolsa = await BolsaService.criarBolsa(req.body);

            res.statusCode = 201;
            res.end(JSON.stringify(bolsa))
        } catch (error) {
            res.statusCode = 400;
            res.end(
                JSON.stringify({error: error.message})
            );
        }
    }

    async listarBolsas(req, res) {
        try{
            const query = url.parse(req.url, true).query;

            if(query.marcador){
                const bolsa = await BolsaService.buscarPorMarcador(query.marcador);
                res.statusCode = 200;
                res.end(JSON.stringify(bolsa));

                 return;
            }

            const bolsas = await BolsaService.listarBolsas();
            res.statusCode = 200;
            res.end(JSON.stringify(bolsas));

        } catch (error) {   

            res.statusCode = 500
            res.end(JSON.stringify({error: "Error ao listar as bolsas"}))   
            
        }
    }
}

module.exports = new BolsaController();