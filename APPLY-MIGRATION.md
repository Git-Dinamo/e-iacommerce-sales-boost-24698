# Aplicar Migração do Sistema de Projetos

## 📋 Passos para aplicar a migração no Supabase

### 1. Acesse o Supabase Dashboard

Vá para: https://supabase.com/dashboard/project/kjuouwqsjanwnfhaecoo/editor

### 2. Abra o SQL Editor

- No menu lateral, clique em **SQL Editor**
- Clique em **New query**

### 3. Cole o SQL da Migração

Copie e cole todo o conteúdo do arquivo:
```
supabase/migrations/20251013030000_create_projects_system.sql
```

### 4. Execute a Migração

- Clique em **Run** (ou pressione `Ctrl+Enter`)
- Aguarde a execução completar
- Você deve ver mensagens de sucesso

### 5. Verifique as Tabelas Criadas

No **Table Editor**, você deve ver as novas tabelas:
- ✅ `projects` - Armazena os projetos/ficheiros
- ✅ `calculator_data` - Armazena os dados das calculadoras

### 6. Testar o Sistema

1. Acesse a aplicação: http://localhost:8083/
2. Você deve ver a tela de gerenciamento de projetos
3. Clique em "Novo Projeto" para criar um ficheiro
4. O projeto será criado e você será redirecionado para a calculadora

---

## 🏗️ Estrutura das Tabelas

### Tabela `projects`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único do projeto |
| name | TEXT | Nome do projeto |
| description | TEXT | Descrição do projeto |
| client_name | TEXT | Nome do cliente |
| status | TEXT | Status: draft, active, archived |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Última atualização |
| last_accessed_at | TIMESTAMP | Último acesso |

### Tabela `calculator_data`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único |
| project_id | UUID | Referência ao projeto |
| impl_* | NUMERIC | Valores de implantação |
| rec_* | NUMERIC | Valores de recorrência |
| sim_* | NUMERIC | Dados de simulação |
| observacoes | JSONB | Observações (JSON) |
| custos_fonte | JSONB | Custos fonte (JSON) |
| adicionais | JSONB | Adicionais (JSON) |
| complexidades | JSONB | Complexidades (JSON) |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Última atualização |

---

## 🔐 Políticas RLS

As tabelas têm acesso público (sem autenticação) porque o sistema não usa login:

```sql
CREATE POLICY "Allow public access to projects"
ON public.projects
FOR ALL
USING (true)
WITH CHECK (true);
```

---

## ✅ Verificação

Execute este SQL para verificar se tudo está correto:

```sql
-- Verificar tabelas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('projects', 'calculator_data');

-- Contar registros
SELECT 'projects' as table, COUNT(*) FROM projects
UNION ALL
SELECT 'calculator_data', COUNT(*) FROM calculator_data;
```

Você deve ver as duas tabelas e pelo menos 1 projeto de exemplo.

---

## 🚨 Troubleshooting

### Erro: "relation already exists"
As tabelas já foram criadas. Você pode:
1. Ignorar o erro (está tudo OK)
2. Ou dropar as tabelas e recriar:
```sql
DROP TABLE IF EXISTS public.calculator_data CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
-- Depois execute a migração novamente
```

### Erro: "permission denied"
Certifique-se de que está usando o SQL Editor com permissões adequadas. Se necessário, vá em:
**Settings > Database > Connection string** e use o modo direto.

---

## 📱 Funcionalidades Implementadas

Após aplicar a migração, o sistema terá:

1. ✅ **Tela Inicial** - Lista todos os projetos
2. ✅ **Busca** - Buscar projetos por nome, cliente ou descrição
3. ✅ **Criar Projeto** - Dialog para criar novo ficheiro
4. ✅ **Abrir Projeto** - Click para abrir a calculadora
5. ✅ **Arquivar** - Mover projeto para arquivados
6. ✅ **Excluir** - Deletar projeto permanentemente
7. ✅ **Persistência** - Todos os dados salvos no Supabase
8. ✅ **Auto-save** - Dados salvos automaticamente

---

## 🎯 Próximos Passos

Depois de aplicar a migração:

1. Reinicie o servidor (se necessário)
2. Acesse http://localhost:8083/
3. Crie seu primeiro projeto
4. Use a calculadora normalmente
5. Os dados serão salvos automaticamente no Supabase!

---

## 📚 Referências

- Arquivo de migração: `supabase/migrations/20251013030000_create_projects_system.sql`
- Página de projetos: `src/pages/Projects.tsx`
- Página do projeto: `src/pages/ProjectView.tsx`
