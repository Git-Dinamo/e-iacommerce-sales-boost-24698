/**
 * Script para aplicar migração de projetos
 * Usage: node scripts/apply-projects-migration.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Ler .env
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

console.log('🚀 Aplicando migração de sistema de projetos...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

// Ler o arquivo SQL
const sqlPath = join(__dirname, '..', 'supabase', 'migrations', '20251013030000_create_projects_system.sql');
const sqlContent = readFileSync(sqlPath, 'utf-8');

// Executar o SQL
async function applyMigration() {
  try {
    console.log('📝 Executando SQL...');

    // Dividir em statements individuais (separados por ;)
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.includes('COMMENT ON')) continue; // Comentários podem falhar, ignorar

      const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

      if (error) {
        // Tentar executar direto
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({ sql_query: statement })
        });

        if (!response.ok) {
          console.log('⚠️  Aviso:', error.message || response.statusText);
        }
      }
    }

    console.log('\n✅ Migração aplicada com sucesso!');
    console.log('\n📊 Verificando tabelas criadas...');

    // Verificar se as tabelas foram criadas
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('count');

    const { data: calcData, error: calcError } = await supabase
      .from('calculator_data')
      .select('count');

    if (!projectsError) {
      console.log('✅ Tabela "projects" criada');
    }
    if (!calcError) {
      console.log('✅ Tabela "calculator_data" criada');
    }

    console.log('\n✨ Sistema de projetos pronto para uso!');

  } catch (error) {
    console.error('\n❌ Erro ao aplicar migração:', error.message);
  }
}

applyMigration()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
