/**
 * Script para atualizar permissões de usuário no Supabase
 * Usage: npx tsx scripts/update-user-permissions.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL e SUPABASE_SECRET_KEY devem estar definidos no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateUserToGestor(email: string) {
  console.log(`🔍 Buscando usuário: ${email}...`);

  // 1. Buscar o usuário no auth.users
  const { data: authUsers, error: authError } = await supabase
    .from('auth.users')
    .select('id, email')
    .eq('email', email)
    .single();

  if (authError) {
    console.error('❌ Erro ao buscar usuário:', authError.message);

    // Tentar buscar via RPC ou query alternativa
    console.log('🔄 Tentando método alternativo...');

    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError.message);
      return;
    }

    const user = users?.find(u => u.email === email);

    if (!user) {
      console.error(`❌ Usuário ${email} não encontrado. Certifique-se de fazer login primeiro.`);
      return;
    }

    console.log(`✅ Usuário encontrado: ${user.id}`);
    await updateUserRole(user.id, email);
    return;
  }

  await updateUserRole(authUsers.id, email);
}

async function updateUserRole(userId: string, email: string) {
  console.log(`👤 User ID: ${userId}`);

  // 2. Criar/atualizar profile
  console.log('📝 Verificando profile...');
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      full_name: 'Legolas',
      updated_at: new Date().toISOString()
    });

  if (profileError) {
    console.error('⚠️  Erro ao atualizar profile:', profileError.message);
  } else {
    console.log('✅ Profile atualizado');
  }

  // 3. Remover roles existentes
  console.log('🗑️  Removendo roles antigas...');
  const { error: deleteError } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId);

  if (deleteError) {
    console.error('⚠️  Erro ao remover roles antigas:', deleteError.message);
  }

  // 4. Adicionar role gestor
  console.log('👑 Adicionando role GESTOR...');
  const { error: insertError } = await supabase
    .from('user_roles')
    .insert({
      user_id: userId,
      role: 'gestor',
      created_at: new Date().toISOString()
    });

  if (insertError) {
    console.error('❌ Erro ao adicionar role gestor:', insertError.message);
    return;
  }

  // 5. Verificar resultado
  console.log('🔍 Verificando resultado...');
  const { data: userRoles, error: verifyError } = await supabase
    .from('user_roles')
    .select('role, created_at')
    .eq('user_id', userId);

  if (verifyError) {
    console.error('⚠️  Erro ao verificar:', verifyError.message);
  } else {
    console.log('✅ Role atualizada com sucesso!');
    console.log('📊 Roles atuais:', userRoles);
  }

  console.log('\n✨ Processo concluído! Faça logout e login novamente para aplicar as mudanças.');
}

// Executar
const email = process.argv[2] || 'legolas@dinamopro.com';
updateUserToGestor(email)
  .then(() => {
    console.log('\n✅ Script executado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro ao executar script:', error);
    process.exit(1);
  });
