import { useState, useEffect } from 'react';
import { dashboardService, DashboardSummary, SavedProperty, PropertyViewing, ReferencingApplication, Contract, UserFile } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [viewings, setViewings] = useState<PropertyViewing[]>([]);
  const [upcomingViewings, setUpcomingViewings] = useState<PropertyViewing[]>([]);
  const [files, setFiles] = useState<UserFile[]>([]);
  
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get user ID for dashboard data
        let userId = user?.id || user?.email || 'default-user';
        
        // If we're using default-user, try to find the actual user ID from localStorage
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
              userId = match[1];
              console.log('🔍 DashboardData: Found actual user ID:', userId);
            }
          }
        }
        
        // Fetch dashboard summary with user ID
        const summaryResponse = await dashboardService.getDashboardSummary(userId);
        if (summaryResponse.success && summaryResponse.data) {
          setDashboardSummary(summaryResponse.data);
        } else {
          setError(summaryResponse.error || 'Failed to load dashboard summary');
        }

        // Fetch other data
        const [viewingsResponse, filesResponse] = await Promise.all([
          dashboardService.getViewings(),
          dashboardService.getUserFiles()
        ]);

        if (viewingsResponse.success && viewingsResponse.data) {
          setViewings(viewingsResponse.data);
          // Filter upcoming viewings
          const upcoming = viewingsResponse.data.filter(viewing => 
            new Date(viewing.scheduledDate) > new Date()
          );
          setUpcomingViewings(upcoming);
        }

        if (filesResponse.success && filesResponse.data) {
          setFiles(filesResponse.data);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return {
    isLoading,
    error,
    dashboardSummary,
    viewings,
    upcomingViewings,
    files
  };
}; 