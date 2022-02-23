const express = require("express");
const router = express.Router();
const Usuario = require("./Usuario");
const bcrypt = require('bcrypt');
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/usuarios", adminAuth, (req, res) => {
    Usuario.findAll({
        order: [['id', 'ASC']]
    }).then(usuarios => {
        res.render("admin/usuarios/index", {usuarios: usuarios});
    })
});

router.get("/admin/usuarios/novo", adminAuth, (req, res) => {
    res.render("admin/usuarios/novo");
});

router.post("/usuarios/salvar", adminAuth, (req, res) => {
    var nome = req.body.nome;
    var email = req.body.email;
    var senha = req.body.senha;
    Usuario.findOne({
        where: { email: email }
    }).then(usuario => {
        if (usuario == undefined){
            var salt = bcrypt.genSalt(10);
            var hash = bcrypt.hashSync(senha, parseInt(salt));
            Usuario.create({
                nome: nome,
                email: email,
                senha: hash
            }).then(() => {
                res.redirect("/admin/usuarios");
            }).catch((err) => {
                res.redirect("/");
            })
        } else {        
            res.redirect("/admin/usuarios/novo");
        }
    });
});

router.post("/usuarios/remover", adminAuth, (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        Usuario.destroy({
            where: { id: id }
        }).then(() => {
            res.redirect("/admin/usuarios");
        })
    } else {
        res.redirect("/");
    }
})

router.get("/admin/usuario/editar/:id", adminAuth, (req, res) => {
    var id = req.params.id;
    if (!isNaN(id) && id != undefined){
        Usuario.findOne({
            where: {id: id}
        }).then( artigo => {
            res.render("admin/usuarios/editar", {artigo: artigo})
        })
    }
});

router.post("/usuarios/atualizar", adminAuth, (req, res) => {
    var id = req.body.id;
    var nome = req.body.nome;
    var email = req.body.email;
    if (id != undefined) {
        Usuario.update(
            {nome: nome, email: email},
            {where: { id: id}}
        ).then(() => {
            res.redirect("/admin/usuarios");
        }).catch(err => {
            res.render(err);
        })
    } else {
        res.redirect("/admin/usuarios/");
    }
});

router.get("/login", (req, res) => {
    res.render("admin/usuarios/login")
});

router.post("/autenticar", (req, res) => {
    var email = req.body.email;
    var senha = req.body.senha;
    Usuario.findOne({
        where: {email: email} 
    }).then(usuario => {
        if (usuario != undefined) {
            var verifica = bcrypt.compareSync(senha, usuario.senha);
            if (verifica) {
                req.session.usuario = {
                    id: usuario.id,
                    email: usuario.email
                };
                res.redirect("/admin/artigos"); 
                //res.json(req.session.usuario);   
            } else {
                res.redirect("/login")
            }
        } else {
            res.redirect("/login")
        }
    })

})

router.get("/logout", (req, res) => {
    req.session.usuario = undefined;
    res.redirect("/login");
})

module.exports = router;