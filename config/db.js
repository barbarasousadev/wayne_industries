const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Babii10040410!!',
  database: 'wayne_industries'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro na conexão com o banco:', err);
  } else {
    console.log('🟢 Conectado ao banco de dados MySQL!');
  }
});

module.exports = connection;
