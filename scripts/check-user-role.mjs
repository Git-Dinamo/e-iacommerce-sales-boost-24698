/**
 * Script para verificar a role atual de um usuário
 * Usage: node scripts/check-user-role.mjs legolas@dinamopro.com
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

console.log('🔍 Verificando roles do usuário...\n');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkUserRole(email) {
  try {
    // 1. Buscar usuário
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError.message);
      return;
    }

    const user = users?.find(u => u.email === email);

    if (!user) {
      console.error(`❌ Usuário ${email} não encontrado.`);
      return;
    }

    console.log(`✅ Usuário encontrado:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Created: ${user.created_at}\n`);

    // 2. Verificar profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.log('⚠️  Profile não encontrado:', profileError.message);
    } else {
      console.log('👤 Profile:');
      console.log(`   Nome: ${profile.full_name}`);
      console.log(`   Avatar: ${profile.avatar_url || 'Não definido'}\n`);
    }

    // 3. Verificar roles
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role, created_at')
      .eq('user_id', user.id);

    if (rolesError) {
      console.error('❌ Erro ao buscar roles:', rolesError.message);
      return;
    }

    console.log('🎭 Roles:');
    if (roles && roles.length > 0) {
      roles.forEach(r => {
        const icon = r.role === 'gestor' ? '👑' : r.role === 'comercial' ? '💼' : '👤';
        console.log(`   ${icon} ${r.role.toUpperCase()} (desde ${new Date(r.created_at).toLocaleString('pt-BR')})`);
      });
    } else {
      console.log('   ⚠️  Nenhuma role encontrada!');
    }

    // 4. Verificar permissões
    if (roles && roles.length > 0) {
      console.log('\n🔐 Permissões:');
      const roleNames = roles.map(r => r.role);

      const { data: permissions, error: permError } = await supabase
        .from('role_permissions')
        .select('*')
        .in('role', roleNames);

      if (permError) {
        console.error('❌ Erro ao buscar permissões:', permError.message);
      } else {
        const grouped = {};
        permissions.forEach(p => {
          if (!grouped[p.category]) {
            grouped[p.category] = [];
          }
          grouped[p.category].push(`${p.permission_name}: ${p.permission_level}`);
        });

        Object.keys(grouped).forEach(category => {
          console.log(`\n   📁 ${category}:`);
          grouped[category].forEach(perm => {
            console.log(`      • ${perm}`);
          });
        });
      }
    }

    console.log('\n✅ Verificação completa!');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  }
}

// Executar
const email = process.argv[2] || 'legolas@dinamopro.com';
checkUserRole(email)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
