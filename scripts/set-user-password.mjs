/**
 * Script para definir senha para um usuário
 * Usage: node scripts/set-user-password.mjs legolas@dinamopro.com nova_senha
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Ler .env manualmente
const envPath = join(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔐 Definindo senha para usuário...\n');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setUserPassword(email, password) {
  try {
    // 1. Buscar usuário
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError.message);
      return false;
    }

    const user = users?.find(u => u.email === email);

    if (!user) {
      console.error(`❌ Usuário ${email} não encontrado.`);
      return false;
    }

    console.log(`✅ Usuário encontrado: ${user.id}\n`);

    // 2. Atualizar senha usando Admin API
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: password }
    );

    if (error) {
      console.error('❌ Erro ao definir senha:', error.message);
      return false;
    }

    console.log('✅ Senha definida com sucesso!\n');
    console.log('📋 Credenciais:');
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${password}`);
    console.log('\n🔐 Guarde essas credenciais em local seguro!');
    console.log('\n✨ Agora você pode fazer login com email/senha.');

    return true;

  } catch (error) {
    console.error('\n❌ Erro inesperado:', error.message);
    return false;
  }
}

// Executar
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('❌ Uso: node scripts/set-user-password.mjs <email> <senha>');
  console.error('   Exemplo: node scripts/set-user-password.mjs legolas@dinamopro.com MinhaSenh@123');
  process.exit(1);
}

if (password.length < 6) {
  console.error('❌ A senha deve ter pelo menos 6 caracteres');
  process.exit(1);
}

setUserPassword(email, password)
  .then((success) => {
    if (success) {
      console.log('\n✅ Processo concluído!');
      process.exit(0);
    } else {
      console.log('\n❌ Falha ao definir senha.');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ Erro:', error);
    process.exit(1);
  });
