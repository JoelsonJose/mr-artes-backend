const Bolsa = require("../models/Bolsa")

class BolsaService {

    async criarBolsa({nome, descricao, preco, marcador, imagem}) {
        if (!nome || !descricao || !preco || !marcador){
            throw new Error("Todos os campos são obrigatórios") 
        }

        if (Number(preco) <= 0 ){
            throw new Error ("O preço deve ser maior que zero")
        } 

        const bolsa = await Bolsa.create({
            nome,
            descricao,
            preco,
            marcador,
            imagem
        });

        return bolsa;
    }

    async listarBolsas (filtro = {}) {
        const bolsas = await Bolsa.findAll({
            where: filtro
        })

        return bolsas;
    }

    async buscarPorMarcador(marcador) {
        if (!marcador) {
            throw new Error("Marcador é obrigatório")
        }

        const bolsas = await Bolsa.findAll({
            where:{ marcador }
        })

        return bolsas
    }
}

module.exports = new BolsaService();