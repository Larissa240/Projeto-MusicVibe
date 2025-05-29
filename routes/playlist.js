const express = require('express');
const router = express.Router();

router.get('/playlist', (req, res) => {
  const musicas = [
    { titulo: 'AFTER HOURS', artista: 'The Weeknd', imagem: '/images/the-weenked-afterhours.png' },
    { titulo: 'Asa Branca', artista: 'Luiz Gonzaga', imagem: '/images/asa-branca-luiz-gonzaga.png' },
    { titulo: 'A Sky Full of Stars', artista: 'Coldplay', imagem: '/images/player.coldplay.png' },
    { titulo: 'FALSE ALARM', artista: 'The Weeknd', imagem: '/images/falsealarm.jpg' },
    { titulo: 'Hit Me Hard and Soft', artista: 'Billie Eilish', imagem: '/images/billie.jpg' },
  ];
  res.render('playlist-show', { musicas });
});

module.exports = router;

