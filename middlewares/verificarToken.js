const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "sua_chave_secreta";

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ erro: "Token inválido ou não fornecido!" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        req.usuarioId = decoded.id;
        req.usuarioTipo = decoded.tipo_usuario;
        next();
    } catch (err) {
        console.error("🔴 Erro ao validar token:", err.message);
        return res.status(403).json({ erro: "Token inválido ou expirado!" });
    }
};