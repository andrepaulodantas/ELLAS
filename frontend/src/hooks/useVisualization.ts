import { useState, useCallback, useEffect } from 'react';
import { EnhancedVisualizationState } from '../types';
import {
  setVisualizationType,
  getVisualizationState,
  resetState,
} from '../services/apiService';

export const useVisualization = () => {
  const [state, setState] = useState<EnhancedVisualizationState>(resetState());

  useEffect(() => {
    const savedState = getVisualizationState();
    if (savedState) {
      setState(savedState);
    }
  }, []);

  const updateVisualization = useCallback((newState: Partial<EnhancedVisualizationState>) => {
    setState(currentState => {
      const updatedState: EnhancedVisualizationState = {
        ...currentState,
        ...newState,
        lastUpdated: Date.now()
      };
      
      setVisualizationType(updatedState);
      return updatedState;
    });
  }, []);

  const reset = useCallback(() => {
    const initialState = resetState();
    setState(initialState);
  }, []);

  return {
    state,
    updateVisualization,
    reset,
  };
}; 