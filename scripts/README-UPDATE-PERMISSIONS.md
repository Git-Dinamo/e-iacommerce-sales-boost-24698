# Como Atualizar Permissões do Usuário para Gestor

## Problema
O usuário `legolas@dinamopro.com` está logando via OAuth do Google, mas não tem permissões de gestor.

## Solução

Você tem **3 opções** para resolver isso:

---

## ✅ OPÇÃO 1: Usar o SQL Editor do Supabase (MAIS RÁPIDO)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral esquerdo)
4. Cole o script abaixo e clique em **RUN**:

```sql
-- Verificar usuário atual
SELECT
  u.id,
  u.email,
  p.full_name,
  ur.role as current_role
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = 'legolas@dinamopro.com';

-- Atualizar para gestor
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'legolas@dinamopro.com';

  IF v_user_id IS NOT NULL THEN
    -- Criar/atualizar profile
    INSERT INTO public.profiles (id, full_name, created_at, updated_at)
    VALUES (v_user_id, 'Legolas', now(), now())
    ON CONFLICT (id) DO UPDATE
    SET updated_at = now();

    -- Remover role existente
    DELETE FROM public.user_roles WHERE user_id = v_user_id;

    -- Adicionar role gestor
    INSERT INTO public.user_roles (user_id, role, created_at)
    VALUES (v_user_id, 'gestor', now());

    RAISE NOTICE 'Usuário atualizado para gestor com sucesso!';
  ELSE
    RAISE WARNING 'Usuário não encontrado. Faça login primeiro.';
  END IF;
END $$;

-- Verificar resultado
SELECT
  u.id,
  u.email,
  p.full_name,
  ur.role as new_role,
  ur.created_at as role_assigned_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = 'legolas@dinamopro.com';
```

5. **Faça logout e login novamente** no aplicativo

---

## ✅ OPÇÃO 2: Via Script Node.js (Requer Service Role Key)

### Passo 1: Obter a Service Role Key

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Project Settings** > **API**
3. Copie a chave **`service_role`** (⚠️ NUNCA compartilhe esta chave!)

### Passo 2: Atualizar o .env

Adicione no arquivo `.env`:

```env
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

### Passo 3: Executar o script

```bash
node scripts/update-user-simple.mjs
```

---

## ✅ OPÇÃO 3: Manualmente via Table Editor

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Table Editor** (menu lateral)
3. Selecione a tabela **`auth.users`**
4. Encontre o usuário `legolas@dinamopro.com` e copie o **ID**
5. Vá na tabela **`profiles`**:
   - Se não existir uma linha com esse ID, crie uma nova
   - Preencha: `id` = ID copiado, `full_name` = "Legolas"
6. Vá na tabela **`user_roles`**:
   - Exclua qualquer linha existente com esse `user_id`
   - Adicione nova linha:
     - `user_id` = ID copiado
     - `role` = `gestor`
     - `created_at` = now()
7. **Faça logout e login novamente** no aplicativo

---

## Verificação

Após atualizar, você pode verificar se funcionou executando no SQL Editor:

```sql
SELECT
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = 'legolas@dinamopro.com';
```

Deve retornar: `role = gestor`

---

## Estrutura de Roles

Para referência, existem 3 roles no sistema:

- **`gestor`**: Permissões completas (edit em tudo)
- **`comercial`**: Visualização de custos, edição de simulações
- **`usuario`**: Sem permissões (role padrão)

As permissões detalhadas estão na tabela `role_permissions`.

---

## Scripts Disponíveis

- `scripts/update-user-to-gestor.sql` - SQL direto para executar no Dashboard
- `scripts/update-user-simple.mjs` - Script Node.js (requer service role key)
- `scripts/update-user-permissions.ts` - Script TypeScript completo

---

## Problemas Comuns

### "Usuário não encontrado"
- Certifique-se de ter feito login pelo menos uma vez via OAuth do Google
- O usuário só é criado no banco após o primeiro login

### "Permission denied"
- Você precisa usar a **service_role key**, não a chave pública
- A service_role key ignora as políticas RLS

### "Ainda não tem permissões após atualizar"
- Faça **logout** e **login** novamente no app
- Limpe o cache do navegador
- Verifique se a role foi realmente atualizada no banco

---

## Suporte

Se ainda tiver problemas, verifique:
1. O email está correto? `legolas@dinamopro.com`
2. O usuário existe na tabela `auth.users`?
3. As políticas RLS estão ativas?
4. Os hooks/triggers estão funcionando?
