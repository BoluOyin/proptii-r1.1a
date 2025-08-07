// Debug script to check localStorage contents
// Run this in the browser console

console.log('🔍 Debugging localStorage contents...');

// Get all localStorage keys
const allKeys = Object.keys(localStorage);
console.log('All localStorage keys:', allKeys);

// Look for referencing-related keys
const referencingKeys = allKeys.filter(key => 
  key.includes('referencing') || 
  key.includes('progress') || 
  key.includes('form') || 
  key.includes('application') ||
  key.includes('property')
);

console.log('Referencing-related keys:', referencingKeys);

// Check each referencing key
referencingKeys.forEach(key => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    console.log(`📦 Key: ${key}`);
    console.log('   Value:', value);
    
    // Check if it's FormData or ProgressData
    if (value && typeof value === 'object') {
      if ('progress' in value && 'sections' in value) {
        console.log('   Type: ProgressData');
        console.log('   Progress:', value.progress);
        console.log('   Status:', value.status);
      } else if ('identity' in value || 'employment' in value) {
        console.log('   Type: FormData');
        console.log('   Has identity:', !!value.identity);
        console.log('   Has employment:', !!value.employment);
        console.log('   Has residential:', !!value.residential);
        console.log('   Has financial:', !!value.financial);
        console.log('   Has guarantor:', !!value.guarantor);
        console.log('   Has creditCheck:', !!value.creditCheck);
      } else {
        console.log('   Type: Unknown');
      }
    }
    console.log('---');
  } catch (error) {
    console.log(`❌ Error parsing key ${key}:`, error);
  }
});

// Check for current user ID
const currentUserId = localStorage.getItem('currentUserId');
console.log('Current user ID:', currentUserId);

// Check for property ID
const propertyId = localStorage.getItem('currentPropertyId') || 'default';
console.log('Property ID:', propertyId); 