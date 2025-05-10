
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, BookOpen, Calendar, Check, ChevronRight, Settings, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useToast } from "@/components/ui/use-toast";

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

const Home = () => {
  const { currentUser } = useAuth();
  const { getRecentMoods, addDailyTaskCompletion, getDailyTask } = useData();
  const { toast } = useToast();
  
  const recentMoods = getRecentMoods(7);
  const currentHour = new Date().getHours();
  const [dailyTask, setDailyTask] = useState(getDailyTask());
  const [taskCompleted, setTaskCompleted] = useState(dailyTask.completed);
  
  // Determine greeting based on time of day
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good evening";
  }

  const getEmotionEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😔';
      case 'anxious': return '😰';
      case 'neutral': return '😐';
      case 'angry': return '😠';
      default: return '😊';
    }
  };
  
  const getTodaysMood = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysMood = recentMoods.find(mood => {
      const moodDate = new Date(mood.timestamp);
      moodDate.setHours(0, 0, 0, 0);
      return moodDate.getTime() === today.getTime();
    });
    
    return todaysMood;
  };
  
  const todaysMood = getTodaysMood();

  const handleCompleteTask = () => {
    addDailyTaskCompletion(dailyTask.id);
    setTaskCompleted(true);
    toast({
      title: "Task completed!",
      description: "Great job taking care of your mental well-being today.",
    });
  };

  const handleSkipTask = () => {
    const newTask = getDailyTask(true); // Get a new task
    setDailyTask(newTask);
    toast({
      title: "Task skipped",
      description: "Here's a different task for you to try.",
    });
  };

  return (
    <div className="px-4 pb-20">
      <div className="py-6">
        <h1 className="text-2xl font-bold animate-fade-in">
          {greeting}, <span className="text-primary">{currentUser?.displayName || 'Friend'}</span>
        </h1>
        <p className="text-gray-600 mt-1 animate-fade-in">Welcome to MindEase</p>
      </div>
      
      {!todaysMood && (
        <Card className="bg-mindease-blue/30 mb-5 shadow-sm border-mindease-blue animate-fade-in">
          <CardContent className="pt-6">
            <p className="text-lg font-medium">How are you feeling today?</p>
            <Link to="/mood" className="inline-block mt-2">
              <button className="bg-white text-primary px-4 py-2 rounded-md shadow-sm font-medium hover:shadow transition-all">
                Track your mood
              </button>
            </Link>
          </CardContent>
        </Card>
      )}
      
      {todaysMood && (
        <Card className="mb-5 shadow-sm border-mindease-green/20 animate-fade-in">
          <CardContent className="pt-6 flex items-center">
            <div className="text-4xl mr-4">{getEmotionEmoji(todaysMood.mood)}</div>
            <div>
              <p className="font-medium">Today you're feeling {todaysMood.mood}</p>
              {todaysMood.note && <p className="text-sm text-gray-600 mt-1">{todaysMood.note}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Task Section */}
      <Card className="mb-5 shadow-sm border-mindease-purple/20 animate-fade-in">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Daily Task</h2>
            {!taskCompleted && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={handleSkipTask}
              >
                <X className="h-4 w-4 mr-1" />
                Skip
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            <p className="font-semibold">{dailyTask.title}</p>
            <p className="text-sm text-gray-600">{dailyTask.description}</p>
            
            {!taskCompleted ? (
              <Button 
                className="w-full" 
                onClick={handleCompleteTask}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark as Complete
              </Button>
            ) : (
              <div className="bg-green-50 text-green-600 px-3 py-2 rounded-md flex items-center justify-center">
                <Check className="h-4 w-4 mr-2" />
                <span>Completed for today</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Link to="/mood" className="card-hover-effect">
          <Card className="h-full border-mindease-blue/20 shadow-sm hover:border-mindease-blue/50 transition-colors">
            <CardContent className="pt-4 flex flex-col items-center text-center">
              <div className="bg-mindease-blue/20 p-3 rounded-lg mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <p className="font-medium text-sm">Track Mood</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/assessment" className="card-hover-effect">
          <Card className="h-full border-mindease-purple/20 shadow-sm hover:border-mindease-purple/50 transition-colors">
            <CardContent className="pt-4 flex flex-col items-center text-center">
              <div className="bg-mindease-purple/20 p-3 rounded-lg mb-2">
                <BarChart className="h-5 w-5 text-purple-600" />
              </div>
              <p className="font-medium text-sm">Assessment</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/resources" className="card-hover-effect">
          <Card className="h-full border-mindease-green/20 shadow-sm hover:border-mindease-green/50 transition-colors">
            <CardContent className="pt-4 flex flex-col items-center text-center">
              <div className="bg-mindease-green/20 p-3 rounded-lg mb-2">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <p className="font-medium text-sm">Resources</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/profile" className="card-hover-effect">
          <Card className="h-full border-mindease-peach/20 shadow-sm hover:border-mindease-peach/50 transition-colors">
            <CardContent className="pt-4 flex flex-col items-center text-center">
              <div className="bg-mindease-peach/20 p-3 rounded-lg mb-2">
                <Settings className="h-5 w-5 text-orange-500" />
              </div>
              <p className="font-medium text-sm">Profile</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Wellness Tip */}
      <Card className="bg-gradient-to-r from-mindease-purple/20 to-mindease-blue/20 shadow-sm border-0">
        <CardContent className="pt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">Wellness Tip</p>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">
            Practice the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
