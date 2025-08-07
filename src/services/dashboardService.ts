import { ApiResponse } from './api';
import {
  DashboardSummary,
  SavedProperty,
  PropertyViewing,
  ReferencingApplication,
  Contract,
  UserFile,
  mockGetDashboardSummary,
  mockGetSavedProperties,
  mockGetViewings,
  mockGetReferencingApplications,
  mockGetContracts,
  mockGetUserFiles
} from '../mocks/dashboardApi';
import { progressTrackingService } from './progressTrackingService';

// Use environment variable to determine if we're using mock data
const USE_MOCK_DATA = true; // In production, this would be process.env.REACT_APP_USE_MOCK_DATA === 'true'

// Dashboard Service Interface
export interface DashboardServiceInterface {
  getDashboardSummary(userId?: string): Promise<ApiResponse<DashboardSummary>>;
  getSavedProperties(): Promise<ApiResponse<SavedProperty[]>>;
  getViewings(): Promise<ApiResponse<PropertyViewing[]>>;
  getReferencingApplications(): Promise<ApiResponse<ReferencingApplication[]>>;
  getContracts(): Promise<ApiResponse<Contract[]>>;
  getUserFiles(): Promise<ApiResponse<UserFile[]>>;
}

// Implementation using mock data for testing
class MockDashboardService implements DashboardServiceInterface {
  async getDashboardSummary(userId?: string): Promise<ApiResponse<DashboardSummary>> {
    try {
      // Get the mock data first
      const mockResponse = await mockGetDashboardSummary();
      
      if (!mockResponse.success || !mockResponse.data) {
        return mockResponse;
      }
      
      // Get current user ID - use provided userId or try to get from localStorage
      let currentUserId = userId || localStorage.getItem('currentUserId') || 'default-user';
      
      // If we're still using default-user, try to find the actual user ID from localStorage
      if (currentUserId === 'default-user') {
        // Look for any referencing keys that contain a real user ID
        const allKeys = Object.keys(localStorage);
        const referencingKeys = allKeys.filter(key => 
          key.includes('referencing_') && 
          key.includes('_formData') &&
          !key.includes('default-user')
        );
        
        if (referencingKeys.length > 0) {
          // Extract user ID from the first referencing key
          const firstKey = referencingKeys[0];
          const match = firstKey.match(/referencing_(.+?)_formData/);
          if (match && match[1]) {
            currentUserId = match[1];
            console.log('🔍 Dashboard: Found actual user ID from localStorage:', currentUserId);
          }
        }
      }
      
      // Get real progress from localStorage using the same key format as ReferencingModal
      const progressData = progressTrackingService.getProgress(currentUserId);
      
      console.log('📊 Dashboard: Retrieved progress data for user:', currentUserId, progressData);
      console.log('🔍 Dashboard: Progress data details:', {
        status: progressData.status,
        progress: progressData.progress,
        completedSteps: progressData.completedSteps,
        totalSteps: progressData.totalSteps,
        sections: progressData.sections
      });
      
      // If progress is 0 but we have form data, clear the cache to force recalculation
      if (progressData.progress === 0) {
        const allKeys = Object.keys(localStorage);
        const hasFormData = allKeys.some(key => 
          key.includes('referencing_') && 
          key.includes('_formData')
        );
        
        if (hasFormData) {
          console.log('🔄 Dashboard: Progress is 0 but form data exists, clearing cache to force recalculation');
          // Clear the cached progress to force recalculation
          localStorage.removeItem(`proptii_progress_${currentUserId}`);
          localStorage.removeItem(`proptii_dashboard_progress_${currentUserId}`);
          
          // Get fresh progress data
          const freshProgressData = progressTrackingService.getProgress(currentUserId);
          console.log('📊 Dashboard: Fresh progress data:', freshProgressData);
          
          // Update the response with fresh data
          mockResponse.data.referencing = {
            ...mockResponse.data.referencing,
            status: freshProgressData.status,
            progress: freshProgressData.progress,
            completedSteps: freshProgressData.completedSteps,
            totalSteps: freshProgressData.totalSteps,
            identity: freshProgressData.sections.identity,
            employment: freshProgressData.sections.employment,
            residential: freshProgressData.sections.residential,
            financial: freshProgressData.sections.financial,
            guarantor: freshProgressData.sections.guarantor,
            creditCheck: freshProgressData.sections.creditCheck
          };
          
          return mockResponse;
        }
      }
      
      // Update the mock data with real progress
      const updatedData: DashboardSummary = {
        ...mockResponse.data,
        referencing: {
          ...mockResponse.data.referencing,
          status: progressData.status,
          progress: progressData.progress,
          completedSteps: progressData.completedSteps,
          totalSteps: progressData.totalSteps,
          identity: progressData.sections.identity,
          employment: progressData.sections.employment,
          residential: progressData.sections.residential,
          financial: progressData.sections.financial,
          guarantor: progressData.sections.guarantor,
          creditCheck: progressData.sections.creditCheck
        }
      };
      
      return {
        success: true,
        data: updatedData
      };
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      return mockGetDashboardSummary();
    }
  }

  getSavedProperties(): Promise<ApiResponse<SavedProperty[]>> {
    return mockGetSavedProperties();
  }

  getViewings(): Promise<ApiResponse<PropertyViewing[]>> {
    return mockGetViewings();
  }

  getReferencingApplications(): Promise<ApiResponse<ReferencingApplication[]>> {
    return mockGetReferencingApplications();
  }

  getContracts(): Promise<ApiResponse<Contract[]>> {
    return mockGetContracts();
  }

  getUserFiles(): Promise<ApiResponse<UserFile[]>> {
    return mockGetUserFiles();
  }
}

// Real API implementation (to be replaced with actual API calls)
class RealDashboardService implements DashboardServiceInterface {
  async getDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
    // TODO: Replace with actual API call
    console.log('Using real API for getDashboardSummary');
    return { success: false, error: 'Real API not implemented yet' };
  }

  async getSavedProperties(): Promise<ApiResponse<SavedProperty[]>> {
    // TODO: Replace with actual API call
    console.log('Using real API for getSavedProperties');
    return { success: false, error: 'Real API not implemented yet' };
  }

  async getViewings(): Promise<ApiResponse<PropertyViewing[]>> {
    // TODO: Replace with actual API call
    console.log('Using real API for getViewings');
    return { success: false, error: 'Real API not implemented yet' };
  }

  async getReferencingApplications(): Promise<ApiResponse<ReferencingApplication[]>> {
    // TODO: Replace with actual API call
    console.log('Using real API for getReferencingApplications');
    return { success: false, error: 'Real API not implemented yet' };
  }

  async getContracts(): Promise<ApiResponse<Contract[]>> {
    // TODO: Replace with actual API call
    console.log('Using real API for getContracts');
    return { success: false, error: 'Real API not implemented yet' };
  }

  async getUserFiles(): Promise<ApiResponse<UserFile[]>> {
    // TODO: Replace with actual API call
    console.log('Using real API for getUserFiles');
    return { success: false, error: 'Real API not implemented yet' };
  }
}

// Factory function to create the appropriate dashboard service based on configuration
export const createDashboardService = (): DashboardServiceInterface => {
  return USE_MOCK_DATA 
    ? new MockDashboardService() 
    : new RealDashboardService();
};

// Export default instance for easy use
export const dashboardService = createDashboardService();

// Export type interfaces
export type {
  DashboardSummary,
  SavedProperty,
  PropertyViewing,
  ReferencingApplication,
  Contract,
  UserFile
}; 