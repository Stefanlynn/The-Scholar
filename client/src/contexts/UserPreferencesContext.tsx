import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface UserPreferences {
  defaultBibleTranslation: string;
  darkMode: boolean;
  notifications: boolean;
  ministryRole: string | null;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultBibleTranslation: 'kjv',
    darkMode: false,
    notifications: true,
    ministryRole: null,
  });

  // Fetch user profile and preferences
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['/api/user/profile'],
    enabled: !!user,
  });

  // Update preferences when user profile data changes
  useEffect(() => {
    if (userProfile) {
      setPreferences({
        defaultBibleTranslation: userProfile.defaultBibleTranslation || 'kjv',
        darkMode: userProfile.darkMode || false,
        notifications: userProfile.notifications !== false,
        ministryRole: userProfile.ministryRole,
      });
    }
  }, [userProfile]);

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (newPreferences: Partial<UserPreferences>) => {
      return apiRequest('/api/user/profile', 'PATCH', newPreferences);
    },
    onSuccess: (data) => {
      // Update local state immediately
      setPreferences(prev => ({
        ...prev,
        ...data,
      }));
      
      // Invalidate related queries to refresh data across the app
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sermons'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/library'] });
    },
  });

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    await updatePreferencesMutation.mutateAsync(newPreferences);
  };

  // Apply dark mode changes to document
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        isLoading: isLoading || updatePreferencesMutation.isPending,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}