const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verificarToken = require("../middlewares/verificarToken");

const SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    try {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], async (err, resultados) => {
            if (err) {
                console.error('Erro ao buscar usuário:', err);
                return res.status(500).json({ erro: 'Erro interno no servidor' });
            }
            if (resultados.length === 0) {
                return res.status(401).json({ erro: 'Credenciais inválidas' });
            }

            const usuario = resultados[0];

            console.log("🔍 Senha no banco:", usuario.senha);
            console.log("🔍 Senha digitada:", senha);

            bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
                if (err) {
                    console.error('Erro ao comparar senha:', err);
                    return res.status(500).json({ erro: 'Erro interno ao validar senha' });
                }

                console.log("🔍 A senha corresponde?", isMatch);

                if (!isMatch) {
                    return res.status(401).json({ erro: 'Credenciais inválidas' });
                }

                const token = jwt.sign(
                    { id: usuario.id, tipo_usuario: usuario.tipo_usuario },
                    SECRET,
                    { expiresIn: '2h' }
                );

                res.json({
                    mensagem: 'Login bem-sucedido',
                    token,
                    usuario: {
                        id: usuario.id,
                        nome: usuario.nome,
                        tipo_usuario: usuario.tipo_usuario
                    }
                });
            });
        });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

router.post('/cadastrar', async (req, res) => {
    const { nome, email, senha, tipo_usuario } = req.body;

    if (!nome || !email || !senha || !tipo_usuario) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const insert = 'INSERT INTO users (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)';
        db.query(insert, [nome, email, senhaCriptografada, tipo_usuario], (err, resultado) => {
            if (err) throw err;
            res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
        });
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
    }
});

router.get('/usuarios', verificarToken, (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ erro: 'Erro ao buscar usuários' });
        }
        res.json(results);
    });
});


router.put('/usuarios/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const { nome, email, tipo_usuario } = req.body;

    if (req.usuario.tipo_usuario !== "admin") {
        return res.status(403).json({ erro: "Acesso negado! Apenas administradores podem editar usuários." });
    }

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
});

router.delete('/usuarios/:id', verificarToken, (req, res) => {
    const { id } = req.params;

    if (req.usuario.tipo_usuario !== "admin") {
        return res.status(403).json({ erro: "Acesso negado! Apenas administradores podem excluir usuários." });
    }

    const deleteQuery = 'DELETE FROM users WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir usuário:', err);
            return res.status(500).json({ erro: 'Erro ao excluir usuário' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        res.json({ mensagem: 'Usuário excluído com sucesso!' });
    });
});

module.exports = router;