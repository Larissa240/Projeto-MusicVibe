const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const conexao = require('./banco');
const usersRouter = require('./routes/users');
const playlistRouter = require('./routes/playlist');


app.use('/', playlistRouter);


// Middlewares para corpo da requisição
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Configuração da view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas

app.get('/player', (req, res) => {
  res.render('player');
});


app.get('/home', (req, res) => {
  conexao.query('SELECT * FROM playlists', (err, playlists) => {
    if (err) {

      return res.send('Erro ao carregar playlists.');
    }

    res.render('home', { playlists });
  });
});


app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  conexao.query(
    'SELECT * FROM usuarios WHERE email = ?',
    [email],
    async (erro, resultados) => {
      if (erro) {
        console.error('Erro ao buscar usuário:', erro);
        return res.send('Erro no login');
      }

      if (resultados.length === 0) {
        return res.send('Usuário não encontrado');
      }

      const usuario = resultados[0];

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (senhaCorreta) {
        res.send('Login bem-sucedido!');
      } else {
        res.send('Senha incorreta');
      }
    }
  );
});



app.use('/', usersRouter);



// Página para criar nova playlist
app.get('/playlist/new', (req, res) => {
  res.render('playlist-new');
});

// Criar uma nova playlist no banco
app.post('/playlist', (req, res) => {
  const nome = req.body.nome;
  if (!nome) return res.send('Nome da playlist é obrigatório');

  conexao.query('INSERT INTO playlists (nome) VALUES (?)', [nome], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao inserir playlist:', erro);
      return res.send('Erro ao criar playlist');
    }

    res.redirect(`/playlist/${resultado.insertId}`);
  });
});

// Mostrar playlist com músicas
app.get('/playlist/:id', (req, res) => {
  const id = req.params.id;

  conexao.query('SELECT * FROM playlists WHERE id = ?', [id], (err, playlists) => {
    if (err || playlists.length === 0) return res.send('Playlist não encontrada');

    const playlist = playlists[0];

    conexao.query('SELECT * FROM musicas WHERE playlist_id = ?', [id], (err2, musicas) => {
      if (err2) return res.send('Erro ao buscar músicas');
      res.render('playlist-show', { playlist, musicas });
    });
  });
});

// Adicionar música à playlist
app.post('/playlist/:id/musicas', (req, res) => {
  const { titulo, artista } = req.body;
  const playlistId = req.params.id;

  if (!titulo) return res.send('Título é obrigatório');

  conexao.query(
    'INSERT INTO musicas (playlist_id, titulo, artista) VALUES (?, ?, ?)',
    [playlistId, titulo, artista],
    (err) => {
      if (err) return res.send('Erro ao adicionar música');
      res.redirect(`/playlist/${playlistId}`);
    }
  );
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);

});

module.exports = app;