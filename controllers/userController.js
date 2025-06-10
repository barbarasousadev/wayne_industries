const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.listarUsuarios = (req, res) => {
    const sql = 'SELECT * FROM users';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ erro: 'Erro ao buscar usuários' });
        }

        res.json(results);
    });
};

exports.adicionarUsuario = async (req, res) => {
    const { nome, email, senha, tipo_usuario } = req.body;

    if (!nome || !email || !senha || !tipo_usuario) { 
        return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
    }

    try {
        const senhaHash = await bcrypt.hash(senha, 10); // 🔐 Agora a senha será armazenada de forma segura!
        const sql = 'INSERT INTO users (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)';
        db.query(sql, [nome, email, senhaHash, tipo_usuario], (err, result) => {
            if (err) {
                console.error('Erro ao adicionar usuário:', err);
                return res.status(500).json({ erro: 'Erro ao adicionar usuário' });
            }
            res.json({ mensagem: '✅ Usuário cadastrado com sucesso!' });
        });
    } catch (erro) {
        console.error('Erro ao processar a senha:', erro);
        res.status(500).json({ erro: 'Erro interno ao processar senha' });
    }
};

exports.editarUsuario = (req, res) => {
    const { id } = req.params;
    const { nome, email, tipo_usuario } = req.body;
    const sql = 'UPDATE users SET nome = ?, email = ?, tipo_usuario = ? WHERE id = ?';

    db.query(sql, [nome, email, tipo_usuario, id], (err, result) => {
        if (err) {
            console.error('Erro ao editar usuário:', err);
            return res.status(500).json({ erro: 'Erro ao editar usuário' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        res.json({ mensagem: 'Usuário atualizado com sucesso!' });
    });
};


exports.excluirUsuario = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir usuário:', err);
            return res.status(500).json({ erro: 'Erro ao excluir usuário' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        res.json({ mensagem: 'Usuário excluído com sucesso!' });
    });
};