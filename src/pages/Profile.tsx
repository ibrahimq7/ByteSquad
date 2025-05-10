
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
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

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 pb-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Your Profile</h1>
      
      <Card className="mb-8 shadow-md border-mindease-purple/20 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-mindease-purple to-mindease-blue" />
        <div className="flex justify-center -mt-12">
          <div className="h-24 w-24 rounded-full bg-white shadow-md flex items-center justify-center text-3xl">
            {currentUser?.displayName?.[0] || 'U'}
          </div>
        </div>
        
        <CardHeader className="text-center pt-2">
          <CardTitle>{currentUser?.displayName || 'User'}</CardTitle>
          <CardDescription>{currentUser?.email}</CardDescription>
        </CardHeader>
        
        {!isEditing ? (
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Account Settings</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Account Settings</DialogTitle>
                  <DialogDescription>
                    Manage your account settings and preferences.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={currentUser?.email} disabled />
                    <p className="text-xs text-muted-foreground">
                      To change your email address, please contact support.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      Change Password
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Password changes are disabled in this demo.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Data & Privacy</Label>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      Export Your Data
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
      
      <Card className="mb-8 shadow-md border-mindease-blue/20">
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
          <CardDescription>Customize your MindEase experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-sm text-gray-500">Receive reminders to track your mood</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="privacy">Privacy</Label>
              <p className="text-sm text-gray-500">Manage your data and privacy settings</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <p className="text-sm text-gray-500">Choose light or dark mode</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">Light</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-md border-mindease-green/20">
        <CardHeader>
          <CardTitle>About MindEase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Version</Label>
              <p className="text-sm text-gray-500">1.0.0</p>
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
