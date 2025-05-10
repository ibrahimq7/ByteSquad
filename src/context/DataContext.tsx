
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

export interface DailyTask {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  completedDate?: number;
}

interface TaskCompletion {
  id: string;
  userId: string;
  taskId: number;
  timestamp: number;
}

interface DataContextType {
  moodEntries: MoodEntry[];
  assessmentResults: AssessmentResult[];
  taskCompletions: TaskCompletion[];
  loading: boolean;
  error: string | null;
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
  addAssessmentResult: (result: Omit<AssessmentResult, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
  getRecentMoods: (days?: number) => MoodEntry[];
  getMoodsByDateRange: (startDate: Date, endDate: Date) => MoodEntry[];
  getMoodByDate: (date: Date) => MoodEntry | undefined;
  getDailyTask: (getNew?: boolean) => DailyTask;
  addDailyTaskCompletion: (taskId: number) => Promise<void>;
  getTaskCompletionHistory: () => TaskCompletion[];
}

const dailyTasks = [
  {
    id: 1,
    title: "Breathe deeply for 2 minutes",
    description: "Find a quiet spot. Breathe in for 4 seconds, hold for 4 seconds, exhale for 6 seconds. Repeat for 2 minutes."
  },
  {
    id: 2,
    title: "Write 3 things you're grateful for",
    description: "Take a moment to write down three things you feel grateful for today, no matter how small they might seem."
  },
  {
    id: 3,
    title: "Do a 5-minute body scan meditation",
    description: "Sit comfortably, close your eyes, and mentally scan your body from head to toe, noticing any sensations without judgment."
  },
  {
    id: 4,
    title: "Read a positive affirmation",
    description: "Choose an affirmation like 'I am capable of handling whatever comes my way today' and repeat it to yourself several times."
  },
  {
    id: 5,
    title: "Take a mindful walk for 10 minutes",
    description: "Walk slowly, paying attention to each step and your surroundings. Notice textures, sounds, and sensations without judgment."
  },
  {
    id: 6,
    title: "Practice progressive muscle relaxation",
    description: "Tense and then release each muscle group in your body, starting from your toes and moving up to your head."
  },
  {
    id: 7,
    title: "Do a digital detox for 30 minutes",
    description: "Put away all electronic devices and spend time doing something that doesn't involve screens."
  }
];

// Create the data context
const DataContext = createContext<DataContextType | null>(null);

// Create a provider component
export function DataProvider({ children }: { children: ReactNode }) {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [taskCompletions, setTaskCompletions] = useState<TaskCompletion[]>([]);
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
        
        // Load task completions
        const storedTaskCompletions = localStorage.getItem(`mindease_tasks_${currentUser.id}`);
        if (storedTaskCompletions) {
          setTaskCompletions(JSON.parse(storedTaskCompletions));
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
      setTaskCompletions([]);
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
  
  // Get moods within a specific date range
  const getMoodsByDateRange = (startDate: Date, endDate: Date) => {
    if (!moodEntries.length) return [];
    
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    
    return moodEntries
      .filter(entry => {
        return entry.timestamp >= startTime && entry.timestamp <= endTime;
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  };
  
  // Get mood for a specific date
  const getMoodByDate = (date: Date) => {
    if (!moodEntries.length) return undefined;
    
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const targetTime = targetDate.getTime();
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayTime = nextDay.getTime();
    
    return moodEntries.find(entry => {
      return entry.timestamp >= targetTime && entry.timestamp < nextDayTime;
    });
  };
  
  // Get daily task
  const getDailyTask = (getNew = false): DailyTask => {
    if (!currentUser) {
      // Return default task if not logged in
      return { ...dailyTasks[0], completed: false };
    }
    
    // Check if a task was already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    const tomorrowTime = todayTime + 86400000;
    
    const todayCompletion = taskCompletions.find(task => {
      return task.timestamp >= todayTime && task.timestamp < tomorrowTime;
    });
    
    if (todayCompletion && !getNew) {
      // Return the completed task
      const completedTask = dailyTasks.find(task => task.id === todayCompletion.taskId);
      if (completedTask) {
        return { ...completedTask, completed: true, completedDate: todayCompletion.timestamp };
      }
    }
    
    // Calculate which task to show based on the day of year (to rotate tasks)
    const dayOfYear = Math.floor((todayTime - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const taskIndex = getNew 
      ? Math.floor(Math.random() * dailyTasks.length) 
      : dayOfYear % dailyTasks.length;
    
    return { ...dailyTasks[taskIndex], completed: false };
  };
  
  // Add a new task completion
  const addDailyTaskCompletion = async (taskId: number) => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to complete tasks.",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Create a new completion record
      const newCompletion: TaskCompletion = {
        id: Date.now().toString(),
        userId: currentUser.id,
        taskId,
        timestamp: Date.now()
      };
      
      // Add to state
      const updatedCompletions = [...taskCompletions, newCompletion];
      setTaskCompletions(updatedCompletions);
      
      // Save to localStorage
      localStorage.setItem(`mindease_tasks_${currentUser.id}`, JSON.stringify(updatedCompletions));
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your task completion. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get task completion history
  const getTaskCompletionHistory = () => {
    return taskCompletions.sort((a, b) => b.timestamp - a.timestamp);
  };

  const value = {
    moodEntries,
    assessmentResults,
    taskCompletions,
    loading,
    error,
    addMoodEntry,
    addAssessmentResult,
    getRecentMoods,
    getMoodsByDateRange,
    getMoodByDate,
    getDailyTask,
    addDailyTaskCompletion,
    getTaskCompletionHistory
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
