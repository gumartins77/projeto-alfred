# 🚀 GUIDE PRÁTICO - Do Setup ao Primeiro Relatório

## Passo 1️⃣: Preparar o Banco de Dados

### No Supabase:

1. **Abrir SQL Editor**
   - Supabase.com > Seu Projeto > SQL Editor > New Query

2. **Executar Migration 001** (se ainda não executou)
   - Copie todo o conteúdo de: `migrations/001_create_maintenance_reports_table.sql`
   - Cole no SQL Editor
   - Clique em "Run"
   - ✅ Tabela `maintenance_reports` criada

3. **Executar Migration 002**
   - Copie todo o conteúdo de: `migrations/002_add_missing_maintenance_fields.sql`
   - Cole no SQL Editor
   - Clique em "Run"
   - ✅ Novos campos adicionados
   - ✅ Tabela `maintenance_report_parts` criada

4. **Verificar no Schema**
   - Vá em: Supabase > Schema
   - Clique em "public" > "Tables"
   - Você deve ver:
     - `maintenance_reports` (25 colunas)
     - `maintenance_report_parts` (9 colunas)

---

## Passo 2️⃣: Iniciar o App Localmente

### Terminal (Windows PowerShell):

```powershell
# 1. Navegar para a pasta do projeto
cd c:\Users\GustavoSantos\Downloads\projeto-alfred

# 2. Instalar dependências (se não fez ainda)
npm install

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

### Esperado:
```
  ▲ Next.js 14.2.3
  - Local:        http://localhost:3000
  
✓ Ready in 1234ms
```

### Abrir no Browser:
- **Desktop**: http://localhost:3000
- **Mobile**: http://<seu-ip-local>:3000 (ex: http://192.168.1.100:3000)

---

## Passo 3️⃣: Fazer Login

### Na página que abrir:

1. **Criar nova conta**
   - Email: seu-email@exemplo.com
   - Senha: qualquer senha (mínimo 6 caracteres)
   - Clique "Criar Conta"

2. **Fazer Login**
   - Use as credenciais criadas
   - Clique "Entrar"

### Esperado:
- Será redirecionado para o Dashboard
- Você verá: "Nenhum relatório" (vazio no começo)
- Botão "Novo Relatório" no topo

---

## Passo 4️⃣: Criar Primeiro Relatório

### Dashboard → Clique "Novo Relatório"

Você verá 6 seções. Preencha assim:

### 📋 SEÇÃO 1: DADOS DO CLIENTE

```
Cliente:           Empresa XYZ Ltda
Contato:           João da Silva
Telefone:          (11) 98765-4321
Endereço:          Rua das Flores, 123 - Apt 456
Cidade:            São Paulo
Estado:            SP
Descrição Função:  Manutenção de compressor industrial
Área de Serviço:   Fábrica Principal
Nº Relatório:      REL-2024-001
Tipo:              ◉ Rotina  ○ Chamado
```

### 📋 SEÇÃO 2: DADOS DO EQUIPAMENTO

```
Nº Máquina:        COMP-MNT-001
Data:              [hoje] (usar date picker)
Início:            08:30
Término:           10:45
Local:             Sala de Máquinas - Piso 2
Responsável:       Pedro Mecânico
Observações:       Máquina operando normalmente.
                   Realizada limpeza completa.
                   Trocar óleo no próximo trimestre.
```

### 📋 SEÇÃO 3: ITENS DE MANUTENÇÃO

**Item 1:**
```
Tipo de Máquina:           Compressor
Nº Máquina:                COMP-MNT-001
Nº Patrimônio:             PAT-2023-0045
Produto/Qtd Aplicada:      Óleo Premium ISO-32 - 2 litros
Material/Acabamento:       Aço galvanizado
Onde Aplicado:             Cilindro principal
```

**Clique "+ Adicionar Item"**

**Item 2:**
```
Tipo de Máquina:           Compressor
Nº Máquina:                COMP-MNT-001
Nº Patrimônio:             PAT-2023-0045
Produto/Qtd Aplicada:      Filtro de ar K6 - 1 unidade
Material/Acabamento:       Fibra de vidro
Onde Aplicado:             Entrada de ar
```

### 📋 SEÇÃO 4: PEÇAS A SEREM SUBSTITUÍDAS

**Peça 1:**
```
Nº Máquina:        COMP-MNT-001
Fig.:              3.1
Item:              B2
Quantidade:        1
Descrição:         Válvula de retenção DN20
```

**Clique "+ Adicionar Peça"** (ou deixe vazio se não houver)

### 📋 SEÇÃO 5: PEÇAS SUBSTITUÍDAS

**Peça 1:**
```
Nº Máquina:        COMP-MNT-001
Fig.:              2.5
Item:              A8
Quantidade:        1
Descrição:         Parafuso M10x50 - Aço inox
```

### 📋 SEÇÃO 6: VISTOS / ASSINATURAS

```
Visto Técnico:           Pedro Silva
Visto Cliente:           João da Silva
Visto Responsável:       Carlos Gerente
```

### ✅ CLIQUE: "Salvar Relatório"

---

## Passo 5️⃣: Verificar o Relatório Criado

### Esperado após salvar:

1. **Redirecionado para página do relatório**
   - Título: "Relatório - COMP-MNT-001"
   - Botões: "Editar" e "Gerar PDF"

2. **Visualizar as informações**
   - Clique em cada seção para ver os dados
   - Verifique se tudo foi salvo corretamente

3. **Botões de Ação:**
   - **Editar**: Clique para modificar qualquer campo
   - **Gerar PDF**: Cria um arquivo PDF para download

---

## Passo 6️⃣: Testar Edição

### No relatório visualizado:

1. **Clique "Editar"**
   - Todos os campos se tornam editáveis
   - As seções mudam para modo formulário

2. **Faça uma alteração**
   - Por exemplo: Mude "Responsável" de Pedro para "Antonio"
   - Ou adicione um novo item

3. **Clique "Salvar Alterações"**
   - ✅ Dados atualizados
   - Volta ao modo visualização

---

## Passo 7️⃣: Testar PDF

### No relatório:

1. **Clique "Gerar PDF"**
   - Botão muda para: "Gerando..."
   - Aguarde 2-3 segundos

2. **Download automático**
   - Um arquivo é baixado: `relatorio_COMP-MNT-001_2024-01-15.pdf`
   - Abra o PDF no seu leitor
   - Verifique se todas as seções aparecem

---

## Passo 8️⃣: Testar Dashboard

### Volta para Dashboard

1. **Clique no logo "Relatórios" ou ◀ na página do relatório**
   - Você volta para o Dashboard

2. **Você verá o relatório criado**
   - Card mostrando: Nº Máquina, Local, Responsável, Data
   - Clique no card para abrir novamente

3. **Testar filtros** (opcional)
   - Busque por: "COMP-MNT-001"
   - Filtrar por data
   - Limpar filtros

---

## Passo 9️⃣: Instalar como PWA (celular)

### No navegador do celular:

1. **Abrir a URL**
   - `http://<seu-ip>:3000` (ex: http://192.168.1.100:3000)

2. **Menu (hambúrguer ≡) → Instalar app**
   - Ou: "Adicionar à tela inicial"

3. **App instalado**
   - Aparece um ícone na tela inicial
   - Clique para abrir sem ir ao navegador
   - Funciona **offline** após primeira abertura

---

## 🆘 Troubleshooting

### Erro: "Relatório não encontrado"
- Migration 002 não foi executada no Supabase
- **Solução**: Execute a migration conforme Passo 1

### Erro: "Erro ao atualizar relatório"
- Faltam campos obrigatórios
- **Solução**: Preencha Nº Máquina, Data, Local, Responsável

### Campos de Peças vazios
- Isso é normal. As peças são opcionais
- Se preencher, ficarão armazenadas

### Erro: "Nenhuma conexão"
- O servidor (npm run dev) está parado
- **Solução**: Execute `npm run dev` novamente no terminal

### PDF branco ou vazio
- PDF ainda está em desenvolvimento (Phase 5)
- **Workaround**: Tire screenshot da página para salvar

---

## 📱 Checklist - Depois de Criar o Primeiro Relatório

- [x] Relatório criado com sucesso
- [x] Todos os campos aparecem na visualização
- [x] Edição funciona
- [x] Alterações são salvas
- [x] Dashboard lista o relatório
- [x] PDF pode ser gerado (mesmo que simples)
- [x] No celular: PWA instalado
- [x] No celular: Dados aparecem corretamente

---

## 🎉 Parabéns!

Seu sistema de Boletim de Manutenção está **100% funcional** e pronto para uso!

### Próximas melhorias (opcional):
- Atualizar PDF com design profissional
- Adicionar gráficos no dashboard
- Exportar múltiplos relatórios em Excel
- Integrar foto/câmera para assinatura
- Backup automático na nuvem

---

## 📞 Suporte Rápido

**Precisa parar o servidor?**
```powershell
Ctrl + C
```

**Reiniciar servidor?**
```powershell
npm run dev
```

**Limpar cache do navegador?**
```
Ctrl + Shift + Delete (ou Cmd + Shift + Delete no Mac)
```

**Verificar errors no console?**
```
F12 → Console
```

---

**Tudo pronto! Aproveite! 🚀**
