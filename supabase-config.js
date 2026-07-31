// ============================================================
// SUPABASE CONFIG - Single Source of Truth
// ============================================================
  const SUPABASE_CONFIG = {
  url: 'https://fcprtymqtdhfafprdkze.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcHJ0eW1xdGRoZmFmcHJka3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0ODg0NDAsImV4cCI6MjEwMTA2NDQ0MH0.g54qhjxZ7Ce9qdk_WDKeDy4SqxlSc4IZHHfy3uW8Rg8'
};

// Ekspor untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SUPABASE_CONFIG;
}
