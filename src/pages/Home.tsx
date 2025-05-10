
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, BookOpen, LineChart, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";

const Home = () => {
  const { currentUser } = useAuth();
  const { getRecentMoods } = useData();
  
  const recentMoods = getRecentMoods(7);
  const currentHour = new Date().getHours();
  
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

  return (
    <div className="container max-w-5xl mx-auto px-4 pb-20">
      <div className="py-8">
        <h1 className="text-3xl font-bold animate-fade-in">
          {greeting}, <span className="text-primary">{currentUser?.displayName || 'Friend'}</span>
        </h1>
        <p className="text-gray-600 mt-2 animate-fade-in">Welcome to your wellness journey</p>
      </div>
      
      {!todaysMood && (
        <Card className="bg-mindease-blue/30 mb-8 shadow-sm border-mindease-blue animate-fade-in">
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
        <Card className="mb-8 shadow-sm border-mindease-green/20 animate-fade-in">
          <CardContent className="pt-6 flex items-center">
            <div className="text-4xl mr-4">{getEmotionEmoji(todaysMood.mood)}</div>
            <div>
              <p className="font-medium">Today you're feeling {todaysMood.mood}</p>
              {todaysMood.note && <p className="text-sm text-gray-600 mt-1">{todaysMood.note}</p>}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/assessment" className="card-hover-effect">
          <Card className="h-full border-mindease-purple/20 shadow-sm hover:border-mindease-purple/50 transition-colors">
            <CardContent className="pt-6 flex items-start space-x-4">
              <div className="bg-mindease-purple/20 p-3 rounded-lg">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="mb-2">Self-Assessment</CardTitle>
                <CardDescription>Take a quick wellness check to track your mental health</CardDescription>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/mood" className="card-hover-effect">
          <Card className="h-full border-mindease-blue/20 shadow-sm hover:border-mindease-blue/50 transition-colors">
            <CardContent className="pt-6 flex items-start space-x-4">
              <div className="bg-mindease-blue/20 p-3 rounded-lg">
                <LineChart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="mb-2">Mood Tracker</CardTitle>
                <CardDescription>Track and visualize your daily mood patterns</CardDescription>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/resources" className="card-hover-effect">
          <Card className="h-full border-mindease-green/20 shadow-sm hover:border-mindease-green/50 transition-colors">
            <CardContent className="pt-6 flex items-start space-x-4">
              <div className="bg-mindease-green/20 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="mb-2">Resource Library</CardTitle>
                <CardDescription>Explore articles, videos, and resources for mental wellness</CardDescription>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/profile" className="card-hover-effect">
          <Card className="h-full border-mindease-peach/20 shadow-sm hover:border-mindease-peach/50 transition-colors">
            <CardContent className="pt-6 flex items-start space-x-4">
              <div className="bg-mindease-peach/20 p-3 rounded-lg">
                <Settings className="h-6 w-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <CardTitle className="mb-2">Profile Settings</CardTitle>
                <CardDescription>Update your account preferences and information</CardDescription>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Wellness Tip</h2>
        <Card className="bg-gradient-to-r from-mindease-purple/20 to-mindease-blue/20 shadow-sm border-0">
          <CardContent className="pt-6">
            <p className="text-lg font-medium">Practice deep breathing</p>
            <p className="mt-2 text-gray-600">
              Try the 4-7-8 technique: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. 
              Repeat this 4 times whenever you feel stressed or anxious.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
