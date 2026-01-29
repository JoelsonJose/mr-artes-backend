const axios = require('axios');

class FreteService {
  async calcular(cepDestino, produtos) {
    try {
      // TODO: O usuário precisa substituir pela sua chave de API real
      const apiKey = process.env.CEP_CERTO_API_KEY || 'f18ce2c74205b9c306387d9296e25b7eec3e48f7dd26a1f422fdfdf75f033c84770109e1a0944c8e91be72f6d29da905ea63f62a84f28fc312b0a668ad233eb5'; 
      
      // TODO: O CEP de origem deve ser configurável
      const cepOrigem = '50740-400'; // Ex: CEP da loja

      // Calcular peso total e dimensões (usando valores padrão por enquanto)
      // Idealmente, os produtos teriam peso e dimensões no banco de dados
      const pesoTotal = produtos.reduce((acc, produto) => acc + (produto.peso || 0.5), 0); // Peso padrão de 0.5kg
      const volumeTotal = {
        altura: 20, // cm
        largura: 20, // cm
        comprimento: 20, // cm
      };

      const url = 'https://www.cepcerto.com/ws/json-frete';

      const params = {
        cep_origem: cepOrigem.replace('-', ''),
        cep_destino: cepDestino.replace('-', ''),
        peso: pesoTotal,
        altura: volumeTotal.altura,
        largura: volumeTotal.largura,
        comprimento: volumeTotal.comprimento,
        chave: apiKey,
      };

      // A API do CepCerto espera os parâmetros na URL
      const response = await axios.get(url, { params });

      if (response.data) {
        // A API retorna um objeto diretamente, não um array
        // Ex: { "valorpac": "21,53", "prazopac": 8, "valorsedex": "34,43", "prazosedex": 3, ... }
        return response.data;
      } else {
        throw new Error('A API do Cep Certo não retornou dados válidos.');
      }

    } catch (error) {
      console.error("Erro ao calcular frete com Cep Certo:", error.response ? error.response.data : error.message);
      throw new Error('Falha ao se comunicar com a API de cálculo de frete.');
    }
  }
}

module.exports = new FreteService();
