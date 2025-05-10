
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { useToast } from "@/components/ui/use-toast";

const DailyTask = () => {
  const navigate = useNavigate();
  const { getDailyTask, addDailyTaskCompletion, getTaskCompletionHistory } = useData();
  const { toast } = useToast();
  const [dailyTask, setDailyTask] = useState(getDailyTask());
  const [taskCompleted, setTaskCompleted] = useState(dailyTask.completed);
  
  const completions = getTaskCompletionHistory().slice(0, 7); // Get last 7 completions
  
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
    <div className="px-4 py-6 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Daily Mindfulness Task</h1>
      </div>
      
      <Card className="mb-8 shadow-md border-mindease-purple/20 animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Today's Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-xl font-semibold">{dailyTask.title}</p>
            <p className="text-gray-600">{dailyTask.description}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          {!taskCompleted ? (
            <div className="flex w-full space-x-2">
              <Button 
                className="flex-1" 
                onClick={handleCompleteTask}
              >
                <Check className="h-4 w-4 mr-2" />
                Complete
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleSkipTask}
              >
                <X className="h-4 w-4 mr-2" />
                Skip
              </Button>
            </div>
          ) : (
            <div className="bg-green-50 text-green-600 px-3 py-2 rounded-md flex items-center justify-center w-full">
              <Check className="h-4 w-4 mr-2" />
              <span>Completed for today</span>
            </div>
          )}
        </CardFooter>
      </Card>
      
      {completions.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Recent Completion History</h2>
          {completions.map((completion, index) => {
            // Find the task details
            const taskDetails = [
              { id: 1, title: "Breathe deeply for 2 minutes" },
              { id: 2, title: "Write 3 things you're grateful for" },
              { id: 3, title: "Do a 5-minute body scan meditation" },
              { id: 4, title: "Read a positive affirmation" },
              { id: 5, title: "Take a mindful walk for 10 minutes" },
              { id: 6, title: "Practice progressive muscle relaxation" },
              { id: 7, title: "Do a digital detox for 30 minutes" },
            ].find(t => t.id === completion.taskId);
            
            return (
              <Card key={index} className="shadow-sm">
                <CardContent className="py-4 flex items-center">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{taskDetails?.title || 'Task'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(completion.timestamp).toLocaleDateString()} • {new Date(completion.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DailyTask;
