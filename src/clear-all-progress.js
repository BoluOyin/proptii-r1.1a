// Script to clear all progress data and force fresh calculation
// Run this in the browser console to fix the user ID mismatch issue

console.log('🧹 Clearing all progress data to fix user ID mismatch...');

// Get all localStorage keys
const allKeys = Object.keys(localStorage);

// Find all progress-related keys
const progressKeys = allKeys.filter(key => 
  key.includes('progress_') || 
  key.includes('dashboard_progress_')
);

console.log('Found progress keys to clear:', progressKeys);

// Clear all progress data
progressKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`🗑️ Cleared: ${key}`);
});

// Also clear any cached progress data
const cachedKeys = allKeys.filter(key => 
  key.includes('proptii_progress_') || 
  key.includes('proptii_dashboard_progress_')
);

cachedKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`🗑️ Cleared cached: ${key}`);
});

console.log('✅ All progress data cleared. Progress will be recalculated from form data on next dashboard load.');

// Check what form data exists
const formDataKeys = allKeys.filter(key => 
  key.includes('referencing_') && 
  key.includes('_formData')
);

console.log('📋 Form data keys found:', formDataKeys);

if (formDataKeys.length > 0) {
  console.log('📊 Form data will be used to recalculate progress on next dashboard load.');
} else {
  console.log('⚠️ No form data found. Progress will remain at 0.');
} 