const express = require('express');
const router = express.Router();
const db = require('../config/db');
const recursosController = require('../controllers/recursosController');
const verificarToken = require('../middlewares/verificarToken'); // ✅ importe aqui


router.get('/', verificarToken, recursosController.listarRecursos);
// GET - Listar todos os recursos (protegido)
router.get('/', verificarToken, (req, res) => {
  db.query('SELECT * FROM recursos', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar recursos' });
    res.json(results);
  });
});

// POST - Criar novo recurso (protegido)
router.post('/', verificarToken, (req, res) => {
  const { nome, tipo, status } = req.body;
  db.query('INSERT INTO recursos (nome, tipo, status) VALUES (?, ?, ?)', [nome, tipo, status], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao criar recurso' });
    res.status(201).json({ id: result.insertId, nome, tipo, status });
  });
});

// PUT - Atualizar recurso (protegido)
router.put('/:id', verificarToken, (req, res) => {
  const { nome, tipo, status } = req.body;
  db.query('UPDATE recursos SET nome = ?, tipo = ?, status = ? WHERE id = ?', [nome, tipo, status, req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao atualizar recurso' });
    res.json({ id: req.params.id, nome, tipo, status });
  });
});

// DELETE - Excluir recurso (protegido)
router.delete('/:id', verificarToken, (req, res) => {
  db.query('DELETE FROM recursos WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao excluir recurso' });
    res.status(204).send();
  });
});


module.exports = router;

