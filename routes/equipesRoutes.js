const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET - Listar todas as equipes
router.get('/', (req, res) => {
  db.query('SELECT * FROM equipes', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar equipes' });
    res.json(results);
  });
});

// POST - Criar nova equipe
router.post('/', (req, res) => {
  const { nome, descricao } = req.body;
  db.query('INSERT INTO equipes (nome, descricao) VALUES (?, ?)', [nome, descricao], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao criar equipe' });
    res.status(201).json({ id: result.insertId, nome, descricao });
  });
});

// PUT - Atualizar equipe
router.put('/:id', (req, res) => {
  const { nome, descricao } = req.body;
  db.query('UPDATE equipes SET nome = ?, descricao = ? WHERE id = ?', [nome, descricao, req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao atualizar equipe' });
    res.json({ id: req.params.id, nome, descricao });
  });
});

// DELETE - Excluir equipe
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM equipes WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao excluir equipe' });
    res.status(204).send();
  });
});

module.exports = router;
