const express = require('express');
const { default: slugify } = require('slugify');
const router = express.Router();
const Artigo = require('./Artigo');
const Categoria = require('../categorias/Categoria');
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/artigos", adminAuth, (req, res) => {
    Artigo.findAll({ 
        order: [['id', 'ASC']], 
        include: [{ model: Categoria }] 
    }).then( artigos => {
        res.render("admin/artigos/index", {artigos: artigos });
    });
});

router.get("/admin/artigos/novo", adminAuth, (req, res) => {
    Categoria.findAll().then(categorias => {
        res.render("admin/artigos/novo", {categorias: categorias});
    })
});

router.post("/artigos/salvar", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var categoria = req.body.categoria;
    if (titulo != undefined) {
        Artigo.create({
            titulo: titulo, slug: slugify(titulo), descricao: descricao, categoriaId: categoria
        }).then(() => {
            res.redirect("/admin/artigos")
        });
    } else {
        res.redirect("/")
    }
});

router.post("/artigos/deletar", (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        Artigo.destroy({
            where: { id: id }
        }).then(() => {
            res.redirect("/admin/artigos")
        });
    } else {
        res.redirect("/")
    }
});

router.get("/admin/artigos/editar/:id", (req, res) => {
    var id = req.params.id;
    if (!isNaN(id)) {       
        Artigo.findByPk(id).then( artigo => {
            if (artigo != undefined) {
                Categoria.findAll().then(categorias => {
                    res.render("admin/artigos/editar", {artigo: artigo, categorias: categorias});
                })
            } else {
                res.redirect("admin/artigos");
            }
        }).catch( err => {
            res.redirect("/")
        });        
    } else {
        res.redirect("/")
    }
});

router.post("/artigos/atualizar", (req, res) => {
    var id = req.body.id;
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var categoria = req.body.categoria;
    Artigo.update(
        {titulo: titulo, descricao: descricao, categoriaId: categoria, slug: slugify(titulo)},
        {where: { id: id }}
    ).then(() => {
        res.redirect("/admin/artigos");
    }).catch( err => {
        res.redirect("/")
    })
});

// paginacao
router.get("/artigos/pagina/:num", (req, res) => {
    var pagina = req.params.num;
    var offset;
    if (isNaN(pagina) || pagina == 1) {
        offset = 0;
    } else {
        offset = parseInt((pagina) - 1) * 4;
    }
    Artigo.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [['createdAt', 'desc']]
    }).then(artigos => {
        var proxima;
        if(offset + 4 >= artigos.count){
            proxima = false;
        } else {
            proxima = true;
        }
        var resultado = {
            pagina: parseInt(pagina),
            proxima: proxima,
            artigos: artigos
        }
        Categoria.findAll().then(categorias => {
            res.render("admin/artigos/pagina", {resultado: resultado, categorias: categorias})
        })
    });
});

module.exports = router;