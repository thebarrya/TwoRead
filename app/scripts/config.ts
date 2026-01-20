export const SUPABASE_CONFIG = {
  url: process.env.SUPABASE_URL || 'https://cuzxuckeixsvommxfodz.supabase.co',
  // Use service_role key for seeding to bypass RLS policies
  key: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1enh1Y2tlaXhzdm9tbXhmb2R6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYzOTM2MSwiZXhwIjoyMDg0MjE1MzYxfQ.mg5knGcG2kXeLE6gN2q_NnKkaW7iWBc-IE_81Qio_BE',
};

export const CONTENT_CONFIG = {
  minWordsPerChapter: 2000,
  maxWordsPerChapter: 4000,
  wordsPerPage: 250,
  batchSize: 10,
};
