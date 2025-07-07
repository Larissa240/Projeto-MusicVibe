const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { conectarBD, buscarUsuarioPorEmail } = require('../banco');

// Página de cadastro
router.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

// Salvar cadastro
router.post('/cadastro', async (req, res) => {
  const { email, senha } = req.body;
  const hash = await bcrypt.hash(senha, 10);

  try {
    const conexao = await conectarBD();
    await conexao.query('INSERT INTO usuarios (email, senha) VALUES (?, ?)', [email, hash]);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.send('Erro ao cadastrar');
  }
});

// Página de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Autenticar login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await buscarUsuarioPorEmail(email);

    if (!usuario) return res.send('Usuário não encontrado');

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (senhaCorreta) {
      return res.redirect('/home');
    } else {
      return res.send('Senha incorreta');
    }

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;
