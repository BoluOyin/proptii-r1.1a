// Simple test script to verify progress tracking
// Run this in the browser console to test the progress tracking service

// Mock form data that should be found by the progress tracking service
const mockFormData = {
  identity: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '1234567890',
    dateOfBirth: '1990-01-01',
    isBritish: true,
    nationality: 'British'
  },
  employment: {
    employmentStatus: 'employed',
    companyDetails: 'Test Company',
    lengthOfEmployment: '2 years',
    jobPosition: 'Developer',
    referenceFullName: 'Jane Smith',
    referenceEmail: 'jane.smith@company.com',
    referencePhone: '0987654321'
  },
  residential: {
    currentAddress: '123 Test Street',
    durationAtCurrentAddress: '1 year'
  },
  financial: {
    monthlyIncome: '3000',
    proofOfIncomeType: 'payslip'
  },
  guarantor: {
    fullName: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    address: '456 Guarantor Street'
  },
  creditCheck: {
    hasAgreedToCheck: true
  }
};

// Save the mock data to localStorage using the same key format as ReferencingContext
const userId = 'test-user-123';
const propertyId = 'test-property-456';

// Save using the progress key format
localStorage.setItem(`proptii_progress_${userId}`, JSON.stringify(mockFormData));

// Save using the form key format
localStorage.setItem(`proptii_form_${propertyId}`, JSON.stringify(mockFormData));

console.log('Test data saved to localStorage');
console.log('Keys saved:', [
  `proptii_progress_${userId}`,
  `proptii_form_${propertyId}`
]);

// Test the progress tracking service
// Note: This would need to be run in the actual app context where the service is available
console.log('To test the progress tracking service, run this in the app context:');
console.log('const progress = progressTrackingService.getProgress("test-user-123", "test-property-456");');
console.log('console.log(progress);'); 