const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");
const categoriasController = require("./categorias/CategoriasController"); 
const artigosController = require("./artigos/ArtigosController"); 
const usuariosController = require("./usuarios/UsuariosController");

const Artigo = require("./artigos/Artigo");
const Categoria = require("./categorias/Categoria");

// conexao com o banco
connection.authenticate().then( () => {
    console.log("conexao feita com sucesso!");
}).catch( (msgErro) => {
    console.log(msgErro);
});

// session
app.use(
    session({
        secret: "qualquercoisa",
        cookie: {maxAge: 180000}
}));

// body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// importa os models
app.use("/", categoriasController);
app.use("/", artigosController);
app.use("/", usuariosController);

// view engine
app.set("view engine", "ejs");
app.use(express.static("public"));

app.listen(8080, () => {
    console.log("servidor rodando.........");
});

// rotas
app.get("/", (req, res) => {
    Artigo.findAll({ 
        order: [['createdAt', 'DESC']],
        limit: 4
    }).then(artigos => {
        Categoria.findAll().then(categorias => {
            res.render("index", {artigos: artigos, categorias: categorias});
        });
    });
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Artigo.findOne({
        where:{ slug: slug },
    }).then(artigo => {
        if (slug != undefined) {
            Categoria.findAll().then(categorias => {
                res.render("artigo", {artigo: artigo, categorias: categorias});
            });
        } else {
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    })
});

app.get("/categoria/:slug", (req, res) => {
    var slug = req.params.slug;
    Categoria.findOne({
        where:{ slug: slug },
        include: [{model: Artigo}]
    }).then(categoria => {
        if (categoria != undefined) {
            Categoria.findAll().then( categorias => {
                res.render("index", {artigos: categoria.artigos, categorias: categorias});
            });
        } else {
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    })
});

app.get("/categoria/:slug", (req, res) => {
    var slug = req.params.slug;
    Categoria.findOne({
        where: {slug: slug}
    }).then(categoria => {
        if (categoria != undefined) {
            Categoria.findAll().then( categorias => {
                res.redirect("index", {artigos: categoria.artigos, categorias: categorias})
            })
        } else {
            res.redirect("/")
        }
    })
});