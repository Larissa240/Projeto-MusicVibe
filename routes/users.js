const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { mensagemErro: null });
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
