# Relog — Re-login automático no GitHub

Sistema web que detecta quando a sessão do GitHub expira ou buga e oferece um **botão de re-login automático** para reautenticar com um único clique.

![Preview](https://github.com/user-attachments/assets/32088914-44f0-42b5-ad15-9686c5647df8)

---

## ✨ Funcionalidades

- 🔐 Login com GitHub via OAuth 2.0
- 👤 Exibe avatar, nome e username do usuário logado
- ⏱️ Verifica a sessão automaticamente a cada **30 segundos**
- 🚨 Detecta sessões expiradas/bugadas e exibe um banner de alerta
- 🔄 **Botão de Re-login** — ao clicar, refaz o fluxo OAuth sem nenhuma ação adicional
- 🌙 Interface dark com TailwindCSS

---

## 💻 Como rodar no seu PC

### O que você precisa ter instalado

- **Node.js 18+** → baixe em **[nodejs.org](https://nodejs.org)** (clique em "LTS")
- **Git** → baixe em **[git-scm.com](https://git-scm.com)**

Depois de instalar, abra o terminal e confira:

```bash
node -v   # deve aparecer v18... ou superior
```

---

### 3 passos e pronto

**1. Baixe o projeto**

Abra o terminal (CMD no Windows, Terminal no Mac/Linux):

```bash
git clone -b copilot/add-auto-relogin-button https://github.com/lanazklk0/relog.git
cd relog
npm run setup
```

> 💡 O `-b copilot/add-auto-relogin-button` garante que você baixa o código completo.  
> Quando o PR for mesclado ao main, bastará usar `git clone https://github.com/lanazklk0/relog.git`.

O comando `npm run setup` vai te guiar pelo processo todo — ele vai pedir as credenciais do GitHub e configurar tudo automaticamente.

---

**2. Durante o setup, crie um GitHub OAuth App**

O script vai te pedir um **Client ID** e um **Client Secret**. Para conseguir esses valores:

1. Abra: **[github.com/settings/developers](https://github.com/settings/developers)**
2. Clique em **"New OAuth App"**
3. Preencha exatamente assim:

   | Campo | O que colocar |
   |-------|---------------|
   | Application name | `Relog` |
   | Homepage URL | `http://localhost:5173` |
   | Authorization callback URL | `http://localhost:3001/auth/github/callback` |

4. Clique em **"Register application"**
5. Copie o **Client ID** que apareceu
6. Clique em **"Generate a new client secret"** e copie o valor

> ⚠️ **Importante:** salve o Client Secret agora — ele só aparece uma vez!

Cole esses valores quando o script perguntar.

---

**3. Rode o projeto**

```bash
npm run dev
```

Quando aparecer `Local: http://localhost:5173/` no terminal, abra o navegador nesse endereço e o app estará funcionando! 🎉

---

## ❓ Problemas comuns

**Login não funciona / volta com erro**
- Confirme que a *Authorization callback URL* no GitHub é **exatamente** `http://localhost:3001/auth/github/callback`
- Rode `npm run setup` de novo para reconfigurar as credenciais

**"Porta já em uso"**
- Feche outros programas que possam estar usando a porta 3001 ou 5173

**"node não encontrado"**
- Instale o Node.js em [nodejs.org](https://nodejs.org) e abra um **novo** terminal

---

## 🗂️ Estrutura do projeto

```
relog/
├── package.json              ← scripts raiz (npm run setup / npm run dev)
├── scripts/
│   └── setup.js              ← setup interativo (pede credenciais, instala tudo)
├── backend/
│   ├── .env.example
│   └── src/
│       ├── index.js          ← servidor Express
│       ├── routes/auth.js    ← rotas OAuth
│       └── middleware/session.js
└── frontend/
    └── src/
        ├── App.jsx
        ├── hooks/useAuth.js          ← verifica sessão a cada 30s
        └── components/
            ├── LoginButton.jsx       ← botão login/re-login
            ├── UserCard.jsx          ← card do usuário logado
            └── SessionStatus.jsx     ← banner de sessão expirada
```

---

## 🔗 Rotas da API

| Rota | Descrição |
|------|-----------|
| `GET /auth/github` | Inicia o fluxo OAuth |
| `GET /auth/github/callback` | Callback do GitHub; salva sessão |
| `GET /auth/me` | Retorna dados do usuário (401 se não logado) |
| `GET /auth/logout` | Encerra a sessão |
| `GET /auth/refresh` | Verifica/renova a sessão |

---

## 📦 Stack

- **Frontend:** React 18 + Vite 5 + TailwindCSS 3
- **Backend:** Node.js + Express 4
- **Auth:** GitHub OAuth 2.0 (Authorization Code Flow)
- **Sessão:** `express-session`
