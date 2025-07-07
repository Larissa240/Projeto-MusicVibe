const express = require('express');
const path = require('path');


const app = express();

app.use(express.static('public'));

// Middlewares para corpo da requisição
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/player', (req, res) => {
  res.render('player'); // Certifique-se de que existe views/player.ejs
});

// Configuração da pasta pública (static files)
app.use(express.static(path.join(__dirname, 'public')));

// Configuração da view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Importa rotas
const usersRouter = require('./routes/users');
const playlistRouter = require('./routes/playlist');
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');

// Rotas
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', playlistRouter);
app.use('/admin', adminRouter);

// Porta
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;
