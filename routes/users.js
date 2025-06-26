const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { mensagemErro: null });
});

router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const usuarioFixo = {
        email: 'usuario@teste.com',
        senha: '123456'
    };

    if (email === usuarioFixo.email && senha === usuarioFixo.senha) {
        return res.redirect('/home');
    } else {
        return res.render('login', { mensagemErro: 'Credenciais inválidas' });
    }
});

router.get('/cadastro', (req, res) => {
    res.render('cadastro', { mensagemErro: null });
});

router.post('/cadastro', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.render('cadastro', { mensagemErro: 'Todos os campos são obrigatórios' });
    }

    if (!email.includes('@')) {
        return res.render('cadastro', { mensagemErro: 'Email inválido' });
    }

    // Simula sucesso de cadastro
    res.redirect('/login');
});

module.exports = router;
