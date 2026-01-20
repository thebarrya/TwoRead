// Configuration Supabase pour les scripts serveur
// Utilise les variables d'environnement ou des valeurs par défaut pour le développement local
export const SUPABASE_CONFIG = {
  url: process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://cuzxuckeixsvommxfodz.supabase.co',
  // Use service_role key for seeding to bypass RLS policies
  // IMPORTANT: Ne jamais exposer cette clé dans le code client
  key: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};

// Validation pour les scripts qui nécessitent la service_role key
if (!SUPABASE_CONFIG.key && process.env.NODE_ENV !== 'test') {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY non définie. Certains scripts peuvent ne pas fonctionner.');
}

export const CONTENT_CONFIG = {
  minWordsPerChapter: 2000,
  maxWordsPerChapter: 4000,
  wordsPerPage: 250,
  batchSize: 10,
};
