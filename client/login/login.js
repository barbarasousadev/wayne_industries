document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const erroMsg = document.getElementById('erro');

    try {
        const resposta = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();
        console.log(dados);

        if (!resposta.ok) {
            erroMsg.textContent = dados.erro || 'Erro ao fazer login';
            return;
        }

        localStorage.setItem('token', dados.token);
localStorage.setItem('usuario', JSON.stringify(dados.usuario));
localStorage.setItem("nomeUsuario", dados.usuario.nome);
localStorage.setItem("tipo_usuario", dados.usuario.tipo_usuario); // ✅ ESSENCIAL

        // Redireciona com base no tipo de usuário
        const tipo = dados.usuario.tipo_usuario;
        if (tipo === 'admin') {
            window.location.href = '/dashboard/dashboard.html';
        } else if (tipo === 'gerente') {
            window.location.href = '/gerente/gerente.html';
        } else {
            window.location.href = '/funcionario/funcionario.html';
        }

    } catch (erro) {
        erroMsg.textContent = 'Erro ao conectar com o servidor';
        console.error(erro);
    }
});