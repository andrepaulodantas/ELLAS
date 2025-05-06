import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type SidebarState = {
  selectedCategory: string | null;
  selectedQuestion: string | null;
  selectedCountries: string[];
  selectedYears: string[];
  selectedStatuses: string[];
};

interface SidebarContextType {
  state: SidebarState;
  updateState: (newState: Partial<SidebarState>) => void;
  clearState: () => void;
}

const initialState: SidebarState = {
  selectedCategory: null,
  selectedQuestion: null,
  selectedCountries: [],
  selectedYears: [],
  selectedStatuses: [],
};

// Create context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Create a hook to use the sidebar context
export const useSidebarState = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebarState must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState<SidebarState>(() => {
    // Get state from localStorage if available
    const savedState = localStorage.getItem('sidebarState');
    return savedState ? JSON.parse(savedState) : initialState;
  });

  // Initialize state from URL params on mount
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    
    const newState: Partial<SidebarState> = {};
    
    const category = query.get('category');
    if (category) newState.selectedCategory = category;
    
    const questionTitle = query.get('questionTitle');
    if (questionTitle) newState.selectedQuestion = decodeURIComponent(questionTitle);
    
    const country = query.get('country');
    if (country) newState.selectedCountries = [country];
    
    const year = query.get('year');
    if (year) newState.selectedYears = [year];
    
    const status = query.get('status');
    if (status) newState.selectedStatuses = [status];
    
    if (Object.keys(newState).length > 0) {
      setState(prev => ({ ...prev, ...newState }));
    }
  }, []);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify(state));
    
    // Set up storage event listener to sync between tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sidebarState' && e.newValue) {
        setState(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [state]);

  // Update URL when state changes (except on first mount)
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    const newParams = new URLSearchParams();
    
    if (state.selectedCategory) newParams.set('category', state.selectedCategory);
    
    if (state.selectedQuestion) {
      newParams.set('questionTitle', encodeURIComponent(state.selectedQuestion));
    }
    
    if (state.selectedCountries.length > 0) {
      newParams.set('country', state.selectedCountries[0]);
    }
    
    if (state.selectedYears.length > 0) {
      newParams.set('year', state.selectedYears[0]);
    }
    
    if (state.selectedStatuses.length > 0) {
      newParams.set('status', state.selectedStatuses[0]);
    }
    
    // Don't update URL if params are the same or on first mount
    const newParamsString = newParams.toString();
    const currentParamsString = currentParams.toString();
    
    if (newParamsString !== currentParamsString) {
      navigate(`${location.pathname}?${newParamsString}`, { replace: true });
    }
  }, [state, location.pathname, navigate]);

  const updateState = (newState: Partial<SidebarState>) => {
    setState(prev => ({ ...prev, ...newState }));
    
    // Dispatch storage event to other tabs
    const event = new StorageEvent('storage', {
      key: 'sidebarState',
      newValue: JSON.stringify({ ...state, ...newState })
    });
    window.dispatchEvent(event);
  };

  const clearState = () => {
    setState(initialState);
    
    // Dispatch storage event to other tabs
    const event = new StorageEvent('storage', {
      key: 'sidebarState',
      newValue: JSON.stringify(initialState)
    });
    window.dispatchEvent(event);
  };

  return (
    <SidebarContext.Provider value={{ state, updateState, clearState }}>
      {children}
    </SidebarContext.Provider>
  );
}; 