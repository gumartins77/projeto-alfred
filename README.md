# Gerenciador de Relatórios de Manutenção

Plataforma completa de gerenciamento de relatórios de manutenção de máquinas com autenticação Supabase, PWA support e geração de PDF.

## 🚀 Funcionalidades

- ✅ **Autenticação Supabase** - Login e registro seguro
- ✅ **Dashboard** - Visualizar todos os relatórios com filtros por data
- ✅ **Criar Relatórios** - Formulário intuitivo e responsivo
- ✅ **Editar Relatórios** - Modificar relatórios existentes
- ✅ **Gerar PDF** - Exportar relatórios em formato PDF profissional
- ✅ **PWA** - Instalável como app no celular
- ✅ **Mobile-First** - 100% responsivo para dispositivos móveis
- ✅ **Linhas Dinâmicas** - Adicionar quantas linhas de manutenção precisar

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta Supabase (https://supabase.com)
- npm ou yarn

## 🔧 Instalação

### 1. Clonar o repositório e instalar dependências

```bash
cd projeto-alfred
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` e preencha com suas credenciais Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
DATABASE_URL=sua_database_url (opcional)
```

### 3. Criar o banco de dados

No Supabase, vá para a seção "SQL Editor" e execute o arquivo de migration:

1. Abra `migrations/001_create_maintenance_reports_table.sql`
2. Copie todo o conteúdo
3. No Supabase SQL Editor, crie uma nova query
4. Cole o conteúdo e execute

Ou você pode usar a CLI do Supabase:

```bash
supabase db push
```

### 4. Executar a aplicação

```bash
npm run dev
```

Acesse `http://localhost:3000` no navegador.

## 📱 Como Usar

### Login/Registro
1. Acesse a página inicial
2. Crie uma conta com seu email e senha, ou faça login

### Dashboard
- Veja todos os seus relatórios
- Filtro por data
- Pesquise por máquina, local ou responsável
- Clique em um relatório para visualizar detalhes

### Criar Novo Relatório
1. Clique em "Novo Relatório" no dashboard
2. Preencha o cabeçalho (máquina, data, local, responsável)
3. Adicione observações (opcional)
4. Adicione linhas de manutenção com:
   - Componente (ex: Motor, Correia, etc)
   - Condição (Bom, Regular, Ruim)
   - Ação Recomendada
5. Clique em "Salvar Relatório"

### Editar Relatório
1. Abra o relatório desejado
2. Clique em "Editar"
3. Faça as alterações necessárias
4. Clique em "Salvar Alterações"

### Gerar PDF
1. Abra o relatório
2. Clique em "Gerar PDF"
3. O PDF será baixado automaticamente

### Instalar como PWA (Celular)
1. Abra a aplicação no navegador do celular
2. Toque no menu (⋮ ou compartilhar)
3. Selecione "Instalar app" ou "Adicionar à tela inicial"
4. O app aparecerá na sua biblioteca de apps

## 🗄️ Estrutura do Projeto

```
projeto-alfred/
├── app/
│   ├── layout.tsx           # Layout raiz
│   ├── page.tsx             # Página inicial
│   ├── globals.css          # Estilos globais
│   ├── dashboard/
│   │   └── page.tsx         # Dashboard
│   ├── novo-relatorio/
│   │   └── page.tsx         # Criar relatório
│   └── relatorio/
│       └── [id]/
│           └── page.tsx     # Visualizar/Editar relatório
├── components/
│   ├── Login.tsx            # Componente de login
│   └── Header.tsx           # Cabeçalho/navbar
├── lib/
│   ├── supabase.ts          # Cliente Supabase
│   ├── types.ts             # Tipos TypeScript
│   ├── utils.ts             # Funções utilitárias
│   └── pdf.ts               # Geração de PDF
├── public/
│   └── manifest.json        # Manifest PWA
├── migrations/
│   └── 001_create_maintenance_reports_table.sql
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.local.example
```

## 🎨 Customização

### Cores
Edite `tailwind.config.ts` para mudar as cores da aplicação:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#f3f4f6',
      secondary: '#e5e7eb',
      accent: '#3b82f6',
    },
  },
},
```

### Ícone PWA
Coloque suas imagens em `public/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `icon.png`

Edite `public/manifest.json` conforme necessário.

## 🚀 Deploy

### Vercel (Recomendado)
1. Faça push do código para GitHub
2. Vá em https://vercel.com
3. Clique em "New Project" e selecione seu repositório
4. Adicione as variáveis de ambiente (NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY)
5. Clique em "Deploy"

### Outras plataformas
Também funciona em:
- Netlify
- GitHub Pages
- Servidor próprio (Node.js)

## 🔒 Segurança

- Autenticação via Supabase (segura e confiável)
- Row Level Security (RLS) habilitado no banco
- Cada usuário vê apenas seus próprios relatórios
- Variáveis de ambiente não expostas

## 📝 Licença

MIT

## 🤝 Suporte

Para dúvidas ou problemas, consulte a documentação:
- [Supabase](https://supabase.com/docs)
- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Desenvolvido com ❤️ para gerenciamento eficiente de manutenção**
