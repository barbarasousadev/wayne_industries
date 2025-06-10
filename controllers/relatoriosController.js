const db = require('../config/db');
const pool = require('../config/db');


const listarRelatorios = (req, res) => {
  const sql = `
    SELECT 
      r.id,
      r.titulo,
      r.descricao,
      r.data_criacao,
      u.nome AS nome_usuario,
      e.nome AS nome_equipe,
      rc.nome AS nome_recurso,
      CASE WHEN r.status = 'concluido' THEN true ELSE false END AS concluido
    FROM relatorios r
    LEFT JOIN users u ON r.usuario_id = u.id
    LEFT JOIN equipes e ON r.equipe_id = e.id
    LEFT JOIN recursos rc ON r.recurso_id = rc.id
    ORDER BY r.data_criacao DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar relatórios:', err);
      return res.status(500).json({ erro: 'Erro ao buscar relatórios' });
    }
    res.json(results);
  });
};

const criarRelatorio = (req, res) => {
  const { titulo, descricao, data_criacao } = req.body;
  const usuario_id = req.usuarioId;

  if (!titulo || !descricao || !data_criacao) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos do relatório.' });
  }

  const sql = "INSERT INTO relatorios (titulo, descricao, data_criacao, usuario_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [titulo, descricao, data_criacao, usuario_id], (err, resultado) => {
    if (err) {
      console.error("Erro ao salvar relatório:", err);
      return res.status(500).json({ mensagem: 'Erro interno ao salvar relatório.' });
    }

    res.status(201).json({ mensagem: 'Relatório criado com sucesso.', id: resultado.insertId });
  });
};

const concluirRelatorio = (req, res) => {
  const { id } = req.params;

  const sql = 'UPDATE relatorios SET status = ? WHERE id = ?';
  db.query(sql, ['concluido', id], (err, result) => {
    if (err) {
      console.error('Erro ao concluir relatório:', err);
      return res.status(500).json({ mensagem: 'Erro ao concluir relatório.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Relatório não encontrado!' });
    }

    res.status(200).json({ mensagem: 'Relatório marcado como concluído com sucesso!' });
  });
};

const excluirRelatorio = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM relatorios WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erro ao excluir relatório:', err);
      return res.status(500).json({ mensagem: 'Erro ao excluir relatório.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Relatório não encontrado!' });
    }

    res.status(200).json({ mensagem: 'Relatório excluído com sucesso.' });
  });
};

module.exports = {
  listarRelatorios,
  criarRelatorio,
  concluirRelatorio,
  excluirRelatorio 
};
