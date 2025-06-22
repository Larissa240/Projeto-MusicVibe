const express = require('express');
const router = express.Router();
const { conectarBD } = require('../banco'); // Importar corretamente
const bcrypt = require('bcrypt');

// Página de cadastro
router.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

// Salvar cadastro
router.post('/cadastro', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const hash = await bcrypt.hash(senha, 10);
    const conexao = await conectarBD(); // PEGAR a conexão corretamente

    await conexao.query(
      'INSERT INTO usuarios (email, senha) VALUES (?, ?)',
      [email, hash]
    );

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.send('Erro ao cadastrar');
  }
});

// Página de login (exibe form)
router.get('/login', (req, res) => {
  res.render('login');
});

// Autenticar login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const conexao = await conectarBD();

    const [results] = await conexao.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (results.length === 0) {
      return res.send('Email não encontrado');
    }

    const usuario = results[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (senhaCorreta) {
      return res.redirect('/home'); // Redireciona para /home
    } else {
      return res.send('Senha incorreta');
    }
  } catch (error) {
    console.error(error);
    res.send('Erro no servidor');
  }
});

module.exports = router;
