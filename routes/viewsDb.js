const express = require('express');
const router = express.Router();
const { conectarBD } = require('../db');

// Rota para a View 1: vw_detalhes_musica_completo
router.get('/detalhes-musicas', async (req, res) => {
    let conex; // Variável para a conexão
    try {
        conex = await conectarBD(); 
        const [rows] = await conex.query('SELECT * FROM vw_detalhes_musica_completo'); 
        res.render('view1-resumo-usicas', { detalhesMusicas: rows });
    } catch (err) {
        console.error('Erro ao buscar detalhes das músicas da view:', err);
        res.status(500).send('Erro interno do servidor ao buscar detalhes das músicas.');
    } finally {
    
    }
});

// Rota para a View 2: view_playlist_totais
router.get('/playlists-com-totais', async (req, res) => {
    let conex;
    try {
        conex = await conectarBD();
        const [rows] = await conex.query('SELECT * FROM view_playlist_totais');
        res.render('view2-totais-playlist', { playlistsTotais: rows });
    } catch (err) {
        console.error('Erro ao buscar totais de playlists da view:', err);
        res.status(500).send('Erro interno do servidor ao buscar totais de playlists.');
    } finally {
    
    }
});

module.exports = router;