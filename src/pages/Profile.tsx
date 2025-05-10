
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { format } from "date-fns";

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { assessmentResults, moodEntries } = useData();
  const { toast } = useToast();
  
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
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <Card className="mb-6 shadow-md border-mindease-purple/20 overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-mindease-purple to-mindease-blue" />
        <div className="flex justify-center -mt-8">
          <div className="h-16 w-16 rounded-full bg-white shadow-md flex items-center justify-center text-2xl">
            {currentUser?.displayName?.[0] || 'U'}
          </div>
        </div>
        
        <CardHeader className="text-center pt-2">
          <CardTitle>{currentUser?.displayName || 'User'}</CardTitle>
          <CardDescription>{currentUser?.email}</CardDescription>
        </CardHeader>
        
        {!isEditing ? (
          <CardFooter className="flex justify-center">
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </CardFooter>
        ) : (
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="border-mindease-purple/20"
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
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>
      
      {/* Activity Summary */}
      <Card className="mb-6 shadow-sm border-mindease-blue/20">
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-primary">{moodEntryCount}</div>
              <div className="text-sm text-gray-500">Mood Entries</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold text-primary">{assessmentCount}</div>
              <div className="text-sm text-gray-500">Assessments</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Your Records */}
      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle>Your Records</CardTitle>
          <CardDescription>View your health tracking history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link to="/mood/calendar" className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <div className="bg-mindease-blue/20 p-2 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Mood Calendar</p>
                <p className="text-xs text-gray-500">View your mood history by date</p>
              </div>
            </div>
          </Link>
          
          <Link to="/assessment-history" className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <div className="bg-mindease-purple/20 p-2 rounded-lg mr-3">
                <BarChart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Assessment History</p>
                <p className="text-xs text-gray-500">Review your previous assessment results</p>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
      
      {/* Recent Assessment */}
      {recentAssessment && (
        <Card className="mb-6 shadow-sm border-mindease-purple/20">
          <CardHeader>
            <CardTitle>Latest Assessment</CardTitle>
            <CardDescription>
              {format(new Date(recentAssessment.timestamp), 'MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{recentAssessment.level}</p>
                <p className="text-sm text-gray-500">Score: {recentAssessment.score}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/assessment-history">View All</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* App Settings */}
      <Card className="shadow-sm border-mindease-green/20">
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>About MindEase</Label>
              <p className="text-sm text-gray-500">Version 1.0.0</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Privacy Policy</Label>
              <p className="text-sm text-gray-500">Read our privacy policy</p>
            </div>
            <Button variant="link">View</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Terms of Service</Label>
              <p className="text-sm text-gray-500">Read our terms of service</p>
            </div>
            <Button variant="link">View</Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-gray-500">
            © 2025 MindEase App. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
