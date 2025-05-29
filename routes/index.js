var express = require('express');
var router = express.Router();

router.get('/home', function(req, res) {
  res.render('home');
});

router.get('/login', (req, res) => {
  res.render('login');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Simulação simples de login
  if (email === 'teste@email.com' && senha === '1234') {
    res.status(200).send('Login realizado com sucesso!');
  } else {
    res.status(401).send('Email ou senha inválidos');
  }
});



module.exports = router;
