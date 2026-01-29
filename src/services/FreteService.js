const axios = require('axios');

class FreteService {
  async calcular(cepDestino, produtos) {
    try {
      const apiKey = process.env.CEP_CERTO_API_KEY || 'f18ce2c74205b9c306387d9296e25b7eec3e48f7dd26a1f422fdfdf75f033c84770109e1a0944c8e91be72f6d29da905ea63f62a84f28fc312b0a668ad233eb5'; 
      const cepOrigem = '50740-400'; // Ex: CEP da loja

      // Peso em KG, convertido para Gramas (mínimo 300g)
      const pesoTotalKg = produtos.reduce((acc, produto) => acc + (produto.peso || 0.5), 0);
      const pesoTotalGr = Math.max(300, pesoTotalKg * 1000);

      // Dimensões em cm, com valores mínimos conforme a documentação
      const altura = 20;      // min 0.4cm
      const largura = 20;     // min 11cm
      const comprimento = 20; // min 13cm
      
      const cepOrigemNumeros = cepOrigem.replace(/\D/g, '');
      const cepDestinoNumeros = cepDestino.replace(/\D/g, '');

      // Monta a URL com os parâmetros no path
      const url = `https://cepcerto.com/ws/json-frete/${cepOrigemNumeros}/${cepDestinoNumeros}/${pesoTotalGr}/${altura}/${largura}/${comprimento}/${apiKey}`;

      const response = await axios.get(url);

      if (response.data && (response.data.valorpac || response.data.valorsedex)) {
        return response.data;
      } else {
        // A API pode retornar um objeto vazio ou com erro
        console.warn("Resposta da API Cep Certo sem valores de frete:", response.data);
        throw new Error('Não foi possível obter os valores de frete para o CEP informado.');
      }

    } catch (error) {
      console.error("Erro ao calcular frete com Cep Certo:", error.response ? error.response.data : error.message);
      throw new Error('Falha ao se comunicar com a API de cálculo de frete.');
    }
  }
}

module.exports = new FreteService();
