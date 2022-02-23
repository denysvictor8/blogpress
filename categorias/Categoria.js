const Sequelize = require("sequelize");
const connection = require("../database/database");

const Categoria = connection.define('categorias', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false,
    }, 
    slug: {
        type: Sequelize.STRING,
        allowNull: false,
    } 
});

// o force recebera false para criar a entidade no banco de dados caso ela nao exista, 
// pode-se atribuir true mas a entidade sera recriada toda vez que reiniciar o projeto,
// uma vez criada, deve-se atribuir valor false(se tiver atribuido true) ou entao remover a linha abaixo
Categoria.sync({force: false});

module.exports = Categoria;