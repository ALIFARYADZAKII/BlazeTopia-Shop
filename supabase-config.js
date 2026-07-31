// ============================================================
// SUPABASE CONFIG - Single Source of Truth
// ============================================================
  const SUPABASE_CONFIG = {
  url: 'https://tiloslwfdfepcofmtros.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpbG9zbHdmZGZlcGNvZm10cm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0NDI2NjYsImV4cCI6MjEwMTAxODY2Nn0.oCySVoTjzcLb7EtYs9cLntNdZLCIxoq2IiAR5gILJ_w'
};

// Ekspor untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SUPABASE_CONFIG;
}
