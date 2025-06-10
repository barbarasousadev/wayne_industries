function sair() {
    localStorage.clear();
    window.location.href = "../login/login.html";
}

const token = localStorage.getItem("token");
const tipoUsuarioLogado = localStorage.getItem("tipo_usuario");

async function fetchAPI(url, options = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("🚨 Token ausente! Usuário precisa estar autenticado.");
        alert("Erro: Você precisa estar logado para acessar esta área.");
        window.location.href = "../login/login.html";
        return;
    }

    options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    const resposta = await fetch(url, options);
    if (!resposta.ok) throw new Error(`Erro na API: ${resposta.status}`);
    return await resposta.json();
}

// Mostrar Seção
function mostrarSecao(secaoId) {
    document.querySelectorAll(".conteudo").forEach(secao => {
        secao.classList.add("oculto");
    });

    const secao = document.getElementById(secaoId);
    if (secao) secao.classList.remove("oculto");

    switch (secaoId) {
        case "usuarios":
            carregarUsuarios();
            break;
        case "equipes":
            carregarEquipes();
            break;
        case "recursos":
            carregarRecursos();
            break;
        case "relatorios":
            carregarRelatorios();
            break;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    // Verifica se está logado e se é gerente
    if (!token || !tipoUsuarioLogado) {
        alert("Erro: Você precisa estar logado para acessar esta área.");
        window.location.href = "../login/login.html";
        return;
    }

    if (tipoUsuarioLogado !== "gerente") {
        alert("Acesso negado. Esta área é exclusiva para gerentes.");
        window.location.href = "../login/login.html";
        return;
    }

    // Se passou, permite uso
    document.querySelector(".logout-btn").addEventListener("click", () => {
        if (confirm("Deseja sair?")) sair();
    });

    mostrarSecao("usuarios");
});

async function carregarUsuarios() {
    try {
        const usuarios = await fetchAPI("http://localhost:3000/api/users");

        const tabelaFuncionarios = document.querySelector("#tabelaFuncionarios tbody");
        const tabelaGerentes = document.querySelector("#tabelaGerentes tbody");
        const tabelaAdmins = document.querySelector("#tabelaAdmins tbody");

        tabelaFuncionarios.innerHTML = "";
        tabelaGerentes.innerHTML = "";
        tabelaAdmins.innerHTML = "";

        usuarios.forEach(usuario => {
            const linha = `
                <tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.tipo_usuario}</td>
                    <td>
                        ${usuario.tipo_usuario !== "admin" && tipoUsuarioLogado !== "funcionario"
                            ? `<button onclick="abrirEdicao(${usuario.id}, '${usuario.nome}', '${usuario.email}')">Editar</button>`
                            : ""}
                        ${tipoUsuarioLogado === "admin" && usuario.tipo_usuario !== "admin"
                            ? `<button onclick="excluirUsuario(${usuario.id})">Excluir</button>`
                            : ""}
                    </td>
                </tr>
            `;

            if (usuario.tipo_usuario === "funcionario") {
                tabelaFuncionarios.insertAdjacentHTML("beforeend", linha);
            } else if (usuario.tipo_usuario === "gerente") {
                tabelaGerentes.insertAdjacentHTML("beforeend", linha);
            } else if (usuario.tipo_usuario === "admin") {
                tabelaAdmins.insertAdjacentHTML("beforeend", linha);
            }
        });

    } catch (erro) {
        console.error("Erro ao carregar usuários:", erro);
    }
}

//formulário de edição com os dados do usuário
function abrirEdicao(id, nome, email) {
    document.getElementById("usuarioId").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("email").value = email;

    document.getElementById("formEdicaoUsuario").classList.remove("oculto");
}

// Cancelar edição e ocultar formulário
function cancelarEdicao() {
    document.getElementById("formEdicaoUsuario").classList.add("oculto");
}

//Editar Usuário via formulário (gerente pode alterar apenas nome e e-mail)
document.getElementById("editarUsuarioForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("usuarioId").value;
    const novoNome = document.getElementById("nome").value;
    const novoEmail = document.getElementById("email").value;

    if (!novoNome || !novoEmail) {
        alert("Nome e e-mail são obrigatórios!");
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: novoNome, email: novoEmail })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert("Usuário atualizado com sucesso!");
            carregarUsuarios();
            cancelarEdicao();
        } else {
            alert(`Erro ao atualizar usuário: ${dados.erro || "Erro desconhecido"}`);
        }
    } catch (erro) {
        console.error("Erro ao editar usuário:", erro);
    }
});
//Carregar Equipes
async function carregarEquipes() {
    try {
        const equipes = await fetchAPI("http://localhost:3000/api/equipes");
        const lista = document.getElementById("lista-equipe");
        lista.innerHTML = equipes.length
            ? equipes.map(eq => `<li>${eq.nome}</li>`).join("")
            : "<li>Nenhuma equipe encontrada.</li>";
    } catch (erro) {
        console.error("Erro ao carregar equipes:", erro);
    }
}

//Carregar Recursos
async function carregarRecursos() {
    try {
        const recursos = await fetchAPI("http://localhost:3000/api/recursos");
        const lista = document.getElementById("lista-recursos");
        lista.innerHTML = recursos.length
            ? recursos.map(r => `<li>${r.nome} - ${r.tipo}</li>`).join("")
            : "<li>Nenhum recurso encontrado.</li>";
    } catch (erro) {
        console.error("Erro ao carregar recursos:", erro);
    }
}

//Carregar Relatórios
async function carregarRelatorios() {
    try {
        const relatorios = await fetchAPI("http://localhost:3000/api/relatorios");
        const lista = document.getElementById("lista-relatorios");

        if (relatorios.length > 0) {
            lista.innerHTML = relatorios.map(rel => `
                <div class="relatorios">
                    <h4>${rel.titulo ?? "Título indisponível"}</h4>
                    <p>${rel.conteudo ?? rel.descricao ?? "Conteúdo indisponível"}</p>
                    <small>Data: ${rel.data_criacao ? new Date(rel.data_criacao).toLocaleString() : "Data indisponível"}</small>
                </div>
            `).join('');
        } else {
            lista.innerHTML = "<p>Nenhum relatório disponível.</p>";
        }
    } catch (erro) {
        console.error("Erro ao carregar relatórios:", erro);
    }
}

function filtrarRelatorios() {
    const termoBusca = prompt("Digite um termo para filtrar relatórios:");
    if (!termoBusca) return;

    fetchAPI("http://localhost:3000/api/relatorios")
        .then(relatorios => {
            const lista = document.getElementById("lista-relatorios");
            const resultados = relatorios
                .filter(rel => rel.titulo.toLowerCase().includes(termoBusca.toLowerCase()))
                .map(rel => `
                    <div class="relatorios"> <!-- Corrigido de 'relatorio' para 'relatorios' -->
                        <h4>${rel.titulo}</h4>
                        <p>${rel.conteudo ?? rel.descricao ?? "Conteúdo indisponível"}</p>
                        <small>Data: ${new Date(rel.data_criacao).toLocaleString()}</small>
                    </div>
                `).join('');

            lista.innerHTML = resultados.length > 0 ? resultados : "<p>Nenhum relatório encontrado.</p>";
        })
        .catch(erro => console.error("Erro ao filtrar relatórios:", erro));
}
