# Relog — Re-login automático no GitHub

Sistema web que detecta quando a sessão do GitHub expira ou buga e oferece um **botão de re-login automático** para reautenticar com um único clique.

---

## ✨ Funcionalidades

- 🔐 Login com GitHub via OAuth 2.0
- 👤 Exibe avatar, nome e username do usuário logado
- ⏱️ Verifica a sessão automaticamente a cada **30 segundos**
- 🚨 Detecta sessões expiradas/bugadas e exibe um banner de alerta
- 🔄 **Botão de Re-login** — ao clicar, refaz o fluxo OAuth sem nenhuma ação adicional
- 🌙 Interface dark com TailwindCSS

---

## 🖥️ Preview

```
┌─────────────────────────────────┐
│           ⚫ GitHub             │
│             Relog               │
│   Re-login automático...        │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🐙  Login com GitHub      │  │  ← tela inicial (não logado)
│  └───────────────────────────┘  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  ┌─────────────────────────┐    │
│  │  🖼️  Avatar              │    │
│  │  Nome do Usuário        │    │  ← tela logado
│  │  @username              │    │
│  │  Repos: 42 | Seguid: 10 │    │
│  │        [ Sair ]         │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  ⚠️  Sessão expirada!           │
│  Sua sessão bugou ou expirou.   │  ← sessão expirada
│  ┌───────────────────────────┐  │
│  │ 🐙  Re-logar com GitHub   │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## 🗂️ Estrutura

```
relog/
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── index.js              # Servidor Express
│       ├── routes/
│       │   └── auth.js           # OAuth routes
│       └── middleware/
│           └── session.js        # Session middleware
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        │   ├── LoginButton.jsx   # Botão login/re-login
        │   ├── UserCard.jsx      # Card do usuário logado
        │   └── SessionStatus.jsx # Banner de sessão expirada
        └── hooks/
            └── useAuth.js        # Hook de autenticação
```

---

## ⚙️ Configuração

### 1. Criar um GitHub OAuth App

1. Acesse [github.com/settings/developers](https://github.com/settings/developers)
2. Clique em **"New OAuth App"**
3. Preencha:
   - **Application name:** `Relog` (ou qualquer nome)
   - **Homepage URL:** `http://localhost:5173`
   - **Authorization callback URL:** `http://localhost:3001/auth/github/callback`
4. Clique em **"Register application"**
5. Copie o **Client ID** e gere um **Client Secret**

### 2. Configurar o backend

```bash
cd backend
cp .env.example .env
```

Edite o `.env`:

```env
GITHUB_CLIENT_ID=seu_client_id_aqui
GITHUB_CLIENT_SECRET=seu_client_secret_aqui
SESSION_SECRET=uma_string_aleatoria_longa_e_segura
FRONTEND_URL=http://localhost:5173
PORT=3001
```

---

## 🚀 Como rodar

### Backend

```bash
cd backend
npm install
npm run dev      # desenvolvimento (nodemon)
# ou
npm start        # produção
```

O backend estará disponível em `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## 🔗 Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/auth/github` | Inicia o fluxo OAuth (redireciona para GitHub) |
| `GET` | `/auth/github/callback` | Callback do GitHub; salva sessão |
| `GET` | `/auth/me` | Retorna dados do usuário logado (401 se não logado) |
| `GET` | `/auth/logout` | Encerra a sessão e redireciona para o frontend |
| `GET` | `/auth/refresh` | Verifica e renova a sessão atual |
| `GET` | `/health` | Health check do servidor |

---

## 🛡️ Segurança

- Cookies `httpOnly` — protegidos contra XSS
- `sameSite: lax` em desenvolvimento, `none` em produção (com HTTPS)
- `secure: true` em produção
- Client Secret nunca exposto ao frontend
- CORS restrito à URL do frontend

---

## 📦 Stack

- **Frontend:** React 18 + Vite 5 + TailwindCSS 3
- **Backend:** Node.js + Express 4
- **Auth:** GitHub OAuth 2.0 (Authorization Code Flow)
- **Sessão:** `express-session`
