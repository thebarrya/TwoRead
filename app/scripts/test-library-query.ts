import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config';

async function testLibraryQuery() {
  console.log('🧪 Test de la requête exacte utilisée dans library.tsx\n');

  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.key) {
    console.error('❌ Configuration Supabase manquante. Vérifiez vos variables d\'environnement.');
    console.error('   Variables requises: SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY');
    return;
  }

  const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

  try {
    console.log('📡 Exécution de la requête...');
    console.time('Query duration');

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('language', 'fr')
      .order('is_featured', { ascending: false })
      .order('title');

    console.timeEnd('Query duration');

    if (error) {
      console.error('❌ Erreur:', error);
      console.error('   Message:', error.message);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);
      console.error('   Code:', error.code);
      return;
    }

    console.log('\n✅ Requête réussie!');
    console.log(`📚 Nombre de livres retournés: ${data?.length || 0}\n`);

    if (data && data.length > 0) {
      console.log('📖 Premiers livres:');
      data.slice(0, 3).forEach((book: any, i: number) => {
        console.log(`${i + 1}. ${book.title}`);
        console.log(`   Auteur: ${book.author || 'N/A'}`);
        console.log(`   Langue: ${book.language}`);
        console.log(`   Vedette: ${book.is_featured ? 'Oui' : 'Non'}`);
        console.log(`   Chapitres: ${book.total_chapters}`);
        console.log(`   ID: ${book.id}\n`);
      });
    }

  } catch (error) {
    console.error('❌ Exception:', error);
  }
}

testLibraryQuery();
