const express = require("express");
const router = express.Router();
const { conectarBD } = require("../banco");

// Página para criar artista
router.get("/criar", (req, res) => {
  res.render("admin/artista/criarArtista");
});

// Salvar novo artista
router.post("/criar", async (req, res) => {
  const { nome } = req.body;
  try {
    const conexao = await conectarBD();
    await conexao.query("INSERT INTO artista (nome) VALUES (?)", [nome]);
    res.redirect("/admin/listar");
  } catch (err) {
    console.error(err);
    res.send("Erro ao criar artista.");
  }
});

// Listar artistas
router.get("/listar", async (req, res) => {
  try {
    const conexao = await conectarBD();
    const [artistas] = await conexao.query("SELECT * FROM artista");
    res.render("admin/artista/Artista", { artistas });
  } catch (err) {
    console.error(err);
    res.send("Erro ao listar artistas.");
  }
});

// Página de editar artista
router.get("/editar/:id", async (req, res) => {
  try {
    const conexao = await conectarBD();
    const [rows] = await conexao.query("SELECT * FROM artista WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) return res.send("Artista não encontrado");

    res.render("admin/artista/atualizarArtista", { artista: rows[0] });
  } catch (err) {
    console.error(err);
    res.send("Erro ao carregar artista.");
  }
});

// Atualizar artista
router.post("/editar/:id", async (req, res) => {
  const { nome } = req.body;
  try {
    const conexao = await conectarBD();
    await conexao.query("UPDATE artista SET nome = ? WHERE id = ?", [
      nome,
      req.params.id,
    ]);
    res.redirect("/admin/listar");
  } catch (err) {
    console.error(err);
    res.send("Erro ao atualizar artista.");
  }
});

// Deletar artista
router.post("/deletar/:id", async (req, res) => {
  try {
    const conexao = await conectarBD();
    await conexao.query("DELETE FROM artista WHERE id = ?", [req.params.id]);
    res.redirect("/admin/listar");
  } catch (err) {
    console.error(err);
    res.send("Erro ao deletar artista.");
  }
});

module.exports = router;
