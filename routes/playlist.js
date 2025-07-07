const express = require('express');
const router = express.Router();
const banco = require('../banco'); // banco.js com conectarBD()

router.get('/playlist/Coldplay', (req, res) => {
   const playlist = {
    nome: 'Coldplay',
    imagemcapa: '/images/Coldplay.png' 
  };

  

  const musicas = [
    { titulo: 'AFTER HOURS', artista: 'The Weeknd', imagem: '/images/the-weenked-afterhours.png' },
    { titulo: 'Asa Branca', artista: 'Luiz Gonzaga', imagem: '/images/asa-branca-luiz-gonzaga.png' },
    { titulo: 'A Sky Full of Stars', artista: 'Coldplay', imagem: '/images/player-coldplay.png' },
    { titulo: 'FALSE ALARM', artista: 'The Weeknd', imagem: '/images/the-weenkend4.png' },
    { titulo: 'Hit Me Hard and Soft', artista: 'Billie Eilish', imagem: '/images/hit-me.png' },
  ];

  res.render('playlist-show', { playlist, musicas });
});

// **NOVA ROTA: Para a playlist "Músicas mais tocadas"
router.get('/playlist/Musicasmaistocadas', (req, res) => {
    const playlist = {
        nome: 'Músicas mais tocadas',
        capa: '/images/maistocadas.png'
    };

    const musicas = [
        { titulo: 'Saudade da minha vida - Ao Vivo', artista: 'Gusttavo Lima', imagem: '/images/gusttavo-lima.png' },
        { titulo: 'Oi Balde - Ao Vivo', artista: 'Zé Neto & Cristiano', imagem: '/images/ze-neto-cristiano.png' },
        { titulo: 'Seu Brilho Sumiu - Ao Vivo', artista: 'Israel & Rodolfo', imagem: '/images/israel-rodolfo.png' },
        { titulo: 'Trégua - Ao Vivo', artista: 'Matheus & Kauan', imagem: '/images/matheus-kauan.png' },
       
    ];

    res.render('playlist-show', { playlist, musicas });
});

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
     `SELECT m.id, m.titulo, m.imagem, a.nome AS artista
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
  const { titulo, artista, imagem } = req.body;
  const { id: playlistId } = req.params;

  if (!titulo) return res.send('Título da música é obrigatório');

  try {
    const conexao = await banco.conectarBD();

    await conexao.query(
      'INSERT INTO musicas (playlist_id, titulo, artista, imagem) VALUES (?, ?, ?)',
      [playlistId, titulo, artista, imagem]
    );

    res.redirect(`/playlist/${playlistId}`);
  } catch (erro) {
    console.error('Erro ao adicionar música:', erro);
    res.status(500).send('Erro ao adicionar música');
  }
});

module.exports = router;
