const mysql = require('mysql2/promise');

let conexao;

async function conectarBD() {
  if (conexao) return conexao;

  conexao = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'musicvibe',
  });

  console.log('Conectado ao banco MySQL com sucesso!');
  return conexao;
}

async function buscarPlaylists() {
  const conex = await conectarBD();
  const [rows] = await conex.query('SELECT * FROM playlists');
  return rows;
}

async function buscarMusicasPorPlaylist(idPlaylist) {
  const conex = await conectarBD();
  const [rows] = await conex.query('SELECT * FROM musicas WHERE playlist_id = ?', [idPlaylist]);
  return rows;
}

module.exports = {
  conectarBD,
  buscarPlaylists,
  buscarMusicasPorPlaylist,
};
