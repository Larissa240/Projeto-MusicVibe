const express = require('express');
const router = express.Router();
const banco = require('../banco'); 


// POST: Atualiza músicas favoritas de uma playlist com base no título
router.post('/consultas/atualizar-favoritas', async (req, res) => {
  const { playlist_id } = req.body;

  try {
    await pool.query('CALL atualizar_favorita_por_playlist(?)', [playlist_id]);
    res.redirect('/consultas/form-atualizar-favoritas?sucesso=1');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atualizar músicas favoritas.');
  }
});



// Consulta 1: Músicas e seus Artistas em Playlists
router.get('/consulta/musicas-playlists-artistas', async (req, res) => {
  try {
    const [resultados] = await banco.query(`
      SELECT 
        p.nome AS playlist, 
        m.titulo AS musica, 
        a.nome AS artista
      FROM playlists p
      INNER JOIN playlist_musica pm ON p.id = pm.playlist_id
      INNER JOIN musicas m ON pm.musica_id = m.id
      INNER JOIN artista a ON m.artista_id = a.id
    `);
    res.render('consulta1-musicas', { resultados });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao executar consulta 1');
  }
});

router.get('/consulta/favoritas', async (req, res) => {
  try {
    const [rows] = await banco.query(`
      SELECT u.name AS nome_usuario, p.nome AS nome_playlist, m.titulo AS titulo_musica, m.favorita
      FROM usuarios u
      JOIN playlists p ON p.usuario_id = u.id
      JOIN musicas m ON m.playlist_id = p.id
      WHERE m.favorita = TRUE
    `);
    res.render('consulta-favoritas', { resultados: rows });
  } catch (error) {
    res.status(500).send('Erro ao buscar favoritas: ' + error.message);
  }
});

router.get('/consulta/quantidade-musicas', async (req, res) => {
  try {
    const [rows] = await banco.query(`
      SELECT u.name AS nome_usuario, COUNT(m.id) AS total_musicas
      FROM usuarios u
      JOIN playlists p ON p.usuario_id = u.id
      JOIN musicas m ON m.playlist_id = p.id
      GROUP BY u.id
    `);
    res.render('consulta-quantidade-musicas', { resultados: rows });
  } catch (error) {
    res.status(500).send('Erro ao buscar contagem de músicas: ' + error.message);
  }
});


module.exports = router;
