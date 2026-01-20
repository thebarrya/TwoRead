import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config';

async function checkBooks() {
  console.log('🔍 Vérification de la connexion Supabase et des livres...\n');

  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.key) {
    console.error('❌ Configuration Supabase manquante. Vérifiez vos variables d\'environnement.');
    console.error('   Variables requises: SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY');
    return;
  }

  const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

  try {
    // Test de connexion basique
    console.log('📡 Test de connexion...');
    const { data: testData, error: testError } = await supabase
      .from('books')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Erreur de connexion:', testError.message);
      return;
    }

    console.log('✅ Connexion réussie!\n');

    // Compter tous les livres
    const { count: totalBooks, error: countError } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Erreur lors du comptage:', countError.message);
      return;
    }

    console.log(`📚 Total de livres dans la base: ${totalBooks || 0}\n`);

    // Compter les livres français
    const { count: frenchBooks, error: frError } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true })
      .eq('language', 'fr');

    if (frError) {
      console.error('❌ Erreur lors du comptage des livres français:', frError.message);
      return;
    }

    console.log(`🇫🇷 Livres en français: ${frenchBooks || 0}\n`);

    // Récupérer quelques livres pour exemple
    const { data: sampleBooks, error: sampleError } = await supabase
      .from('books')
      .select('id, title, author, language, total_chapters, is_featured')
      .limit(5);

    if (sampleError) {
      console.error('❌ Erreur lors de la récupération des exemples:', sampleError.message);
      return;
    }

    if (sampleBooks && sampleBooks.length > 0) {
      console.log('📖 Exemples de livres:');
      sampleBooks.forEach((book, i) => {
        console.log(`${i + 1}. ${book.title} par ${book.author}`);
        console.log(`   - Langue: ${book.language} | Chapitres: ${book.total_chapters} | Vedette: ${book.is_featured ? 'Oui' : 'Non'}`);
      });
    } else {
      console.log('⚠️  Aucun livre trouvé dans la base de données');
      console.log('\n💡 Solution: Vous devez ajouter des livres à la table "books" dans Supabase');
    }

  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

checkBooks();
