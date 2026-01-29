const FreteService = require('../services/FreteService');

class FreteController {
  async calcularFrete(req, res) {
    try {
      const { cepDestino, produtos } = req.body;

      if (!cepDestino) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'CEP de destino é obrigatório.' }));
        return;
      }

      // Garante que 'produtos' seja um array, mesmo que vazio
      const productList = produtos || [];

      const resultado = await FreteService.calcular(cepDestino, productList);
      
      res.statusCode = 200;
      res.end(JSON.stringify(resultado));
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error.message || 'Erro interno no servidor.' }));
    }
  }
}

module.exports = new FreteController();
