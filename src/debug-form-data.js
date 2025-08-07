// Debug script to show form data for each section
// Run this in the browser console to see what data is stored

console.log('🔍 Debugging form data for each section...');

// Get all localStorage keys
const allKeys = Object.keys(localStorage);

// Look for form data keys
const formDataKeys = allKeys.filter(key => 
  key.includes('referencing_') && 
  key.includes('_formData')
);

console.log('Form data keys found:', formDataKeys);

// Check each form data key
formDataKeys.forEach(key => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    console.log(`\n📦 Form Data Key: ${key}`);
    
    if (value && typeof value === 'object') {
      // Check each section
      const sections = ['identity', 'employment', 'residential', 'financial', 'guarantor', 'creditCheck'];
      
      sections.forEach(section => {
        const sectionData = value[section];
        console.log(`\n  📋 Section: ${section}`);
        
        if (sectionData) {
          console.log('    Data:', sectionData);
          
          // Check which fields are filled
          const filledFields = Object.entries(sectionData)
            .filter(([key, val]) => val !== null && val !== undefined && val !== '')
            .map(([key, val]) => key);
          
          console.log('    Filled fields:', filledFields);
          console.log('    Empty fields:', Object.keys(sectionData).filter(key => !filledFields.includes(key)));
        } else {
          console.log('    No data for this section');
        }
      });
    } else {
      console.log('    Invalid data format');
    }
  } catch (error) {
    console.log(`    Error parsing data: ${error.message}`);
  }
});

// Also check progress data
const progressKeys = allKeys.filter(key => 
  key.includes('progress_') || 
  key.includes('dashboard_progress_')
);

console.log('\n📊 Progress keys found:', progressKeys);

progressKeys.forEach(key => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    console.log(`\n📈 Progress Key: ${key}`);
    console.log('   Value:', value);
  } catch (error) {
    console.log(`   Error parsing progress data: ${error.message}`);
  }
}); 