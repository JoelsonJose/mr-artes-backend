const axios = require('axios');

class FreteService {
  async calcular(cepDestino, produtos) {
    try {
      const cepOrigem = '50740-400'; // Ex: CEP da loja - Mantenho o que já estava

      // O peso na ShowCommerce API parece ser em KG (ex: peso=1), não em gramas
      const pesoTotalKg = produtos.reduce((acc, produto) => acc + (produto.peso || 0.5), 0);
      const pesoFormatado = Math.max(0.1, pesoTotalKg).toFixed(2); // Mínimo 0.1kg

      const baseUrl = 'https://showcommerce.com.br/api/calculadora-frete/';

      // Fazer duas chamadas: uma para PAC e outra para SEDEX
      const [pacResponse, sedexResponse] = await Promise.all([
        axios.get(baseUrl, {
          params: {
            cep_origem: cepOrigem.replace(/\D/g, ''),
            cep_destino: cepDestino.replace(/\D/g, ''),
            servico: 'pac',
            peso: pesoFormatado,
            // A API não menciona altura, largura, comprimento, então não vou enviar
          }
        }),
        axios.get(baseUrl, {
          params: {
            cep_origem: cepOrigem.replace(/\D/g, ''),
            cep_destino: cepDestino.replace(/\D/g, ''),
            servico: 'sedex',
            peso: pesoFormatado,
          }
        })
      ]);

      const resultado = {};

      if (pacResponse.data && pacResponse.data.valor && pacResponse.data.prazo) {
        resultado.valorpac = pacResponse.data.valor;
        resultado.prazopac = parseInt(pacResponse.data.prazo.replace(/\D/g, '')) || 0;
      }

      if (sedexResponse.data && sedexResponse.data.valor && sedexResponse.data.prazo) {
        resultado.valorsedex = sedexResponse.data.valor;
        resultado.prazosedex = parseInt(sedexResponse.data.prazo.replace(/\D/g, '')) || 0;
      }
      
      if (!resultado.valorpac && !resultado.valorsedex) {
         throw new Error('Não foi possível obter os valores de frete para o CEP informado ou serviço indisponível.');
      }

      return resultado;

    } catch (error) {
      console.error("Erro ao calcular frete com ShowCommerce API:", error.response ? error.response.data : error.message);
      throw new Error('Falha ao se comunicar com a API de cálculo de frete.');
    }
  }
}

module.exports = new FreteService();
