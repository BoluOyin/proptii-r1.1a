import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { progressTrackingService } from '../../services/progressTrackingService';
import { useReferencing } from './context/ReferencingContext';

/**
 * Test component to verify progress tracking is working
 * This can be used to test the progress tracking functionality
 */
const ProgressTest: React.FC = () => {
  const { state } = useReferencing();
  const [progressData, setProgressData] = useState<any>(null);
  
  const userId = localStorage.getItem('currentUserId') || 'default-user';
  
  const updateProgress = () => {
    const progress = progressTrackingService.calculateProgress(state.formData);
    setProgressData(progress);
    console.log('Current progress:', progress);
  };
  
  useEffect(() => {
    updateProgress();
  }, [state.formData]);
  
  const testProgressUpdate = () => {
    // Simulate filling out identity section
    const testFormData = {
      ...state.formData,
      identity: {
        ...state.formData.identity,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        dateOfBirth: '1990-01-01'
      }
    };
    
    const progress = progressTrackingService.calculateProgress(testFormData);
    setProgressData(progress);
    console.log('Test progress:', progress);
  };
  
  return (
    <Paper sx={{ p: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Progress Tracking Test
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={updateProgress} sx={{ mr: 1 }}>
          Update Progress
        </Button>
        <Button variant="outlined" onClick={testProgressUpdate}>
          Test Progress
        </Button>
      </Box>
      
      {progressData && (
        <Box>
          <Typography variant="body2" gutterBottom>
            <strong>Current Step:</strong> {progressData.currentStep}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Completed Steps:</strong> {progressData.completedSteps} / {progressData.totalSteps}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Progress:</strong> {progressData.progress}%
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Status:</strong> {progressData.status}
          </Typography>
          
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Section Status:
          </Typography>
          {Object.entries(progressData.sections).map(([section, completed]) => (
            <Typography key={section} variant="body2" color={completed ? 'success.main' : 'text.secondary'}>
              {section}: {completed ? '✓ Complete' : '○ Incomplete'}
            </Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default ProgressTest; 