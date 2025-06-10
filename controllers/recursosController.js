const db = require('../config/db');

exports.listarRecursos = (req, res) => {
  db.query('SELECT * FROM recursos', (err, results) => {
    if (err) {
      console.error('Erro ao buscar recursos:', err);
      return res.status(500).json({ erro: 'Erro ao buscar recursos' });
    }

    res.json(results);
  });
};