const express = require("express");
const router = express.Router();
const { conectarBD } = require("../banco");


// Página inicial do admin
router.get("/", (req, res) => {
  res.render("admin/adminHome");
});

//   ------------- ARTISTAS ------------- //

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


//   ------------- MUSICAS ------------- //

// Página para criar música
router.get("/criarMusicas", async (req, res) => {
  try {
    const conexao = await conectarBD();
    const [artistas] = await conexao.query("SELECT * FROM artista");
    res.render("admin/musica/criarMusica", { artistas });
  } catch (err) {
    console.error(err);
    res.send("Erro ao carregar artistas.");
  }
});

// Salvar nova música
router.post("/criarMusicas", async (req, res) => {
  const { titulo, artista_id } = req.body;
  try {
    const conexao = await conectarBD();
    await conexao.query(
      "INSERT INTO musicas (titulo, artista_id) VALUES (?, ?)",
      [titulo, artista_id]
    );
    res.redirect("/admin/listarMusicas");
  } catch (err) {
    console.error(err);
    res.send("Erro ao criar música.");
  }
});

// Listar músicas
router.get("/listarMusicas", async (req, res) => {
  try {
    const conexao = await conectarBD();
    const [musicas] = await conexao.query(
      `SELECT m.id, m.titulo, a.nome as artista_nome
       FROM musicas m
       LEFT JOIN artista a ON m.artista_id = a.id`
    );
    res.render("admin/musica/Musica", { musicas });
  } catch (err) {
    console.error(err);
    res.send("Erro ao listar músicas.");
  }
});

// Página de editar música
router.get("/editarMusicas/:id", async (req, res) => {
  try {
    const conexao = await conectarBD();

    const [musicas] = await conexao.query(
      "SELECT * FROM musicas WHERE id = ?",
      [req.params.id]
    );
    if (musicas.length === 0) return res.send("Música não encontrada");
    const musica = musicas[0];

    const [artistas] = await conexao.query("SELECT * FROM artista");

    res.render("admin/musica/atualizarMusica", { musica, artistas });
  } catch (err) {
    console.error(err);
    res.send("Erro ao carregar música.");
  }
});

// Atualizar música
router.post("/editarMusicas/:id", async (req, res) => {
  const { titulo, artista_id } = req.body;
  try {
    const conexao = await conectarBD();
    await conexao.query(
      "UPDATE musicas SET titulo = ?, artista_id = ? WHERE id = ?",
      [titulo, artista_id, req.params.id]
    );
    res.redirect("/admin/listarMusicas");
  } catch (err) {
    console.error(err);
    res.send("Erro ao atualizar música.");
  }
});

// Deletar música
router.post("/deletarMusicas/:id", async (req, res) => {
  try {
    const conexao = await conectarBD();
    await conexao.query("DELETE FROM musicas WHERE id = ?", [req.params.id]);
    res.redirect("/admin/listarMusicas");
  } catch (err) {
    console.error(err);
    res.send("Erro ao deletar música.");
  }
});


// ------------- PLAYLISTS ------------- //

// Página para criar playlist
router.get("/criarPlaylists", (req, res) => {
  res.render("admin/playlist/criarPlaylist");
});

// Salvar nova playlist
router.post("/criarPlaylists", async (req, res) => {
  const { nome } = req.body;
  try {
    const conexao = await conectarBD();
    await conexao.query("INSERT INTO playlists (nome) VALUES (?)", [nome]);
    res.redirect("/admin/listarPlaylists");
  } catch (err) {
    console.error(err);
    res.send("Erro ao criar playlist.");
  }
});

// Listar playlists
router.get("/listarPlaylists", async (req, res) => {
  try {
    const conexao = await conectarBD();
    const [playlists] = await conexao.query("SELECT * FROM playlists");
    res.render("admin/playlist/Playlist", { playlists });
  } catch (err) {
    console.error(err);
    res.send("Erro ao listar playlists.");
  }
});

// Página de editar playlist
router.get("/editarPlaylists/:id", async (req, res) => {
  try {
    const conexao = await conectarBD();
    const [rows] = await conexao.query("SELECT * FROM playlists WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) return res.send("Playlist não encontrada");
    res.render("admin/playlist/atualizarPlaylist", { playlist: rows[0] });
  } catch (err) {
    console.error(err);
    res.send("Erro ao carregar playlist.");
  }
});

// Atualizar playlist
router.post("/editarPlaylists/:id", async (req, res) => {
  const { nome } = req.body;
  try {
    const conexao = await conectarBD();
    await conexao.query("UPDATE playlists SET nome = ? WHERE id = ?", [
      nome,
      req.params.id,
    ]);
    res.redirect("/admin/listarPlaylists");
  } catch (err) {
    console.error(err);
    res.send("Erro ao atualizar playlist.");
  }
});

// Deletar playlist
router.post("/deletarPlaylists/:id", async (req, res) => {
  try {
    const conexao = await conectarBD();
    await conexao.query("DELETE FROM playlists WHERE id = ?", [req.params.id]);
    res.redirect("/admin/listarPlaylists");
  } catch (err) {
    console.error(err);
    res.send("Erro ao deletar playlist.");
  }
});

// ----------- ASSOCIAR MÚSICA À PLAYLIST ----------- //

// Página para associar música à playlist
router.get("/associarPlaylistMusica", async (req, res) => {
  try {
    const conexao = await conectarBD();
    const [playlists] = await conexao.query("SELECT * FROM playlists");
    const [musicas] = await conexao.query(
      `SELECT m.id, m.titulo, a.nome as artista_nome
       FROM musicas m
       LEFT JOIN artista a ON m.artista_id = a.id`
    );

    res.render("admin/playlistMusica/associarPlaylistMusica", { playlists, musicas });
  } catch (err) {
    console.error(err);
    res.send("Erro ao carregar dados.");
  }
});

// Salvar associação
router.post("/associarPlaylistMusica", async (req, res) => {
  const { playlist_id, musica_id } = req.body;

  try {
    const conexao = await conectarBD();

    // Verifica se já existe
    const [existe] = await conexao.query(
      "SELECT * FROM playlist_musica WHERE playlist_id = ? AND musica_id = ?",
      [playlist_id, musica_id]
    );

    if (existe.length > 0) {
      return res.send("Essa música já está na playlist.");
    }

    await conexao.query(
      "INSERT INTO playlist_musica (playlist_id, musica_id) VALUES (?, ?)",
      [playlist_id, musica_id]
    );

    res.redirect("/admin/associarPlaylistMusica");
  } catch (err) {
    console.error(err);
    res.send("Erro ao associar música à playlist.");
  }
});


module.exports = router;
