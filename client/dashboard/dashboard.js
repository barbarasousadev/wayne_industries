document.addEventListener("DOMContentLoaded", () => {
    const nomeUsuario = localStorage.getItem("nomeUsuario") || "Administrador";
    document.getElementById("nome-admin").textContent = nomeUsuario;

    // Botão de logout
    document.querySelector(".logout-btn").onclick = () => {
        if (confirm("Deseja sair do sistema?")) {
            localStorage.clear();
            window.location.href = "../login/login.html";
        }
    };

    // Alternância entre seções
    document.querySelectorAll(".menu-btn").forEach(botao => {
        botao.onclick = () => mostrarSecao(botao.dataset.secao);
    });

    //Eventos dos formulários
    document.getElementById("formUsuario").onsubmit = salvarUsuario;
    document.getElementById("formRecurso").onsubmit = salvarRecurso;

    //Carregar dados iniciais
    carregarUsuarios();
    carregarRecursos();
    carregarRelatorios(); 
});

function mostrarSecao(id) {
    document.querySelectorAll(".conteudo").forEach(secao => secao.classList.add("oculto"));
    document.getElementById(id).classList.remove("oculto");
}



// ========== CRUD - Usuários ==========
let idUsuarioEditando = null;

async function carregarUsuarios() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("🚨 Nenhum token encontrado! Faça login novamente.");
            return;
        }

        console.log("🔐 Token que será enviado:", token);

        const resposta = await fetch("http://localhost:3000/api/users", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            const erroTexto = await resposta.text();
            throw new Error(`Erro ao carregar usuários! Detalhes: ${erroTexto}`);
        }

        const usuarios = await resposta.json();
        console.log("📦 Usuários recebidos:", usuarios);

        const lista = document.getElementById("lista-usuarios");
        lista.innerHTML = usuarios.length
            ? usuarios.map(u => 
                `<li>
                    ${u.nome} - ${u.email} (${u.tipo_usuario}) 
                    <button onclick="editarUsuario(${JSON.stringify(u)})">✏️</button>
                    <button onclick="deletarUsuario('${u.id}')">🗑️</button>
                </li>`
            ).join('')
            : "<p>⚠️ Nenhum usuário encontrado.</p>";

    } catch (erro) {
        console.error("⚠️ Erro na requisição fetch:", erro);
        document.getElementById("lista-usuarios").innerHTML = "<p>⚠️ Erro ao buscar usuários.</p>";
    }
}

function abrirModalUsuario() {
    document.getElementById("formUsuario").reset();
    document.getElementById("tituloModalUsuario").textContent = "Adicionar Usuário";
    idUsuarioEditando = null;
    document.getElementById("modalUsuario").classList.remove("oculto");
}

function fecharModalUsuario() {
    document.getElementById("modalUsuario").classList.add("oculto");
}

function editarUsuario(usuario) {
    idUsuarioEditando = usuario.id;
    document.getElementById("nomeUsuario").value = usuario.nome;
    document.getElementById("emailUsuario").value = usuario.email;
    document.getElementById("tipoUsuario").value = usuario.tipo_usuario;
    document.getElementById("tituloModalUsuario").textContent = "Editar Usuário";
    document.getElementById("modalUsuario").classList.remove("oculto");
}

async function salvarUsuario(event) {
    event.preventDefault();
    const nome = document.getElementById("nomeUsuario").value;
    const email = document.getElementById("emailUsuario").value;
    const senha = document.getElementById("senhaUsuario").value; 
    const tipo_usuario = document.getElementById("tipoUsuario").value;

    if (!nome || !email || !senha || !tipo_usuario) { 
        alert("⚠️ Todos os campos são obrigatórios!");
        return;
    }

    const url = idUsuarioEditando
        ? `http://localhost:3000/api/users/${idUsuarioEditando}`
        : "http://localhost:3000/api/users";
    const method = idUsuarioEditando ? "PUT" : "POST";

    const token = localStorage.getItem("token");
    if (!token) {
        alert("⚠️ Você precisa estar autenticado para realizar esta ação.");
        return;
    }

    try {
        const resposta = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ nome, email, senha, tipo_usuario })
        });

        if (!resposta.ok) {
            const erroTexto = await resposta.text();
            throw new Error(`Erro ao salvar usuário! Detalhes: ${erroTexto}`);
        }

        fecharModalUsuario();
        carregarUsuarios();
    } catch (erro) {
        console.error("Erro ao salvar usuário:", erro);
    }
}

async function deletarUsuario(id) {
    if (!confirm("Excluir este usuário?")) return;

    const token = localStorage.getItem("token");

    if (!token) {
        alert("⚠️ Você precisa estar autenticado para excluir um usuário.");
        return;
    }

    try {
        await fetch(`http://localhost:3000/api/users/${id}`, { 
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        carregarUsuarios();
    } catch (erro) {
        console.error("Erro ao excluir usuário:", erro);
    }
}

// ========== CRUD - Recursos ==========
let idRecursoEditando = null;

async function carregarRecursos() {
    const token = localStorage.getItem("token");
    console.log("🔐 Token que será enviado:", token);

    try {
        const resposta = await fetch("http://localhost:3000/api/recursos", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const textoResposta = await resposta.text();
        console.log("📦 Resposta recebida (texto):", textoResposta);

        const recursos = JSON.parse(textoResposta);
        const lista = document.getElementById("lista-recursos");

        lista.innerHTML = recursos.length
            ? recursos.map(r =>
                `<li>${r.nome} - ${r.tipo}</li>`
            ).join('')
            : "<p>⚠️ Nenhum recurso encontrado.</p>";

    } catch (err) {
        console.error("Erro ao carregar recursos:", err);
        document.getElementById("lista-recursos").innerHTML = "<p>⚠️ Erro ao carregar recursos</p>";
    }
}

function abrirModalRecurso() {
    document.getElementById("formRecurso").reset();
    idRecursoEditando = null;
    document.getElementById("modalRecurso").classList.remove("oculto");
}

function fecharModalRecurso() {
    document.getElementById("modalRecurso").classList.add("oculto");
}

function editarRecurso(recurso) {
    idRecursoEditando = recurso.id;
    document.getElementById("nomeRecurso").value = recurso.nome;
    document.getElementById("tipoRecurso").value = recurso.tipo;
    document.getElementById("modalRecurso").classList.remove("oculto");
}

async function salvarRecurso(event) {
    event.preventDefault();
    const nome = document.getElementById("nomeRecurso").value;
    const tipo = document.getElementById("tipoRecurso").value;

    const url = idRecursoEditando
        ? `http://localhost:3000/api/recursos/${idRecursoEditando}`
        : "http://localhost:3000/api/recursos";
    const method = idRecursoEditando ? "PUT" : "POST";

    try {
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, tipo })
        });
        fecharModalRecurso();
        carregarRecursos();
    } catch (err) {
        console.error("Erro ao salvar recurso:", err);
    }
}

async function deletarRecurso(id) {
    if (!confirm("Excluir este recurso?")) return;
    await fetch(`http://localhost:3000/api/recursos/${id}`, { method: "DELETE" });
    carregarRecursos();
}

// ========== CRUD - Relatórios ==========
const token = localStorage.getItem('token');

async function carregarRelatorios() {
    try {
        const resposta = await fetch('http://localhost:3000/api/relatorios', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!resposta.ok) {
            const erroTexto = await resposta.text();
            throw new Error(`Erro ao carregar relatórios! Detalhes: ${erroTexto}`);
        }

        const dados = await resposta.json();
        const lista = document.getElementById('lista-relatorios');

        lista.innerHTML = dados.length
            ? dados.map(rel => `
                <div class="relatorio">
                    <h4>${rel.titulo}</h4>
                    <p>${rel.descricao}</p>
                    <small>
                        👤 <strong>${rel.nome_usuario || 'Desconhecido'}</strong><br>
                        🔧 Recurso: ${rel.nome_recurso || 'Não especificado'}<br>
                        🛡️ Equipe: ${rel.nome_equipe || 'Não especificada'}<br>
                        📅 ${new Date(rel.data_criacao).toLocaleString()}<br>
                        📌 Status: ${rel.concluido ? '✅ Concluído' : '⏳ Em andamento'}
                    </small>
                    <div class="acoes-relatorio">
                        ${!rel.concluido
                            ? `<button onclick="concluirRelatorio(${rel.id})">✅ Concluir</button>`
                            : `<button onclick="excluirRelatorio(${rel.id})">🗑️ Excluir</button>`}
                    </div>
                </div>
            `).join('')
            : "<p>⚠️ Nenhum relatório encontrado.</p>";

    } catch (erro) {
        console.error("Erro ao carregar relatórios:", erro);
        document.getElementById('lista-relatorios').innerHTML = "<p>⚠️ Erro ao buscar relatórios.</p>";
    }
}

async function criarRelatorio() {
    const titulo = document.getElementById('tituloRelatorio').value;
    const descricao = document.getElementById('conteudoRelatorio').value;
    const nomeEquipe = document.getElementById('nomeEquipeRelatorio').value;
    const nomeRecurso = document.getElementById('recursoRelatorio').value;

    if (!titulo || !descricao || !nomeEquipe || !nomeRecurso) {
        alert("⚠️ Todos os campos são obrigatórios!");
        return;
    }

    try {
        const resposta = await fetch('http://localhost:3000/api/relatorios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                titulo,
                descricao,
                nome_equipe: nomeEquipe,
                nome_recurso: nomeRecurso,
                data_criacao: new Date().toISOString().slice(0, 10)
            })
        });

        if (!resposta.ok) {
            const erroTexto = await resposta.text();
            throw new Error(`Erro ao criar relatório! Detalhes: ${erroTexto}`);
        }

        alert("✅ Relatório criado com sucesso!");
        document.getElementById("formularioRelatorio").classList.add("oculto");
        carregarRelatorios();
    } catch (erro) {
        console.error("Erro ao criar relatório:", erro);
        alert("⚠️ Não foi possível criar o relatório.");
    }
}


async function concluirRelatorio(id) {
    try {
        const resposta = await fetch(`http://localhost:3000/api/relatorios/${id}/concluir`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            const erroTexto = await resposta.text();
            throw new Error(`Erro ao concluir relatório! Detalhes: ${erroTexto}`);
        }

        carregarRelatorios();
    } catch (erro) {
        console.error("Erro ao concluir relatório:", erro);
        alert("❌ Erro ao concluir relatório.");
    }
}

async function excluirRelatorio(id) {
    if (!confirm("Tem certeza que deseja excluir este relatório?")) return;

    try {
        const resposta = await fetch(`http://localhost:3000/api/relatorios/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            const erroTexto = await resposta.text();
            throw new Error(`Erro ao excluir relatório: ${erroTexto}`);
        }

        carregarRelatorios();
    } catch (erro) {
        console.error("Erro ao excluir relatório:", erro);
    }
}

function alternarFormularioRelatorio() {
    const form = document.getElementById('formularioRelatorio');
    form.classList.toggle('oculto');
}