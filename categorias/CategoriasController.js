const express = require('express');
const router = express.Router();
const Categoria = require("./Categoria");
const slugify = require('slugify');
const adminAuth = require("../middlewares/adminAuth");


router.get("/admin/categorias/novo", adminAuth, (req, res) => {
    res.render("admin/categorias/novo");
});

router.post("/categorias/salvar", adminAuth, (req, res) => {
    var titulo = req.body.titulo;
    if (titulo != undefined) {
        Categoria.create({
            titulo: titulo,
            slug: slugify(titulo)
        }).then(() => {
                res.redirect("/admin/categorias");
            } 
        )
    } 
    else {
        res.redirect("/admin/categorias/novo");
    }
});

router.post("/categorias/deletar", adminAuth, (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            Categoria.destroy({ 
                where: {id: id} 
            }).then(() => {
                res.redirect("/admin/categorias")
            });
        } else {
            res.redirect("/admin/categorias")
        }
    } else {
        res.redirect("/")
    }
});

router.get("/admin/categorias/editar/:id", adminAuth, (req, res) => {
    var id = req.params.id;
    if (!isNaN(id)) {
        Categoria.findByPk(id).then( categoria => {
            if (categoria != undefined) {
                res.render("admin/categorias/editar", { categoria: categoria});
            } else {
                res.redirect("/admin/categorias");
            }
        });
    } else {
        res.redirect("/")
    }
});

router.post("/categorias/atualizar", adminAuth, (req, res) => {
    var id = req.body.id;
    var titulo = req.body.titulo;
    if (titulo != undefined) {
        Categoria.update(
            { titulo: titulo, slug: slugify(titulo)}, 
            { where: { id: id} }
        ).then(() => {
            res.redirect("/admin/categorias")
        });
    } else {
        res.redirect("/admin/categorias");
    }
});

router.get("/admin/categorias", adminAuth, (req, res) => {
    Categoria.findAll(
        { order: [['Titulo', 'ASC']] }
    ).then( categorias => {
        res.render("admin/categorias/index", {categorias: categorias });
    });
});

module.exports = router;