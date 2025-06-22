const mysql = require('mysql2');

const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'musicvibe'
});

conexao.connect((erro) => {
  if (erro) {
    console.error('Erro ao conectar no banco:', erro);
    return;
  }
  console.log('Conectado ao banco MySQL!');
});


module.exports = conexao;
