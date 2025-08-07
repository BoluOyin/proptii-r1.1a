import { useEffect, useCallback } from 'react';
import { progressTrackingService } from '../services/progressTrackingService';
import { saveToLocalStorage } from '../utils/localStorage';

/**
 * Hook to sync referencing progress with dashboard
 * This ensures the dashboard shows real-time progress updates
 */
export const useProgressSync = (userId: string, propertyId?: string) => {
  
  // Function to update progress in localStorage
  const updateProgress = useCallback(() => {
    try {
      // Get the actual user ID if we're using default-user
      let actualUserId = userId;
      if (userId === 'default-user') {
        const allKeys = Object.keys(localStorage);
        const referencingKeys = allKeys.filter(key => 
          key.includes('referencing_') && 
          key.includes('_formData') &&
          !key.includes('default-user')
        );
        
        if (referencingKeys.length > 0) {
          const firstKey = referencingKeys[0];
          const match = firstKey.match(/referencing_(.+?)_formData/);
          if (match && match[1]) {
            actualUserId = match[1];
            console.log('🔍 ProgressSync: Found actual user ID:', actualUserId);
          }
        }
      }
      
      const progressData = progressTrackingService.getProgress(actualUserId, propertyId);
      const progressKey = `progress_${actualUserId}`;
      saveToLocalStorage(progressKey, progressData);
      
      // Also save to a dashboard-specific key for immediate updates
      const dashboardKey = `dashboard_progress_${actualUserId}`;
      saveToLocalStorage(dashboardKey, {
        ...progressData,
        lastUpdated: Date.now()
      });
      
      console.log('Progress updated for user:', actualUserId, progressData);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, [userId, propertyId]);
  
  // Update progress on mount
  useEffect(() => {
    updateProgress();
  }, [updateProgress]);
  
  // Set up interval to check for progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      updateProgress();
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [updateProgress]);
  
  return {
    updateProgress
  };
}; 