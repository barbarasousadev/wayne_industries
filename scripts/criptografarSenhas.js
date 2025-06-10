const bcrypt = require('bcryptjs');
const db = require('../config/db');

const usuarios = [
  { email: 'bruce@wayne.com', senha: '123456' },
  { email: 'lucius@wayne.com', senha: '123456' },
  { email: 'selina@wayne.com', senha: '123456' }
];

async function atualizarSenhas() {
  for (const usuario of usuarios) {
    const senhaCriptografada = await bcrypt.hash(usuario.senha, 10);

    db.query(
      'UPDATE users SET senha = ? WHERE email = ?',
      [senhaCriptografada, usuario.email],
      (err, result) => {
        if (err) {
          console.error(`Erro ao atualizar ${usuario.email}:`, err);
        } else {
          console.log(`Senha criptografada com sucesso para: ${usuario.email}`);
        }
      }
    );
  }
}

atualizarSenhas();
