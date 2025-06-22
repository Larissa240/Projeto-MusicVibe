const express = require('express');
const router = express.Router();
const banco = require('../banco'); // banco.js com conectarBD()

// Página para criar nova playlist
router.get('/playlist/new', (req, res) => {
  res.render('playlist-new');
});

// Criar playlist no banco
router.post('/playlist', async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.send('Nome da playlist é obrigatório');

  try {
    const conexao = await banco.conectarBD();
    const [resultado] = await conexao.query(
      'INSERT INTO playlists (nome) VALUES (?)',
      [nome]
    );

    res.redirect(`/playlist/${resultado.insertId}`);
  } catch (erro) {
    console.error('Erro ao inserir playlist:', erro);
    res.status(500).send('Erro ao criar playlist');
  }
});

// Mostrar playlist com músicas
// Mostrar playlist com músicas (usando tabela de associação playlist_musica)
router.get('/playlist/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const conexao = await banco.conectarBD();

    // Buscar a playlist
    const [playlists] = await conexao.query(
      'SELECT * FROM playlists WHERE id = ?',
      [id]
    );

    if (playlists.length === 0) {
      return res.status(404).send('Playlist não encontrada');
    }

    const playlist = playlists[0];

    // Buscar músicas associadas à playlist
    const [musicas] = await conexao.query(
      `SELECT m.id, m.titulo, a.nome AS artista
       FROM playlist_musica pm
       JOIN musicas m ON pm.musica_id = m.id
       LEFT JOIN artista a ON m.artista_id = a.id
       WHERE pm.playlist_id = ?`,
      [id]
    );

    res.render('playlist-show', { playlist, musicas });
  } catch (erro) {
    console.error('Erro ao buscar playlist:', erro);
    res.status(500).send('Erro ao buscar playlist');
  }
});

// Adicionar música à playlist
router.post('/playlist/:id/musicas', async (req, res) => {
  const { titulo, artista } = req.body;
  const { id: playlistId } = req.params;

  if (!titulo) return res.send('Título da música é obrigatório');

  try {
    const conexao = await banco.conectarBD();

    await conexao.query(
      'INSERT INTO musicas (playlist_id, titulo, artista) VALUES (?, ?, ?)',
      [playlistId, titulo, artista]
    );

    res.redirect(`/playlist/${playlistId}`);
  } catch (erro) {
    console.error('Erro ao adicionar música:', erro);
    res.status(500).send('Erro ao adicionar música');
  }
});

module.exports = router;
