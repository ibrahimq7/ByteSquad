
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { BarChart, Calendar, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { assessmentResults, moodEntries } = useData();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateProfile({ displayName });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Update profile error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get the most recent assessment
  const recentAssessment = assessmentResults.length > 0 
    ? assessmentResults[assessmentResults.length - 1] 
    : null;
    
  // Get the assessment count
  const assessmentCount = assessmentResults.length;
  
  // Get the mood entry count
  const moodEntryCount = moodEntries.length;

  return (
    <div className="px-4 py-6 pb-20">
      <h1 className={cn("text-2xl font-bold mb-6", theme === 'dark' ? 'text-white' : '')}>
        Your Profile
      </h1>
      
      <Card className={cn("mb-6 shadow-md overflow-hidden",
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-mindease-purple/20')}>
        <div className="h-16 bg-gradient-to-r from-mindease-purple to-mindease-blue" />
        <div className="flex justify-center -mt-8">
          <div className={cn("h-16 w-16 rounded-full shadow-md flex items-center justify-center text-2xl",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white')}>
            {currentUser?.displayName?.[0] || 'U'}
          </div>
        </div>
        
        <CardHeader className="text-center pt-2">
          <CardTitle className={theme === 'dark' ? 'text-white' : ''}>
            {currentUser?.displayName || 'User'}
          </CardTitle>
          <CardDescription className={theme === 'dark' ? 'text-gray-300' : ''}>
            {currentUser?.email}
          </CardDescription>
        </CardHeader>
        
        {!isEditing ? (
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => setIsEditing(true)}
              className={theme === 'dark' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
            >
              Edit Profile
            </Button>
          </CardFooter>
        ) : (
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={theme === 'dark' ? 'text-white' : ''}>
                  Display Name
                </Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={cn("border-mindease-purple/20",
                    theme === 'dark' ? 'bg-gray-700 text-white' : '')}
                />
              </div>
              
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setDisplayName(currentUser?.displayName || "");
                  }}
                  className={theme === 'dark' ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : ''}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>
      
      {/* Theme Setting */}
      <Card className={cn("mb-6 shadow-sm",
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-mindease-blue/20')}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : ''}>
            Appearance
          </CardTitle>
          <CardDescription className={theme === 'dark' ? 'text-gray-300' : ''}>
            Customize how MindEase looks for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-gray-200" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
              <Label htmlFor="theme-mode" className={theme === 'dark' ? 'text-white' : ''}>
                Dark Mode
              </Label>
            </div>
            <Switch
              id="theme-mode"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Activity Summary */}
      <Card className={cn("mb-6 shadow-sm",
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-mindease-blue/20')}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : ''}>
            Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className={cn("p-4 rounded-md text-center",
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
              <div className={cn("text-2xl font-bold",
                theme === 'dark' ? 'text-primary' : 'text-primary')}>
                {moodEntryCount}
              </div>
              <div className={cn("text-sm",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500')}>
                Mood Entries
              </div>
            </div>
            <div className={cn("p-4 rounded-md text-center",
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
              <div className={cn("text-2xl font-bold",
                theme === 'dark' ? 'text-primary' : 'text-primary')}>
                {assessmentCount}
              </div>
              <div className={cn("text-sm",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500')}>
                Mental Health Tests
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Your Records */}
      <Card className={cn("mb-6 shadow-md",
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : '')}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : ''}>
            Your Records
          </CardTitle>
          <CardDescription className={theme === 'dark' ? 'text-gray-300' : ''}>
            View your health tracking history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link 
            to="/mood/calendar" 
            className={cn("flex items-center justify-between p-3 rounded-md transition-colors",
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-50 hover:bg-gray-100')}
          >
            <div className="flex items-center">
              <div className={cn("p-2 rounded-lg mr-3",
                theme === 'dark' ? 'bg-blue-500/20' : 'bg-mindease-blue/20')}>
                <Calendar className={cn("h-5 w-5",
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600')} />
              </div>
              <div>
                <p className={cn("font-medium", theme === 'dark' ? 'text-white' : '')}>
                  Mood Calendar
                </p>
                <p className={cn("text-xs", 
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                  View your mood history by date
                </p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/assessment-history" 
            className={cn("flex items-center justify-between p-3 rounded-md transition-colors",
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-50 hover:bg-gray-100')}
          >
            <div className="flex items-center">
              <div className={cn("p-2 rounded-lg mr-3",
                theme === 'dark' ? 'bg-purple-500/20' : 'bg-mindease-purple/20')}>
                <BarChart className={cn("h-5 w-5",
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600')} />
              </div>
              <div>
                <p className={cn("font-medium", theme === 'dark' ? 'text-white' : '')}>
                  Test History
                </p>
                <p className={cn("text-xs", 
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                  Review your previous test results
                </p>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
      
      {/* Recent Assessment */}
      {recentAssessment && (
        <Card className={cn("mb-6 shadow-sm",
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-mindease-purple/20')}>
          <CardHeader>
            <CardTitle className={theme === 'dark' ? 'text-white' : ''}>
              Latest Test Result
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-gray-300' : ''}>
              {format(new Date(recentAssessment.timestamp), 'MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className={cn("font-medium", theme === 'dark' ? 'text-white' : '')}>
                  {recentAssessment.level}
                </p>
                <p className={cn("text-sm", 
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500')}>
                  Score: {recentAssessment.score}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className={theme === 'dark' ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : ''}
              >
                <Link to="/assessment-history">View All</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* App Settings */}
      <Card className={cn("shadow-sm",
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-mindease-green/20')}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : ''}>
            App Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className={theme === 'dark' ? 'text-white' : ''}>About MindEase</Label>
              <p className={cn("text-sm", 
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500')}>
                Version 1.0.0
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className={theme === 'dark' ? 'text-white' : ''}>Privacy Policy</Label>
              <p className={cn("text-sm", 
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500')}>
                Read our privacy policy
              </p>
            </div>
            <Button 
              variant="link"
              className={theme === 'dark' ? 'text-primary' : ''}
            >
              View
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className={theme === 'dark' ? 'text-white' : ''}>Terms of Service</Label>
              <p className={cn("text-sm", 
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500')}>
                Read our terms of service
              </p>
            </div>
            <Button 
              variant="link"
              className={theme === 'dark' ? 'text-primary' : ''}
            >
              View
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6 border-gray-200 dark:border-gray-700">
          <p className={cn("text-sm", 
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            © 2025 MindEase App. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
