function sair() {
    localStorage.clear();
    window.location.href = '../login/login.html';
}

document.addEventListener("DOMContentLoaded", () => {
    const nomeUsuario = localStorage.getItem("nomeUsuario") || "Funcionário";
    document.getElementById("nome-funcionario").textContent = nomeUsuario;
    const sairBtn = document.querySelector(".logout-btn");
    sairBtn.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja sair?")) {
            sair();
        }
    });

    document.getElementById("conteudo").innerHTML = "<h2>Selecione uma opção acima para visualizar os dados</h2>";
});

function mostrarSecao(secao) {
    const conteudo = document.getElementById("conteudo");
    conteudo.innerHTML = "";

    switch (secao) {
        case "equipe":
            conteudo.innerHTML = "<h2>Minha Equipe</h2><div id='listaEquipe'>Carregando equipe...</div>";
            carregarEquipe();
            break;

        case "recursos":
            conteudo.innerHTML = "<h2>Meus Recursos</h2><div id='listaRecursos'>Carregando recursos...</div>";
            carregarRecursos();
            break;

        case "relatorios":
            conteudo.innerHTML = "<h2>Relatórios</h2><div id='lista-relatorios'>Carregando relatórios...</div>";
            carregarRelatorios();
            break;
    }
}

function mostrarSecao(secao) {
    const conteudo = document.getElementById('conteudo');

    switch (secao) {
        case 'equipe':
            conteudo.innerHTML = `
                <h2>Minha Equipe</h2>
                <div id="listaEquipe">Carregando equipe...</div>
            `;
            carregarEquipe();
            break;

        case 'recursos':
            conteudo.innerHTML = `
                <h2>Meus Recursos</h2>
                <div id="listaRecursos">Carregando recursos...</div>
            `;
            carregarRecursos();
            break;

        case 'relatorios':
            conteudo.innerHTML = `
                <h2>Relatórios</h2>
                <div id="lista-relatorios">Carregando relatórios...</div>
            `;
            carregarRelatorios();
            break;
    }
}

async function carregarEquipe() {
    try {
        const resposta = await fetch('http://localhost:3000/api/equipes', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const equipe = await resposta.json();

        const lista = document.getElementById('listaEquipe');
        if (!lista) {
            console.error("🚨 Elemento 'listaEquipe' não encontrado no HTML.");
            return;
        }

        lista.innerHTML = equipe.length === 0 
            ? "<p>Nenhuma equipe encontrada.</p>"
            : '<ul>' + equipe.map(p => `<li>${p.nome}</li>`).join('') + '</ul>'; 

    } catch (erro) {
        console.error("Erro ao carregar equipe:", erro);
        document.getElementById('listaEquipe').textContent = 'Erro ao carregar equipe.';
    }
}

async function carregarRecursos() {
    try {
        const resposta = await fetch('http://localhost:3000/api/recursos', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const recursos = await resposta.json();

        const lista = document.getElementById('listaRecursos');
        if (!lista) {
            console.error("🚨 Elemento 'listaRecursos' não encontrado no HTML.");
            return;
        }

        lista.innerHTML = recursos.length === 0 
            ? "<p>Nenhum recurso disponível.</p>"
            : '<ul>' + recursos.map(r => `<li>${r.nome} - ${r.tipo} (${r.status})</li>`).join('') + '</ul>';
    } catch (erro) {
        console.error("Erro ao carregar recursos:", erro);
        document.getElementById('listaRecursos').textContent = 'Erro ao carregar recursos.';
    }
}

async function carregarRelatorios() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("🚨 Token ausente! Usuário precisa estar autenticado.");
            return;
        }
        const resposta = await fetch('http://localhost:3000/api/relatorios', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const dados = await resposta.json();
        const lista = document.getElementById('lista-relatorios');
        if (!lista) {
            console.error("🚨 Elemento 'lista-relatorios' não encontrado no HTML.");
            return;
        }

        if (!dados || dados.length === 0) {
            lista.innerHTML = "<p>Nenhum relatório disponível.</p>";
            return;
        }

        lista.innerHTML = dados.map(rel => `
            <div class="relatorio">
                <h4>${rel.titulo ?? "Título indisponível"}</h4>
                <p>${rel.conteudo ?? rel.descricao ?? "Conteúdo indisponível"}</p>
                <small>Data: ${rel.data_criacao ? new Date(rel.data_criacao).toLocaleString() : "Data indisponível"}</small>
            </div>
        `).join('');
        
    } catch (erro) {
        console.error("Erro ao carregar relatórios:", erro);
        document.getElementById('lista-relatorios').textContent = 'Erro ao carregar relatórios.';
    }
}

function criarRelatorio() {
    const titulo = document.getElementById('tituloRelatorio').value;
    const conteudo = document.getElementById('conteudoRelatorio').value;

    fetch('http://localhost:3000/api/relatorios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ titulo, conteudo })
    })
    .then(res => res.json())
    .then(() => {
        alert('✅ Relatório criado com sucesso!');
        carregarRelatorios();
    })
    .catch(erro => console.error("Erro ao criar relatório:", erro));
}