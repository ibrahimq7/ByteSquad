
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const AssessmentHistory = () => {
  const navigate = useNavigate();
  const { assessmentResults } = useData();
  const { theme } = useTheme();
  const [selectedResult, setSelectedResult] = useState(assessmentResults[0]);
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Low Stress': return 'bg-green-500';
      case 'Mild Stress': return 'bg-blue-500';
      case 'Moderate Stress': return 'bg-yellow-500';
      case 'High Stress': return 'bg-orange-500';
      case 'Severe Stress': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getLevelEmoji = (level: string) => {
    switch (level) {
      case 'Low Stress': return '😊';
      case 'Mild Stress': return '🙂';
      case 'Moderate Stress': return '😐';
      case 'High Stress': return '😥';
      case 'Severe Stress': return '😰';
      default: return '❓';
    }
  };

  return (
    <div className={cn("px-4 py-6 pb-20", theme === 'dark' ? 'text-gray-100' : '')}>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)} 
          className={cn("mr-2", theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : '')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Test History</h1>
      </div>
      
      {assessmentResults.length === 0 ? (
        <Card className={cn("shadow-md", 
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : '')}>
          <CardContent className="pt-6 text-center py-8">
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}>
              You haven't taken any mental health tests yet.
            </p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/assessment')}
            >
              Take Mental Health Test
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex overflow-x-auto pb-2 mb-4 -mx-4 px-4 space-x-2 scrollbar-hide">
            {assessmentResults.slice().reverse().map((result) => (
              <Button
                key={result.id}
                variant={selectedResult?.id === result.id ? "default" : "outline"}
                className={selectedResult?.id !== result.id && theme === 'dark' 
                  ? 'border-gray-700 text-gray-300' 
                  : 'whitespace-nowrap'}
                onClick={() => setSelectedResult(result)}
              >
                {format(new Date(result.timestamp), 'MMM d')}
              </Button>
            ))}
          </div>
          
          <Card className={cn("shadow-md overflow-hidden animate-fade-in",
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : '')}>
            <div className={`h-2 ${getLevelColor(selectedResult.level)}`} />
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className={theme === 'dark' ? 'text-white' : ''}>
                  {selectedResult.level}
                </span>
                <span className="text-2xl">{getLevelEmoji(selectedResult.level)}</span>
              </CardTitle>
              <p className={cn("text-sm", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                {format(new Date(selectedResult.timestamp), 'MMMM d, yyyy • h:mm a')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className={cn("text-sm", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                    Total Score
                  </p>
                  <p className={cn("text-xl font-semibold", theme === 'dark' ? 'text-white' : '')}>
                    {selectedResult.score}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className={cn("font-medium mb-2", theme === 'dark' ? 'text-white' : '')}>
                    What this means:
                  </h3>
                  {selectedResult.level === 'Low Stress' && (
                    <p className={cn("text-sm", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                      Your responses indicate low levels of stress and anxiety. It seems you're doing well overall. Continue your current wellness practices.
                    </p>
                  )}
                  {selectedResult.level === 'Mild Stress' && (
                    <p className={cn("text-sm", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                      Your responses indicate mild levels of stress. It's normal to experience some stress, but keeping an eye on it is important.
                    </p>
                  )}
                  {selectedResult.level === 'Moderate Stress' && (
                    <p className={cn("text-sm", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                      Your responses indicate moderate levels of stress and anxiety. This might be impacting your daily life.
                    </p>
                  )}
                  {selectedResult.level === 'High Stress' && (
                    <p className={cn("text-sm", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                      Your responses indicate high levels of stress and anxiety. It's important to address these feelings.
                    </p>
                  )}
                  {selectedResult.level === 'Severe Stress' && (
                    <p className={cn("text-sm", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                      Your responses indicate very high levels of stress and anxiety. We recommend seeking professional support.
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => navigate('/assessment-result', { 
                    state: { 
                      result: {
                        score: selectedResult.score,
                        level: selectedResult.level,
                        timestamp: selectedResult.timestamp,
                        recommendedTask: {
                          id: 1,
                          title: "Deep breathing exercise",
                          description: "Breathe in for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 5 times.",
                          type: "breathing"
                        },
                        // Derived from level
                        message: selectedResult.level.includes("Low") 
                          ? "Your responses indicate low levels of stress and anxiety. It seems you're doing well overall!"
                          : "Your responses indicate elevated levels of stress and anxiety.",
                        tips: ["Take regular breaks", "Practice mindfulness", "Stay physically active"]
                      } 
                    }
                  })}
                  className="w-full mt-2"
                >
                  View Detailed Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AssessmentHistory;
