#!/usr/bin/env node
/**
 * setup.js — Setup interativo para o Relog.
 *
 * Rodado via: npm run setup
 *
 * O que faz:
 *   1. Pergunta o Client ID e Client Secret do GitHub OAuth App
 *   2. Gera SESSION_SECRET automaticamente
 *   3. Escreve o arquivo backend/.env já preenchido
 *   4. Instala as dependências do backend e do frontend
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const ENV_FILE = path.join(ROOT, 'backend', '.env');

// ── Cores ────────────────────────────────────────────────────────────────────
const G = '\x1b[32m';   // green
const Y = '\x1b[33m';   // yellow
const C = '\x1b[36m';   // cyan
const B = '\x1b[1m';    // bold
const R = '\x1b[0m';    // reset

function log(msg) { console.log(msg); }
function ok(msg)  { log(`  ${G}✔${R}  ${msg}`); }
function info(msg){ log(`  ${C}ℹ${R}  ${msg}`); }

// ── Leitor de linhas com fila (funciona em pipe e TTY) ───────────────────────
function createReader() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const lineQueue = [];
  const resolverQueue = [];

  rl.on('line', (line) => {
    if (resolverQueue.length > 0) {
      resolverQueue.shift()(line);
    } else {
      lineQueue.push(line);
    }
  });

  function ask(question) {
    process.stdout.write(question);
    return new Promise((resolve) => {
      if (lineQueue.length > 0) {
        resolve(lineQueue.shift());
      } else {
        resolverQueue.push(resolve);
      }
    });
  }

  function close() { rl.close(); }

  return { ask, close };
}

async function main() {
  log(`\n${B}╔══════════════════════════════════════╗${R}`);
  log(`${B}║   🚀  Relog — Setup inicial           ║${R}`);
  log(`${B}╚══════════════════════════════════════╝${R}\n`);

  const reader = createReader();

  // ── Verificar se .env já existe ───────────────────────────────────────────
  if (fs.existsSync(ENV_FILE)) {
    const ans = await reader.ask(`  ${Y}⚠${R}  backend/.env já existe. Reconfigurar? (s/N): `);
    log('');
    if (ans.trim().toLowerCase() !== 's') {
      info('Pulando configuração. Rodando npm install mesmo assim...\n');
      reader.close();
      installDeps();
      printDone();
      return;
    }
  }

  // ── Instruções para criar o OAuth App ────────────────────────────────────
  log(`${B}Antes de continuar, crie um GitHub OAuth App:${R}`);
  log(`\n  1. Acesse: ${C}https://github.com/settings/developers${R}`);
  log(`  2. Clique em ${Y}"New OAuth App"${R}`);
  log(`  3. Preencha assim:`);
  log(`       Application name:           ${Y}Relog${R}`);
  log(`       Homepage URL:               ${Y}http://localhost:5173${R}`);
  log(`       Authorization callback URL: ${Y}http://localhost:3001/auth/github/callback${R}`);
  log(`  4. Clique em ${Y}"Register application"${R}`);
  log(`  5. Copie o ${Y}Client ID${R} e clique em ${Y}"Generate a new client secret"${R}\n`);

  // ── Coletar credenciais ───────────────────────────────────────────────────
  let clientId = '';
  while (!clientId.trim()) {
    clientId = await reader.ask(`${B}Cole aqui o Client ID:${R}       `);
    log('');
    if (!clientId.trim()) log(`  ${Y}⚠${R}  Client ID não pode ser vazio.\n`);
  }

  let clientSecret = '';
  while (!clientSecret.trim()) {
    clientSecret = await reader.ask(`${B}Cole aqui o Client Secret:${R}  `);
    log('');
    if (!clientSecret.trim()) log(`  ${Y}⚠${R}  Client Secret não pode ser vazio.\n`);
  }

  reader.close();

  // ── Gerar SESSION_SECRET automaticamente ─────────────────────────────────
  const sessionSecret = crypto.randomBytes(32).toString('hex');

  // ── Escrever .env ─────────────────────────────────────────────────────────
  const envContent = [
    `GITHUB_CLIENT_ID=${clientId.trim()}`,
    `GITHUB_CLIENT_SECRET=${clientSecret.trim()}`,
    `SESSION_SECRET=${sessionSecret}`,
    `FRONTEND_URL=http://localhost:5173`,
    `PORT=3001`,
    '',
  ].join('\n');

  fs.writeFileSync(ENV_FILE, envContent, 'utf-8');
  ok(`backend/.env criado com suas credenciais!`);

  // ── Instalar dependências ─────────────────────────────────────────────────
  installDeps();
  printDone();
}

function installDeps() {
  log(`\n  Instalando dependências do backend...`);
  execSync('npm install', { cwd: path.join(ROOT, 'backend'), stdio: 'inherit' });
  ok('backend pronto.');

  log(`\n  Instalando dependências do frontend...`);
  execSync('npm install', { cwd: path.join(ROOT, 'frontend'), stdio: 'inherit' });
  ok('frontend pronto.');
}

function printDone() {
  log(`\n${B}${G}✅ Tudo pronto!${R}`);
  log(`${'─'.repeat(42)}`);
  log(`\n  Agora rode:\n`);
  log(`  ${B}npm run dev${R}\n`);
  log(`  Depois abra no navegador: ${C}http://localhost:5173${R}\n`);
}

main().catch((err) => {
  console.error('\nErro durante o setup:', err.message);
  process.exit(1);
});
