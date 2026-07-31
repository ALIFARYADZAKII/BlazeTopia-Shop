// ============================================================
// SUPABASE CONFIG - Single Source of Truth
// ============================================================
const SUPABASE_CONFIG = {
  url: 'https://tiloslwfdfepcofmtros.supabase.co',
  anonKey: 'sb_publishable_jwyhKRP2UMZzFm9lECA-eA_tN362lyl'
};

// Ekspor untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SUPABASE_CONFIG;
}
