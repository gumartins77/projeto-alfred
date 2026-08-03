# 📊 Schema Final - Boletim de Manutenção

Aqui está o schema final do banco de dados atualizado com todos os campos do formulário físico.

## Tabela: `maintenance_reports`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | ID único do relatório (auto-gerado) |
| `user_id` | UUID | Sim | ID do usuário autenticado (FK) |
| **Report Info** |
| `report_number` | VARCHAR(50) | Não | Número do relatório (ex: REL-001) |
| `report_type` | VARCHAR(20) | Sim* | Tipo: 'rotina' ou 'chamado' |
| **Client Data** |
| `client_name` | VARCHAR(255) | Não | Nome do cliente |
| `client_address` | VARCHAR(255) | Não | Endereço do cliente |
| `client_city` | VARCHAR(100) | Não | Cidade |
| `client_phone` | VARCHAR(50) | Não | Telefone |
| `client_contact` | VARCHAR(255) | Não | Pessoa de contato |
| `client_state` | VARCHAR(2) | Não | Estado (ex: SP) |
| `function_description` | VARCHAR(255) | Não | Descrição da função |
| `service_area` | VARCHAR(255) | Não | Área de serviço |
| **Equipment Data** |
| `machine_number` | VARCHAR(255) | Sim | Nº da máquina (ex: MNT-001) |
| `date` | DATE | Sim | Data do relatório |
| `start_time` | TIME | Não | Hora de início |
| `end_time` | TIME | Não | Hora de término |
| `location` | VARCHAR(255) | Sim | Local da manutenção |
| `responsible` | VARCHAR(255) | Sim | Responsável pela manutenção |
| `observations` | TEXT | Não | Observações gerais |
| **Maintenance Line Items** |
| `line_items` | JSONB | Sim* | Array de itens de manutenção |
| **Signatures** |
| `technical_signature` | TEXT | Não | Assinatura do técnico (nome) |
| `client_signature` | TEXT | Não | Assinatura do cliente (nome) |
| `responsible_signature` | TEXT | Não | Assinatura do responsável (nome) |
| **Metadata** |
| `created_at` | TIMESTAMP | Auto | Data/hora de criação |
| `updated_at` | TIMESTAMP | Auto | Data/hora da última atualização |

**Obs:** `report_type` padrão é 'rotina'.

### Estrutura do `line_items` (JSONB)

Cada item no array `line_items` tem a estrutura:

```json
{
  "tipo_maquina": "Compressor",
  "numero_maquina": "MNT-001",
  "numero_patrimonio": "PAT-001",
  "produto_quantidade_aplicada": "Óleo lubrificante - 500ml",
  "material_acabamento": "Aço galvanizado",
  "material_onde_aplicado": "Rolamentos principais"
}
```

---

## Tabela: `maintenance_report_parts`

Tabela separada para peças a serem substituídas / substituídas.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | ID único da peça (auto-gerado) |
| `report_id` | UUID | Sim | ID do relatório (FK → maintenance_reports) |
| `list_number` | SMALLINT | Sim | 1 = A serem substituídas, 2 = Substituídas |
| `machine_number` | VARCHAR(255) | Não | Nº da máquina |
| `fig` | VARCHAR(50) | Não | Número da figura |
| `item` | VARCHAR(50) | Não | Número do item |
| `quantity` | NUMERIC | Não | Quantidade |
| `description` | TEXT | Não | Descrição da peça |
| `created_at` | TIMESTAMP | Auto | Data de criação |
| `updated_at` | TIMESTAMP | Auto | Data de atualização |

### Exemplo de Dados

**Peças a Serem Substituídas (list_number = 1):**
```
report_id: 550e8400-e29b-41d4-a716-446655440000
machine_number: MNT-001
fig: 3.2
item: A4
quantity: 2
description: Parafuso M8x20 - Aço inox
```

**Peças Substituídas (list_number = 2):**
```
report_id: 550e8400-e29b-41d4-a716-446655440000
machine_number: MNT-001
fig: 3.2
item: A4
quantity: 2
description: Parafuso M8x20 - Aço inox
```

---

## 🔐 Segurança (Row Level Security - RLS)

Ambas as tabelas têm RLS habilitado:

- Usuários só conseguem ver/editar seus próprios relatórios
- Usuários só conseguem ver/editar peças vinculadas aos seus relatórios
- Deletar um relatório deleta automaticamente todas as peças vinculadas (CASCADE)

---

## 📋 Estrutura Frontend

### Seções do Formulário

O formulário é dividido em **6 seções principais**:

1. **Dados do Cliente**
   - Cliente, Contato, Telefone, Endereço, Cidade, Estado, Função, Área de Serviço
   - Nº do Relatório, Tipo (Rotina/Chamado)

2. **Dados do Equipamento**
   - Nº Máquina, Data, Início, Término, Local, Responsável, Observações

3. **Itens de Manutenção** (Linhas dinâmicas)
   - Tipo de Máquina, Nº Máquina, Nº Patrimônio
   - Produto/Qtd Aplicada, Material/Acabamento, Onde Aplicado
   - Botão "Adicionar Item" / "Remover Item"

4. **Peças a Serem Substituídas** (Lista 1)
   - Nº Máquina, Fig., Item, Quant., Descrição
   - Botão "Adicionar Peça" / "Remover Peça"

5. **Peças Substituídas** (Lista 2)
   - Mesma estrutura da lista 1

6. **Vistos / Assinaturas**
   - Visto Técnico (nome)
   - Visto Cliente (nome)
   - Visto Responsável (nome)

---

## 📄 PDF Export

O PDF inclui:
- Header com logo/título
- Tabela com Dados do Relatório (Cliente, Equipamento)
- Tabela com Itens de Manutenção
- Tabela com Peças Substituídas
- Assinaturas em rodapé
- Styling profissional

---

## ✅ Checklist de Implementação

- [x] Migration 001: Tabela base maintenance_reports
- [x] Migration 002: Campos adicionais + tabela maintenance_report_parts
- [x] Frontend: ClientDataSection component
- [x] Frontend: PartsListSection component
- [x] Frontend: SignaturesSection component
- [x] Frontend: Formulário novo-relatorio atualizado
- [x] Frontend: Página relatorio/[id] atualizado
- [x] Backend: Funções em lib/parts.ts
- [x] Backend: Tipos atualizados em lib/types.ts
- [ ] PDF: Atualizar para incluir todas as seções

---

## 🚀 Próximos Passos

1. Executar a Migration 002 no Supabase
2. Testar criação de novo relatório com todas as seções
3. Testar edição e visualização
4. Testar geração de PDF
5. Instalar como PWA e testar no celular
