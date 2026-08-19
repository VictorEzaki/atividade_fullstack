# Classifica — jogo de classificação de requisitos de software

Sistema web gamificado em que o jogador classifica requisitos de software em **RF**, **RNF**, **RN** ou **Não condiz com o tema**. Cada partida tem 10 requisitos sorteados pelo servidor, cronômetro validado no backend, pontuação calculada exclusivamente no servidor, histórico, ranking e área administrativa completa.

```
/
├── backend/    Node.js + Express + Sequelize + MySQL/MariaDB
└── frontend/   React + Vite + React Router DOM + Font Awesome
```

---

## 1. Pré-requisitos

- Node.js 18 ou superior
- MySQL 8 ou MariaDB 10.6 (ou superior)

## 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # ajuste as credenciais do banco e o JWT_SECRET
```

Crie o banco vazio e rode as migrations e os seeders:

```sql
CREATE DATABASE jogo_requisitos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
npm run banco:preparar    # migrations + seeders
npm start                 # http://localhost:3333
```

Variáveis de ambiente (`backend/.env`):

| Variável | Descrição |
|---|---|
| `PORT` | Porta da API (padrão 3333) |
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` | Conexão com o banco |
| `JWT_SECRET` | Chave de assinatura dos tokens |
| `JWT_EXPIRES_IN` | Validade do token (ex.: `1d`) |
| `FRONTEND_URL` | Origem liberada no CORS |

### Contas criadas pelo seeder

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `admin@jogorequisitos.com` | `Admin@123` |
| Jogador | `jogador@jogorequisitos.com` | `Jogador@123` |

> Troque essas senhas antes de qualquer uso real.

O seeder também cria 4 dificuldades (Fácil 100s, Médio 80s, Difícil 60s, Hard 40s) e 4 temas com 13 requisitos cada.

### Testes

Os testes rodam em SQLite em memória, sem depender do MySQL:

```bash
npm test
```

## 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:3333/api
npm run dev               # http://localhost:5173
```

---

## 4. Arquitetura

### Backend — `routes → middlewares → controllers → services → models`

```
backend/src/
├── config/         configuração da aplicação e do Sequelize
├── database/       migrations, seeders e dados iniciais
├── models/         Usuario, Tema, Requisito, Dificuldade, Partida, RespostaPartida, TemaRequisito
├── services/       regras de negócio
├── controllers/    entrada/saída HTTP
├── middlewares/    autenticacaoMiddleware, permissaoMiddleware, erroMiddleware
├── routes/         definição dos endpoints
└── app.js
```

Routes apenas definem endpoints e aplicam middlewares; controllers apenas traduzem HTTP; toda regra de negócio vive nos services.

### Frontend

```
frontend/src/
├── services/    camada de acesso à API (fetch + token)
├── routes/      RotaPublica, RotaPrivada, RotaAdministrador
├── pages/       telas do jogador e de administração
├── layouts/     LayoutAutenticacao, LayoutJogador, LayoutAdministrador
├── contexts/    AutenticacaoContexto
├── components/  Cabecalho, Menu, Cartao, Botao, CampoTexto, Modal, Tabela,
│                IndicadorProgresso, Cronometro, CartaoRequisito, OpcaoResposta,
│                Placar, MensagemFeedback, Carregamento, MensagemErro
└── estilos/     tokens.css (paleta), global.css, componentes.css, paginas.css
```

---

## 5. Regras do jogo implementadas

- Cada partida tem exatamente **10 requisitos**, sem repetição: 7 do tema escolhido e 3 distratores de outros temas.
- Para requisitos do tema, a resposta correta é o tipo (RF/RNF/RN). Para distratores, é `NAO_CONDIZ_COM_TEMA` — que nunca é gravado como tipo de requisito.
- A resposta correta **nunca** é enviada ao navegador antes de o jogador responder.
- O cronômetro oficial é o servidor (`iniciadaEm` + `tempo` da dificuldade). O navegador só exibe a contagem, e ela é ressincronizada a cada resposta. Esgotado o tempo, a partida é encerrada, novas respostas são bloqueadas e as questões pendentes valem zero.
- A pontuação é recalculada no backend a partir das respostas gravadas; qualquer `pontuacao` enviada pelo cliente é ignorada.
- Ranking pela melhor partida de cada jogador: maior pontuação, desempate por menor tempo total. Filtros por tema, por dificuldade ou ambos.
- O jogador só enxerga o próprio histórico; acessar partida de outro usuário retorna 403.

## 6. API

Todas as respostas seguem o mesmo formato:

```json
{ "sucesso": true, "dados": {}, "mensagem": "Operação realizada com sucesso." }
{ "sucesso": false, "mensagem": "Não foi possível realizar a operação." }
```

| Grupo | Endpoints principais | Acesso |
|---|---|---|
| `/api/autenticacao` | `POST /cadastro`, `POST /login`, `GET /perfil` | Público / autenticado |
| `/api/usuarios` | CRUD completo | Administrador |
| `/api/temas` | `GET /disponiveis` (jogador), CRUD, `PATCH /:id/situacao`, `POST /:id/requisitos`, `DELETE /:id/requisitos/:requisitoId` | Administrador |
| `/api/requisitos` | CRUD com busca por texto, tipo e tema | Administrador |
| `/api/dificuldades` | `GET /` (autenticado), CRUD | Administrador |
| `/api/partidas` | `POST /`, `GET /:id`, `POST /:id/respostas`, `POST /:id/finalizacao`, `GET /:id/resultado` | Jogador autenticado |
| `/api/historico` | `GET /`, `GET /resumo`, `GET /:partidaId` | Dono dos dados |
| `/api/ranking` | `GET /?temaId=&dificuldadeId=` | Autenticado |
| `/api/painel` | `GET /indicadores` | Administrador |

## 7. Segurança

- Senhas com bcrypt (10 rounds) via hook do model; `toJSON` remove o campo `senha`, então a API nunca a devolve.
- JWT no header `Authorization: Bearer`, validado pelo `autenticacaoMiddleware`; autorização por perfil no `permissaoMiddleware`.
- Proteção de rotas no frontend é apenas experiência de uso — a decisão real é sempre do backend.
- CORS restrito a `FRONTEND_URL`.
- `erroMiddleware` global traduz erros previstos e do Sequelize para 400/401/403/404/409/422/500, sem vazar stack trace.
- Transações Sequelize na criação de tema com associações, atualização de associações, criação de partida, registro de resposta e finalização.

## 8. Design

Paleta e escalas ficam centralizadas em `frontend/src/estilos/tokens.css` como variáveis CSS — nenhum hexadecimal solto nos componentes. Azul (`#2563EB`) na estrutura e nas ações principais, roxo (`#7C3AED`) em progresso e destaques, verde para acerto, vermelho para erro e âmbar para o cronômetro em alerta. O cronômetro muda entre os estados normal, atenção e crítico conforme o tempo restante.

Estado nunca depende só de cor: acerto e erro combinam cor, ícone e texto. O foco de teclado é visível, as opções de resposta têm área de toque de 64px, respondem às teclas 1–4 (ou A–D) e as tabelas viram cartões empilhados no celular.
