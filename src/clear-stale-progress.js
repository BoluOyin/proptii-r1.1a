// Script to clear stale progress data
// Run this in the browser console to clear cached progress and force recalculation

console.log('🧹 Clearing stale progress data...');

// Clear all progress-related cached data
const keysToClear = [
  'proptii_progress_default-user',
  'proptii_dashboard_progress_default-user'
];

keysToClear.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`🗑️ Cleared: ${key}`);
  }
});

console.log('✅ Stale progress data cleared. Progress will be recalculated on next dashboard load.'); 