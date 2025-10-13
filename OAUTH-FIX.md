# Corrigir Erro "requested path is invalid" do OAuth

## Problema
Ao fazer login com Google OAuth, aparece o erro: `{"error":"requested path is invalid"}`

## Causa
As URLs de redirecionamento (Redirect URLs) não estão configuradas corretamente no Supabase Dashboard.

## Solução

### Passo 1: Acesse o Supabase Dashboard

1. Vá para https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Authentication** > **URL Configuration**

### Passo 2: Configure as Redirect URLs

Adicione as seguintes URLs na seção **Redirect URLs**:

```
http://localhost:8080/
http://localhost:8081/
http://localhost:8082/
http://localhost:5173/
https://calculadora.clinicia.com/
```

### Passo 3: Configure o Site URL

Na seção **Site URL**, defina:

```
http://localhost:8080
```

### Passo 4: Salve as Configurações

Clique em **Save** para aplicar as mudanças.

### Passo 5: Teste Novamente

1. Acesse: http://localhost:8082/auth
2. Clique em "Entrar com Google"
3. Faça login com legolas@dinamopro.com
4. Você deve ser redirecionado para a página principal

---

## URLs que Precisam Estar Configuradas

### Development (Local)
- `http://localhost:8080/`
- `http://localhost:8081/`
- `http://localhost:8082/`
- `http://localhost:5173/` (porta padrão do Vite)

### Production
- `https://calculadora.clinicia.com/`
- Qualquer outro domínio de produção que você usar

---

## Verificando a Configuração Atual

No Supabase Dashboard, vá em:
**Authentication** > **URL Configuration**

E verifique se você vê:

```
Site URL: http://localhost:8080
Redirect URLs:
  - http://localhost:8080/
  - http://localhost:8081/
  - http://localhost:8082/
  - http://localhost:5173/
```

---

## Ainda não funciona?

Se ainda aparecer o erro, tente:

1. **Limpar o cache do navegador** e cookies
2. **Usar modo anônimo/privado** do navegador
3. **Verificar se o email** legolas@dinamopro.com está autorizado
4. **Verificar os logs** no Supabase Dashboard > Logs > Auth Logs

---

## Atalhos Rápidos

- Supabase Dashboard: https://supabase.com/dashboard
- Seu Projeto: https://supabase.com/dashboard/project/kjuouwqsjanwnfhaecoo
- Auth Config: https://supabase.com/dashboard/project/kjuouwqsjanwnfhaecoo/auth/url-configuration
