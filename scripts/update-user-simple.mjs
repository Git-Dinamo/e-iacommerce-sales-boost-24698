/**
 * Script simples para atualizar permissões de usuário no Supabase
 * Usage: node scripts/update-user-simple.mjs
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

const supabaseUrl = envVars.SUPABASE_URL || 'https://kjuouwqsjanwnfhaecoo.supabase.co';
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SECRET_KEY || 'sb_publishable_NQVkNsfmxWn6VCnGdENOEA_VbN81vby';

console.log('🚀 Iniciando atualização de permissões...');
console.log('📡 URL:', supabaseUrl);
console.log('🔑 Usando:', supabaseKey.startsWith('eyJ') ? 'SERVICE_ROLE_KEY ✅' : 'Chave pública ⚠️');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updateUserToGestor(email) {
  console.log(`\n🔍 Buscando usuário: ${email}...`);

  try {
    // Método 1: Tentar listar usuários via Admin API
    console.log('🔑 Usando Admin API...');
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError.message);
      console.log('\n⚠️  NOTA: Você precisa usar o SERVICE_ROLE_KEY, não a chave pública.');
      console.log('💡 Encontre a SERVICE_ROLE_KEY no Supabase Dashboard > Project Settings > API');
      return false;
    }

    const user = users?.find(u => u.email === email);

    if (!user) {
      console.error(`❌ Usuário ${email} não encontrado.`);
      console.log('📝 Usuários encontrados:', users.map(u => u.email).join(', '));
      return false;
    }

    console.log(`✅ Usuário encontrado!`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Created: ${user.created_at}`);

    const userId = user.id;

    // 2. Criar/atualizar profile
    console.log('\n📝 Atualizando profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: 'Legolas',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error('⚠️  Erro ao atualizar profile:', profileError.message);
    } else {
      console.log('✅ Profile atualizado');
    }

    // 3. Remover roles existentes
    console.log('\n🗑️  Removendo roles antigas...');
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (deleteError && deleteError.code !== 'PGRST116') {
      console.log('⚠️  Aviso ao remover roles:', deleteError.message);
    } else {
      console.log('✅ Roles antigas removidas');
    }

    // 4. Adicionar role gestor
    console.log('\n👑 Adicionando role GESTOR...');
    const { data: insertData, error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'gestor'
      })
      .select();

    if (insertError) {
      console.error('❌ Erro ao adicionar role gestor:', insertError.message);
      console.error('   Código:', insertError.code);
      console.error('   Detalhes:', insertError.details);
      return false;
    }

    console.log('✅ Role gestor adicionada!');

    // 5. Verificar resultado
    console.log('\n🔍 Verificando resultado...');
    const { data: userRoles, error: verifyError } = await supabase
      .from('user_roles')
      .select('role, created_at')
      .eq('user_id', userId);

    if (verifyError) {
      console.error('⚠️  Erro ao verificar:', verifyError.message);
    } else {
      console.log('✅ Verificação concluída!');
      console.log('📊 Roles atuais:', JSON.stringify(userRoles, null, 2));
    }

    console.log('\n✨ Processo concluído com sucesso!');
    console.log('🔄 Faça logout e login novamente no app para aplicar as mudanças.');
    return true;

  } catch (error) {
    console.error('\n❌ Erro inesperado:', error.message);
    return false;
  }
}

// Executar
const email = process.argv[2] || 'legolas@dinamopro.com';
updateUserToGestor(email)
  .then((success) => {
    if (success) {
      console.log('\n✅ Script executado com sucesso!');
      process.exit(0);
    } else {
      console.log('\n❌ Script falhou. Verifique os erros acima.');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ Erro ao executar script:', error);
    process.exit(1);
  });
