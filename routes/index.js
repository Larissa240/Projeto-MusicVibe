const express = require("express");
const router = express.Router();
const { conectarBD } = require('../banco'); // Importar corretamente

// Redireciona para login ao acessar a raiz
router.get("/", (req, res) => {
  res.redirect("/login");
});

// Página inicial (após login)
router.get("/home", async (req, res) => {
  try {
    const conexao = await conectarBD();
    const [playlists] = await conexao.query("SELECT * FROM playlists");

    res.render("home", { playlists });
  } catch (err) {
    console.error(err);
    res.send("Erro ao carregar playlists.");
  }
});

// Exibe formulário de login
router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;