const { Sequelize } = require("sequelize");
const sequelize = require("../database/sequelize");

const Bolsa = sequelize.define(
    'bolsas', 
    {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false,
    },
    preco:{
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
    },
    marcador:{
        type: Sequelize.STRING,
        allowNull: false,
    },
},
{
    tableName:'bolsas',
    timestamps: true
});

module.exports = Bolsa;