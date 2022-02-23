const Sequelize = require("sequelize");
const connection = require("../database/database");
const Categoria = require("../categorias/Categoria");

const Artigo = connection.define('artigos', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false,
    }, 
    slug: {
        type: Sequelize.STRING,
        allowNull: false,
    }, 
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false,
    } 
});

Categoria.hasMany(Artigo); // um pra muitos
Artigo.belongsTo(Categoria); // um pra um

Artigo.sync({force: false});

module.exports = Artigo;