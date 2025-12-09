import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const host = "0.0.0.0";
const porta = 3000;

var listaEquipes = []; 
var contadorEquipe = 1;
var contadorJogador = 1;

const server = express();


server.use(session({
    secret: "Minh4Ch4v3S3cr3t4",
    resave: true, 
    saveUninitialized: true, 
    cookie: {
        maxAge: 1000 * 60 * 30 
    }
}));


server.use(express.urlencoded({ extended: true }));


server.use(cookieParser());

server.get("/login", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <title>Login</title>
      </head>
      <body>
        <div class="container mt-5">
          <h2>Login - Campeonato LoL</h2>
          <form method="POST" action="/login">
            <div class="mb-3">
              <label for="usuario" class="form-label">Usuário</label>
              <input type="text" class="form-control" id="usuario" name="usuario" required>
            </div>
            <div class="mb-3">
              <label for="senha" class="form-label">Senha</label>
              <input type="password" class="form-control" id="senha" name="senha" required>
            </div>
            <button class="btn btn-primary" type="submit">Entrar</button>
          </form>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  `);
});


server.post("/login", (req, res) => {
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    if (usuario === "admin" && senha === "admin") {

        req.session.dadosLogin = {
            nome: "Administrador",
            logado: true
        };
        res.redirect("/");
    } else {
        res.send(`
        <!DOCTYPE html>
        <html><head><meta charset="UTF-8"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"><title>Erro Login</title></head>
        <body class="p-4">
            <div class="container">
            <h3 class="text-danger">Usuário ou senha inválidos</h3>
            <a class="btn btn-primary" href="/login">Tentar novamente</a>
            </div>
        </body></html>
        `);
    }
});


server.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});



server.get("/", verificarUsuarioLogado, (req, res) => {

    let ultimoAcesso = req.cookies.ultimoAcesso;
    const data = new Date();
    res.cookie("ultimoAcesso", data.toLocaleString());

    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <title>Campeonato LoL - Menu</title>
      </head>
      <body>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">Campeonato LoL</a>
            <div class="collapse navbar-collapse">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">Cadastros</a>
                  <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" href="/cadastrarEquipe">Equipes</a></li>
                  </ul>
                </li>
                <li class="nav-item"><a class="nav-link" href="/listarEquipes">Listar Equipes</a></li>
              </ul>
              <div class="d-flex align-items-center">
                 <span class="navbar-text me-3">Olá, ${req.session.dadosLogin.nome}</span>
                 <a class="btn btn-sm btn-outline-danger" href="/logout">Sair</a>
              </div>
            </div>
          </div>
        </nav>

        <div class="container mt-4">
          <h1 class="text-center">Bem-vindo ao sistema do Campeonato Amador de LoL</h1>
          
          <div class="alert alert-info text-center">
             Último acesso: ${ultimoAcesso || "Primeiro acesso"}
          </div>

          <p class="text-center">Cadastre equipes e jogadores (formação: Top, Jungle, Mid, Atirador, Suporte).</p>
          <div class="text-center">
            <a class="btn btn-primary m-1" href="/cadastrarEquipe">Cadastrar Equipe</a>
            <a class="btn btn-secondary m-1" href="/listarEquipes">Ver Equipes</a>
          </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  `);
});


server.get("/cadastrarEquipe", verificarUsuarioLogado, (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <title>Cadastrar Equipe</title>
      </head>
      <body>
        <div class="container mt-4">
          <h2>Cadastrar Equipe</h2>
          <form method="POST" action="/adicionarEquipe" class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Nome da equipe</label>
              <input type="text" class="form-control" name="nomeEquipe" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Nome do capitão</label>
              <input type="text" class="form-control" name="capitao" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Contato (WhatsApp)</label>
              <input type="text" class="form-control" name="contato" required>
            </div>
            <div class="col-12">
              <button class="btn btn-primary" type="submit">Cadastrar</button>
              <a class="btn btn-secondary" href="/">Voltar</a>
            </div>
          </form>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  `);
});


server.post("/adicionarEquipe", verificarUsuarioLogado, (req, res) => {
    const nomeEquipe = req.body.nomeEquipe;
    const capitao = req.body.capitao;
    const contato = req.body.contato;

    if (!nomeEquipe || !capitao || !contato) {
        return res.send(`<p>Todos os campos são obrigatórios. <a href="/cadastrarEquipe">Voltar</a></p>`);
    }

    const novaEquipe = {
        id: contadorEquipe++,
        nomeEquipe,
        capitao,
        contato,
        jogadores: []
    };

    listaEquipes.push(novaEquipe);
    res.redirect("/listarEquipes");
});


server.get("/listarEquipes", verificarUsuarioLogado, (req, res) => {
    let conteudo = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <title>Equipes</title>
      </head>
      <body>
        <div class="container mt-4">
          <h2>Equipes Cadastradas</h2>
          <a class="btn btn-primary mb-3" href="/cadastrarEquipe">Nova Equipe</a>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Equipe</th>
                <th>Capitão</th>
                <th>Contato</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
  `;

    for (let i = 0; i < listaEquipes.length; i++) {
        const e = listaEquipes[i];
        conteudo += `
      <tr>
        <td>${e.id}</td>
        <td>${e.nomeEquipe}</td>
        <td>${e.capitao}</td>
        <td>${e.contato}</td>
        <td>
          <a class="btn btn-sm btn-info" href="/equipe/${e.id}">Ver</a>
        </td>
      </tr>
    `;
    }

    conteudo += `
            </tbody>
          </table>
          <a class="btn btn-secondary" href="/">Voltar</a>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  `;

    res.send(conteudo);
});


server.get("/equipe/:id", verificarUsuarioLogado, (req, res) => {
    const id = Number(req.params.id);
    const equipe = listaEquipes.find(x => x.id === id);

    if (!equipe) {
        return res.send(`<p>Equipe não encontrada. <a href="/listarEquipes">Voltar</a></p>`);
    }

    let listaJogadoresHtml = "";
    if (equipe.jogadores.length === 0) {
        listaJogadoresHtml = "<p>Nenhum jogador cadastrado.</p>";
    } else {
        listaJogadoresHtml = "<ul class='list-group mb-3'>";
        for (let j = 0; j < equipe.jogadores.length; j++) {
            const pj = equipe.jogadores[j];
            listaJogadoresHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">
        ${pj.nome} — ${pj.funcao}
        <form style="margin:0" method="POST" action="/equipe/${equipe.id}/jogador/${pj.id}/remover">
          <button class="btn btn-sm btn-danger">Remover</button>
        </form>
      </li>`;
        }
        listaJogadoresHtml += "</ul>";
    }

    const podeAdicionar = equipe.jogadores.length < 5;

    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <title>Equipe ${equipe.nomeEquipe}</title>
      </head>
      <body>
        <div class="container mt-4">
          <h2>Equipe: ${equipe.nomeEquipe}</h2>
          <p>Capitão: ${equipe.capitao} — Contato: ${equipe.contato}</p>

          <h4>Jogadores (${equipe.jogadores.length} / 5)</h4>
          ${listaJogadoresHtml}

          ${podeAdicionar ? `
            <h5>Adicionar Jogador</h5>
            <form method="POST" action="/equipe/${equipe.id}/adicionarJogador" class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nome do jogador</label>
                <input type="text" class="form-control" name="nomeJogador" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Função</label>
                <select name="funcao" class="form-select" required>
                  <option value="Top">Top</option>
                  <option value="Jungle">Jungle</option>
                  <option value="Mid">Mid</option>
                  <option value="Atirador">Atirador</option>
                  <option value="Suporte">Suporte</option>
                </select>
              </div>
              <div class="col-12">
                <button class="btn btn-success" type="submit">Adicionar</button>
                <a class="btn btn-secondary" href="/listarEquipes">Voltar</a>
              </div>
            </form>
          ` : `<div class="alert alert-warning">Equipe completa (5 jogadores).</div><a class="btn btn-secondary" href="/listarEquipes">Voltar</a>`}

        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  `);
});


server.post("/equipe/:id/adicionarJogador", verificarUsuarioLogado, (req, res) => {
    const id = Number(req.params.id);
    const equipe = listaEquipes.find(x => x.id === id);
    if (!equipe) return res.send(`<p>Equipe não encontrada. <a href="/listarEquipes">Voltar</a></p>`);

    if (equipe.jogadores.length >= 5) {
        return res.send(`<p>Equipe já possui 5 jogadores. <a href="/equipe/${id}">Voltar</a></p>`);
    }

    const nomeJogador = req.body.nomeJogador;
    const funcao = req.body.funcao;

    if (!nomeJogador || !funcao) {
        return res.send(`<p>Nome e função obrigatórios. <a href="/equipe/${id}">Voltar</a></p>`);
    }

    const existeFuncao = equipe.jogadores.some(j => j.funcao === funcao);
    if (existeFuncao) {
        return res.send(`<p>Já existe um jogador com a função ${funcao} nesta equipe. <a href="/equipe/${id}">Voltar</a></p>`);
    }

    const novoJogador = {
        id: contadorJogador++,
        nome: nomeJogador,
        funcao
    };

    equipe.jogadores.push(novoJogador);
    res.redirect(`/equipe/${id}`);
});


server.post("/equipe/:id/jogador/:playerId/remover", verificarUsuarioLogado, (req, res) => {
    const id = Number(req.params.id);
    const playerId = Number(req.params.playerId);
    const equipe = listaEquipes.find(x => x.id === id);
    if (!equipe) return res.send(`<p>Equipe não encontrada. <a href="/listarEquipes">Voltar</a></p>`);

    equipe.jogadores = equipe.jogadores.filter(p => p.id !== playerId);
    res.redirect(`/equipe/${id}`);
});


function verificarUsuarioLogado(requisicao, resposta, proximo) {
    if (requisicao.session.dadosLogin?.logado) {
        proximo();
    } else {
        resposta.redirect("/login");
    }
}


server.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});