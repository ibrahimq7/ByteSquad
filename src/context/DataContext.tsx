
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from './AuthContext';

// Define the types for our app data
export interface MoodEntry {
  id: string;
  userId: string;
  mood: 'happy' | 'sad' | 'anxious' | 'neutral' | 'angry';
  note?: string;
  timestamp: number;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  score: number;
  level: 'Low Stress' | 'Mild Stress' | 'Moderate Stress' | 'High Stress' | 'Severe Stress';
  timestamp: number;
  responses: { questionId: number; score: number }[];
}

interface DataContextType {
  moodEntries: MoodEntry[];
  assessmentResults: AssessmentResult[];
  loading: boolean;
  error: string | null;
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
  addAssessmentResult: (result: Omit<AssessmentResult, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
  getRecentMoods: (days?: number) => MoodEntry[];
}

// Create the data context
const DataContext = createContext<DataContextType | null>(null);

// Create a provider component
export function DataProvider({ children }: { children: ReactNode }) {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Load data from localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      try {
        // Load mood entries
        const storedMoods = localStorage.getItem(`mindease_moods_${currentUser.id}`);
        if (storedMoods) {
          setMoodEntries(JSON.parse(storedMoods));
        }
        
        // Load assessment results
        const storedAssessments = localStorage.getItem(`mindease_assessments_${currentUser.id}`);
        if (storedAssessments) {
          setAssessmentResults(JSON.parse(storedAssessments));
        }
      } catch (err: any) {
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "There was an error loading your data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Reset state when user logs out
      setMoodEntries([]);
      setAssessmentResults([]);
      setLoading(false);
    }
  }, [currentUser, toast]);

  // Add a new mood entry
  const addMoodEntry = async (entry: Omit<MoodEntry, 'id' | 'userId' | 'timestamp'>) => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to add a mood entry.",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Create a new entry with ID and timestamp
      const newEntry: MoodEntry = {
        ...entry,
        id: Date.now().toString(),
        userId: currentUser.id,
        timestamp: Date.now()
      };
      
      // Add to state
      const updatedEntries = [...moodEntries, newEntry];
      setMoodEntries(updatedEntries);
      
      // Save to localStorage
      localStorage.setItem(`mindease_moods_${currentUser.id}`, JSON.stringify(updatedEntries));
      
      toast({
        title: "Mood logged",
        description: "Your mood has been recorded successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your mood. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a new assessment result
  const addAssessmentResult = async (result: Omit<AssessmentResult, 'id' | 'userId' | 'timestamp'>) => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save assessment results.",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Create a new result with ID and timestamp
      const newResult: AssessmentResult = {
        ...result,
        id: Date.now().toString(),
        userId: currentUser.id,
        timestamp: Date.now()
      };
      
      // Add to state
      const updatedResults = [...assessmentResults, newResult];
      setAssessmentResults(updatedResults);
      
      // Save to localStorage
      localStorage.setItem(`mindease_assessments_${currentUser.id}`, JSON.stringify(updatedResults));
      
      toast({
        title: "Assessment completed",
        description: "Your assessment results have been saved.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your assessment results. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get recent moods (past X days)
  const getRecentMoods = (days = 7) => {
    if (!moodEntries.length) return [];
    
    const now = Date.now();
    const millisecondsPerDay = 86400000;
    const cutoff = now - (days * millisecondsPerDay);
    
    return moodEntries
      .filter(entry => entry.timestamp >= cutoff)
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const value = {
    moodEntries,
    assessmentResults,
    loading,
    error,
    addMoodEntry,
    addAssessmentResult,
    getRecentMoods
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// Custom hook to use the data context
export function useData() {
  const context = useContext(DataContext);
  if (context === null) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
