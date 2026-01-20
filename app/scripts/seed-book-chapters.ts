import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG, CONTENT_CONFIG } from './config';
import { ContentGenerator, randomBetween } from './content-generator';

interface Book {
  id: string;
  title: string;
  author: string;
  difficulty: 'easy' | 'medium' | 'hard';
  total_chapters: number;
  cover_image: string;
}

interface ChapterData {
  book_id: string;
  chapter_number: number;
  title: string;
  content: string;
  word_count: number;
  page_count: number;
}

async function main() {
  console.log('🌱 Début du seeding des chapitres...\n');

  const args = process.argv.slice(2);
  const forceMode = args.includes('--force');
  const limitMatch = args.find(arg => arg.startsWith('--limit='));
  const limit = limitMatch ? parseInt(limitMatch.split('=')[1]) : undefined;
  const bookIdMatch = args.find(arg => arg.startsWith('--book-id='));
  const bookId = bookIdMatch ? bookIdMatch.split('=')[1] : undefined;

  console.log('Options:');
  console.log(`  Force mode: ${forceMode ? 'ON' : 'OFF'}`);
  console.log(`  Limit: ${limit || 'NONE'}`);
  console.log(`  Book ID: ${bookId || 'ALL'}\n`);

  const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
  const generator = new ContentGenerator();

  let query = supabase.from('books').select('*').order('title');

  if (bookId) {
    query = query.eq('id', bookId);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data: books, error } = await query;

  if (error) {
    console.error('❌ Erreur lors de la récupération des livres:', error.message);
    return;
  }

  if (!books || books.length === 0) {
    console.log('⚠️  Aucun livre trouvé dans la base de données');
    return;
  }

  console.log(`📚 ${books.length} livre(s) trouvé(s)\n`);

  let totalChaptersInserted = 0;

  for (const book of books as Book[]) {
    console.log(`\n📖 Traitement: ${book.title} par ${book.author}`);
    console.log(`   Difficulté: ${book.difficulty} | Chapitres: ${book.total_chapters}`);

    const { data: existing } = await supabase
      .from('book_chapters')
      .select('id')
      .eq('book_id', book.id)
      .limit(1);

    if (existing && existing.length > 0) {
      if (forceMode) {
        console.log('   🗑️  Suppression des chapitres existants...');
        const { error: deleteError } = await supabase
          .from('book_chapters')
          .delete()
          .eq('book_id', book.id);

        if (deleteError) {
          console.error('   ❌ Erreur lors de la suppression:', deleteError.message);
          continue;
        }
      } else {
        console.log('   ⏭️  Chapitres déjà présents, skip (utilisez --force pour réinitialiser)');
        continue;
      }
    }

    const chapters: ChapterData[] = [];
    let insertedCount = 0;

    for (let i = 1; i <= book.total_chapters; i++) {
      const title = generator.generateChapterTitle(book.title, i);
      const targetWords = randomBetween(
        CONTENT_CONFIG.minWordsPerChapter,
        CONTENT_CONFIG.maxWordsPerChapter
      );
      const content = generator.generateChapterContent(book.difficulty, targetWords);
      const wordCount = generator.calculateWordCount(content);
      const pageCount = generator.estimatePageCount(wordCount);

      chapters.push({
        book_id: book.id,
        chapter_number: i,
        title,
        content,
        word_count: wordCount,
        page_count: pageCount,
      });

      if (chapters.length === CONTENT_CONFIG.batchSize || i === book.total_chapters) {
        const { error: insertError } = await supabase
          .from('book_chapters')
          .insert(chapters);

        if (insertError) {
          console.error(`   ❌ Erreur chapitre ${i}:`, insertError.message);
        } else {
          insertedCount += chapters.length;
          const rangeStart = i - chapters.length + 1;
          console.log(`   ✅ Chapitres ${rangeStart}-${i} insérés (${chapters.length} chapitres)`);
        }

        chapters.length = 0;
      }
    }

    totalChaptersInserted += insertedCount;
    console.log(`   📊 Total pour ce livre: ${insertedCount}/${book.total_chapters} chapitres`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✨ Seeding terminé avec succès!`);
  console.log(`📊 Total: ${totalChaptersInserted} chapitres insérés pour ${books.length} livre(s)`);
  console.log('='.repeat(60) + '\n');
}

main().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
