const FreteService = require('../services/FreteService');

class FreteController {
  async calcularFrete(req, res) {
    try {
      const { cepDestino, produtos } = req.body;

      if (!cepDestino) {
        return res.status(400).json({ error: 'CEP de destino é obrigatório.' });
      }

      // Garante que 'produtos' seja um array, mesmo que vazio
      const productList = produtos || [];

      const resultado = await FreteService.calcular(cepDestino, productList);
      
      return res.json(resultado);
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      // Retorna a mensagem de erro do serviço, se disponível
      return res.status(500).json({ error: error.message || 'Erro interno no servidor.' });
    }
  }
}

module.exports = new FreteController();
