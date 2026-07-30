// ============================================================
// SUPABASE CONFIG - Single Source of Truth
// ============================================================
const SUPABASE_CONFIG = {
  url: 'https://meclpcxdlyybjbmhfxru.supabase.co',
  anonKey: 'sb_publishable_GJl4nv43kFDxc_PzAo90qg_zbXMmTiT'
};

// Ekspor untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SUPABASE_CONFIG;
}
