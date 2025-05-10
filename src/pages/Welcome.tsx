
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

const Welcome = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);
  
  const handleBeginCheckup = () => {
    // Mark as ready and proceed to the assessment
    setReady(true);
    navigate('/assessment');
  };
  
  const handleSkipForNow = () => {
    // Mark as onboarded but skip the assessment
    localStorage.setItem('isOnboarded', 'true');
    navigate('/');
  };

  return (
    <div className={cn("min-h-screen px-4 py-12 flex flex-col items-center justify-center bg-gradient-to-b", 
      theme === 'dark' 
        ? 'from-gray-800 to-gray-900' 
        : 'from-mindease-blue/30 to-white')
    }>
      <div className="w-full max-w-md animate-fade-in space-y-8">
        <div className="text-center">
          <h1 className={cn("text-3xl font-bold",
            theme === 'dark' ? 'text-white' : 'text-primary')}>
            Welcome to MindEase
          </h1>
          <p className={cn("mt-2", 
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
            Hi, {currentUser?.displayName || 'there'}! We're glad you're here.
          </p>
        </div>
        
        <Card className={cn("shadow-lg border",
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white')}>
          <CardContent className="pt-6 space-y-4">
            <h2 className={cn("text-xl font-semibold",
              theme === 'dark' ? 'text-white' : 'text-gray-800')}>
              Your Mental Health Checkup
            </h2>
            
            <p className={cn("text-base",
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
              We'd like to start by understanding how you're feeling today with a quick mental health test.
            </p>
            
            <p className={cn("text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              This will help us personalize your experience and recommend activities to improve your wellbeing.
            </p>
            
            <div className="pt-4 space-y-3">
              <Button 
                className="w-full flex items-center justify-center space-x-2"
                onClick={handleBeginCheckup}
              >
                <span>Begin Mental Health Test</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                className={cn("w-full", 
                  theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-200')}
                onClick={handleSkipForNow}
              >
                Skip for now
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <p className={cn("text-sm text-center",
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
          Your responses are private and help us provide personalized support for your mental wellness journey.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
