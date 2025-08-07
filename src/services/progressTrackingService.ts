import { FormData, FormSection } from '../types/referencing';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

export interface ProgressData {
  currentStep: number;
  completedSteps: number;
  totalSteps: number;
  progress: number;
  sections: {
    identity: boolean;
    employment: boolean;
    residential: boolean;
    financial: boolean;
    guarantor: boolean;
    creditCheck: boolean;
  };
  status: 'not_started' | 'in_progress' | 'completed';
  lastUpdated: number;
}

export interface ProgressTrackingService {
  getProgress(userId: string, propertyId?: string): ProgressData;
  calculateProgress(formData: FormData): ProgressData;
  isSectionComplete(section: FormSection, formData: FormData): boolean;
  getCurrentStep(formData: FormData): number;
}

class ProgressTrackingServiceImpl implements ProgressTrackingService {
  
  /**
   * Get progress data for a user's referencing application
   */
  getProgress(userId: string, propertyId?: string): ProgressData {
    // First, try to get the cached progress data
    const progressKey = `progress_${userId}`;
    const cachedProgress = loadFromLocalStorage<ProgressData>(progressKey, 'proptii_');
    
    if (cachedProgress && 'progress' in cachedProgress && 'sections' in cachedProgress) {
      console.log('📊 ProgressService: Found cached progress data for user:', userId, cachedProgress);
      return cachedProgress;
    }
    
    // If no cached progress for this user, try to find any referencing form data
    // This handles the case where the dashboard user ID doesn't match the form user ID
    const allKeys = Object.keys(localStorage);
    const formDataKeys = allKeys.filter(key => 
      key.includes('referencing_') && 
      key.includes('_formData')
    );
    
    if (formDataKeys.length > 0) {
      // Use the first form data we find (most recent)
      const formDataKey = formDataKeys[0];
      const formData = loadFromLocalStorage<FormData>(formDataKey, '');
      
      if (formData) {
        console.log('📊 ProgressService: Found form data using key:', formDataKey, 'for user:', userId);
        
        // Calculate progress from the found form data
        const calculatedProgress = this.calculateProgress(formData);
        
        // Cache the calculated progress for the requested user
        saveToLocalStorage(progressKey, calculatedProgress);
        
        return calculatedProgress;
      }
    }
    
    // If no cached progress, try to find form data and calculate progress
    const possibleFormKeys = [
      // Format used by ReferencingContext when saving form data
      `form_${propertyId || 'default'}`,
      // Format used by useLocalStorage hook
      `application_${userId}`,
      `property_${propertyId || 'default'}_draft`,
      // Legacy format
      `referencing_${userId}_formData`
    ];
    
    let formData: FormData | null = null;
    let foundKey = '';
    
    // Try each possible key format for form data
    for (const key of possibleFormKeys) {
      // Try with proptii_ prefix first
      formData = loadFromLocalStorage<FormData>(key, 'proptii_');
      if (formData) {
        foundKey = `proptii_${key}`;
        break;
      }
      
      // Try without prefix
      formData = loadFromLocalStorage<FormData>(key, '');
      if (formData) {
        foundKey = key;
        break;
      }
    }
    
    if (formData) {
      console.log('📊 ProgressService: Found form data for user:', userId, 'using key:', foundKey, formData);
      
      // Check if this is already a ProgressData object (which would be wrong)
      if ('progress' in formData && 'sections' in formData && 'status' in formData) {
        console.log('⚠️ ProgressService: Found ProgressData instead of FormData, this is wrong!');
        return formData as ProgressData;
      }
      
      // This should be FormData, calculate progress from it
      const calculatedProgress = this.calculateProgress(formData);
      
      // Cache the calculated progress
      saveToLocalStorage(progressKey, calculatedProgress);
      
      return calculatedProgress;
    }
    
    console.log('📊 ProgressService: No form data found for user:', userId, 'tried keys:', possibleFormKeys);
    
    // Return default progress if no data found
    return {
      currentStep: 0,
      completedSteps: 0,
      totalSteps: 6,
      progress: 0,
      sections: {
        identity: false,
        employment: false,
        residential: false,
        financial: false,
        guarantor: false,
        creditCheck: false
      },
      status: 'not_started',
      lastUpdated: Date.now()
    };
  }
  
  /**
   * Calculate progress based on form data
   */
  calculateProgress(formData: FormData): ProgressData {
    const sections = ['identity', 'employment', 'residential', 'financial', 'guarantor', 'creditCheck'] as const;
    
    console.log('📊 ProgressService: Calculating progress for form data:', formData);
    
    const sectionStatus = {
      identity: this.isSectionComplete('identity', formData),
      employment: this.isSectionComplete('employment', formData),
      residential: this.isSectionComplete('residential', formData),
      financial: this.isSectionComplete('financial', formData),
      guarantor: this.isSectionComplete('guarantor', formData),
      creditCheck: this.isSectionComplete('creditCheck', formData)
    };
    
    const completedSteps = Object.values(sectionStatus).filter(Boolean).length;
    const currentStep = this.getCurrentStep(formData);
    const progress = Math.round((completedSteps / 6) * 100);
    
    let status: 'not_started' | 'in_progress' | 'completed';
    if (completedSteps === 0) {
      status = 'not_started';
    } else if (completedSteps === 6) {
      status = 'completed';
    } else {
      status = 'in_progress';
    }
    
    const result = {
      currentStep,
      completedSteps,
      totalSteps: 6,
      progress,
      sections: sectionStatus,
      status,
      lastUpdated: Date.now()
    };
    
    console.log('📊 ProgressService: Calculated progress result:', result);
    
    return result;
  }
  
  /**
   * Check if a specific section is complete
   */
  isSectionComplete(section: FormSection, formData: FormData): boolean {
    const sectionData = formData[section];
    if (!sectionData) {
      console.log(`🔍 ProgressService: No data for section ${section}`);
      return false;
    }
    
    let isComplete = false;
    
    switch (section) {
      case 'identity':
        isComplete = !!(
          sectionData.firstName &&
          sectionData.lastName &&
          sectionData.email &&
          sectionData.phoneNumber &&
          sectionData.dateOfBirth
        );
        console.log(`🔍 ProgressService: Identity section complete: ${isComplete}`, {
          firstName: !!sectionData.firstName,
          lastName: !!sectionData.lastName,
          email: !!sectionData.email,
          phoneNumber: !!sectionData.phoneNumber,
          dateOfBirth: !!sectionData.dateOfBirth
        });
        break;
        
      case 'employment':
        // Basic employment info is required
        const hasBasicInfo = !!(
          sectionData.employmentStatus &&
          sectionData.companyDetails &&
          sectionData.lengthOfEmployment &&
          sectionData.jobPosition
        );
        
        // Reference info is required for employed status
        const hasReferenceInfo = sectionData.employmentStatus === 'employed' ? !!(
          sectionData.referenceFullName &&
          sectionData.referenceEmail &&
          sectionData.referencePhone
        ) : true; // Not required for other employment statuses
        
        isComplete = hasBasicInfo && hasReferenceInfo;
        
        console.log(`🔍 ProgressService: Employment section complete: ${isComplete}`, {
          employmentStatus: !!sectionData.employmentStatus,
          companyDetails: !!sectionData.companyDetails,
          lengthOfEmployment: !!sectionData.lengthOfEmployment,
          jobPosition: !!sectionData.jobPosition,
          referenceFullName: !!sectionData.referenceFullName,
          referenceEmail: !!sectionData.referenceEmail,
          referencePhone: !!sectionData.referencePhone,
          hasBasicInfo,
          hasReferenceInfo
        });
        break;
        
      case 'residential':
        isComplete = !!(
          sectionData.currentAddress &&
          sectionData.durationAtCurrentAddress &&
          sectionData.proofType
        );
        console.log(`🔍 ProgressService: Residential section complete: ${isComplete}`, {
          currentAddress: !!sectionData.currentAddress,
          durationAtCurrentAddress: !!sectionData.durationAtCurrentAddress,
          proofType: !!sectionData.proofType
        });
        break;
        
      case 'financial':
        isComplete = !!(
          sectionData.monthlyIncome &&
          (sectionData.proofOfIncomeType || sectionData.useOpenBanking)
        );
        console.log(`🔍 ProgressService: Financial section complete: ${isComplete}`, {
          monthlyIncome: !!sectionData.monthlyIncome,
          proofOfIncomeType: !!sectionData.proofOfIncomeType,
          useOpenBanking: !!sectionData.useOpenBanking
        });
        break;
        
      case 'guarantor':
        isComplete = !!(
          sectionData.fullName &&
          sectionData.email &&
          sectionData.address
        );
        console.log(`🔍 ProgressService: Guarantor section complete: ${isComplete}`, {
          fullName: !!sectionData.fullName,
          email: !!sectionData.email,
          address: !!sectionData.address
        });
        break;
        
      case 'creditCheck':
        isComplete = !!(
          sectionData.hasAgreedToCheck
        );
        console.log(`🔍 ProgressService: CreditCheck section complete: ${isComplete}`, {
          hasAgreedToCheck: !!sectionData.hasAgreedToCheck
        });
        break;
        
      default:
        console.log(`🔍 ProgressService: Unknown section ${section}`);
        return false;
    }
    
    return isComplete;
  }
  
  /**
   * Determine the current step based on form data
   */
  getCurrentStep(formData: FormData): number {
    const sections = ['identity', 'employment', 'residential', 'financial', 'guarantor', 'creditCheck'] as const;
    
    // Find the first incomplete section
    for (let i = 0; i < sections.length; i++) {
      if (!this.isSectionComplete(sections[i], formData)) {
        return i;
      }
    }
    
    // If all sections are complete, return the last step
    return sections.length - 1;
  }
}

export const progressTrackingService = new ProgressTrackingServiceImpl(); 