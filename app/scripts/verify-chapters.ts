import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config';

async function main() {
  console.log('🔍 Vérification des chapitres dans la base de données...\n');

  const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

  // Get all books with chapter counts
  const { data: books, error: booksError } = await supabase
    .from('books')
    .select('id, title, author, total_chapters')
    .order('title');

  if (booksError || !books) {
    console.error('❌ Erreur:', booksError?.message);
    return;
  }

  console.log('📚 Livres dans la base de données:\n');
  console.log('─'.repeat(80));

  let totalChaptersExpected = 0;
  let totalChaptersActual = 0;

  for (const book of books) {
    const { count } = await supabase
      .from('book_chapters')
      .select('*', { count: 'exact', head: true })
      .eq('book_id', book.id);

    const chaptersCount = count || 0;
    const status = chaptersCount === book.total_chapters ? '✅' : '⚠️';

    console.log(`${status} ${book.title} par ${book.author}`);
    console.log(`   Chapitres: ${chaptersCount}/${book.total_chapters}`);

    totalChaptersExpected += book.total_chapters;
    totalChaptersActual += chaptersCount;

    if (chaptersCount > 0 && chaptersCount === book.total_chapters) {
      // Get a sample chapter to show content
      const { data: sample } = await supabase
        .from('book_chapters')
        .select('title, word_count, page_count')
        .eq('book_id', book.id)
        .eq('chapter_number', 1)
        .single();

      if (sample) {
        console.log(`   Premier chapitre: "${sample.title}"`);
        console.log(`   Mots: ${sample.word_count} | Pages: ${sample.page_count}`);
      }
    }
    console.log('');
  }

  console.log('─'.repeat(80));
  console.log(`\n📊 Total: ${totalChaptersActual}/${totalChaptersExpected} chapitres`);

  if (totalChaptersActual === totalChaptersExpected) {
    console.log('✅ Tous les chapitres sont présents!\n');
  } else {
    console.log(`⚠️  Il manque ${totalChaptersExpected - totalChaptersActual} chapitres\n`);
  }
}

main().catch(console.error);
