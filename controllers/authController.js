const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
require('dotenv').config();

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ mensagem: 'Usuário não encontrado' });
        }

        const usuario = rows[0];

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Senha inválida!' });
        }

        const token = jwt.sign(
            { id: usuario.id, tipo_usuario: usuario.tipo_usuario },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            mensagem: "✅ Login realizado com sucesso!",
            token,
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo_usuario: usuario.tipo_usuario } // 🔥 Agora o frontend pode usar os dados do usuário!
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro no servidor ao autenticar usuário' });
    }
};