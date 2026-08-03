# 🚀 Guia de Início Rápido

## Passo 1: Configurar Supabase

### 1.1 Criar uma conta Supabase
- Acesse https://supabase.com
- Clique em "Start your project"
- Faça login com GitHub ou email

### 1.2 Criar um novo projeto
- Clique em "New project"
- Escolha um nome (ex: "plataforma-relatorios")
- Defina uma senha segura
- Selecione a região (recomendado: América do Sul)
- Clique em "Create new project"

### 1.3 Obter suas credenciais
- Vá para Settings > API (à esquerda)
- Copie:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Passo 2: Preparar o Projeto

### 2.1 Abrir em VS Code
- Abra a pasta `projeto-alfred` no VS Code

### 2.2 Criar arquivo .env.local
- Abra o terminal (Ctrl + `)
- Execute:
  ```bash
  cp .env.local.example .env.local
  ```

### 2.3 Preencher variáveis de ambiente
- Abra o arquivo `.env.local`
- Cole as credenciais do Supabase:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  ```
- Salve (Ctrl + S)

## Passo 3: Criar Banco de Dados

### 3.1 Acessar SQL Editor
- Vá para o Supabase
- Clique em "SQL Editor" (no menu esquerdo)
- Clique em "+ New query"

### 3.2 Executar Migration
- Abra o arquivo `migrations/001_create_maintenance_reports_table.sql`
- Copie todo o conteúdo
- Cole no SQL Editor do Supabase
- Clique em "RUN" (botão azul)

Você verá a mensagem de sucesso quando a tabela for criada! ✅

## Passo 4: Instalar Dependências

No terminal VS Code, execute:

```bash
npm install
```

Aguarde até aparecer "added X packages" (pode levar alguns minutos).

## Passo 5: Executar a Aplicação

No terminal, execute:

```bash
npm run dev
```

Você verá algo como:
```
> next dev
  ▲ Next.js 14.2.3
  - Local:        http://localhost:3000
```

## Passo 6: Acessar a Aplicação

- Abra o navegador
- Acesse http://localhost:3000
- Você verá a página de login! 🎉

## Teste a Aplicação

### Criar uma Conta
1. Clique em "Não tem conta? Criar agora"
2. Preencha:
   - Email: seu@email.com
   - Senha: qualquer coisa (ex: Teste123!)
3. Clique em "Criar Conta"
4. Você receberá um email para confirmar (se configurado)
5. Para desenvolvimento, você pode confirmar manualmente no Supabase:
   - Vá para Authentication > Users
   - Veja o usuário criado
   - Você pode fazer login normalmente

### Testar a Plataforma
1. **Novo Relatório**
   - Clique em "Novo Relatório"
   - Preencha os dados:
     - Nº Máquina: MNT-001
     - Data: escolha a data
     - Local: Pavilhão A
     - Responsável: Seu Nome
   - Clique em "Adicionar Linha"
   - Preencha um componente:
     - Componente: Motor
     - Condição: Bom
     - Ação: Lubrificar
   - Clique em "Salvar Relatório"

2. **Visualizar no Dashboard**
   - Você será redirecionado para o relatório
   - Volte ao Dashboard
   - Veja seu relatório na lista

3. **Editar**
   - Clique no relatório
   - Clique em "Editar"
   - Mude algo (ex: condição para "Regular")
   - Clique em "Salvar Alterações"

4. **Gerar PDF**
   - No relatório, clique em "Gerar PDF"
   - O PDF será baixado automaticamente

## ⚠️ Problemas Comuns

### "Cannot find module '@supabase/supabase-js'"
- Execute: `npm install`
- Se persistir, delete `node_modules` e `.next`:
  ```bash
  rm -r node_modules .next
  npm install
  ```

### "Missing Supabase environment variables"
- Verifique o arquivo `.env.local`
- As credenciais estão corretas?
- Reinicie o servidor: `npm run dev`

### "Table 'maintenance_reports' does not exist"
- Volte ao Passo 3
- Certifique-se de executar a migration no Supabase
- Aguarde a confirmação de sucesso

### Aplicação não carrega
- Verifique http://localhost:3000 no navegador
- Abra o DevTools (F12)
- Veja a aba "Console" para erros

## 📱 Instalar como App PWA

### No Celular (Android/iOS)
1. Abra a aplicação no navegador do celular
2. Toque no menu (⋮ ou compartilhar)
3. Procure por:
   - "Instalar app" ou
   - "Adicionar à tela inicial" ou
   - "Add to Home Screen"
4. Confirme
5. O app aparecerá na sua biblioteca de apps! 🚀

## 🎨 Customizações Básicas

### Mudar Cores
Edite `tailwind.config.ts`:
```typescript
colors: {
  primary: '#seu-cor',
  accent: '#outra-cor',
}
```

### Mudar Nome da Aplicação
Edite `app/layout.tsx`:
```typescript
title: "Seu Nome Aqui",
```

### Mudar Ícone PWA
- Coloque imagens em `public/`:
  - `icon-192.png`
  - `icon-512.png`
- Edite `public/manifest.json`

## 🚀 Deploy (Opcional)

### Vercel (Recomendado)
1. Faça git push do projeto
2. Acesse https://vercel.com
3. Clique "New Project"
4. Selecione seu repositório
5. Adicione as variáveis de ambiente
6. Clique "Deploy"

## 📞 Próximos Passos

- Explorar a interface
- Testar todas as funcionalidades
- Customizar cores e design
- Fazer deploy em produção

**Parabéns! Sua plataforma está pronta! 🎉**

---

Para dúvidas, consulte:
- README.md (documentação completa)
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
