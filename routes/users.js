const express = require('express');
const router = express.Router();
const db = require('../banco');
const bcrypt = require('bcrypt');

// Página de cadastro
router.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

// Salvar cadastro
router.post('/cadastro', async (req, res) => {
  const { email, senha } = req.body;
  const hash = await bcrypt.hash(senha, 10);

  db.query('INSERT INTO usuarios (email, senha) VALUES (?, ?)', [email, hash], (err) => {
    if (err) {
      console.error(err);
      return res.send('Erro ao cadastrar');
    }
    res.redirect('/login');
  });
});

// Página de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Autenticar login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.send('Email não encontrado');
    }

    const usuario = results[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (senhaCorreta) {
      res.send('Login bem-sucedido!');
    } else {
      res.send('Senha incorreta');
    }
  });
});

module.exports = router;

