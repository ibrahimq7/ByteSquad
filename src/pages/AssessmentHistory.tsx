
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { format } from "date-fns";

const AssessmentHistory = () => {
  const navigate = useNavigate();
  const { assessmentResults } = useData();
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
    <div className="px-4 py-6 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Assessment History</h1>
      </div>
      
      {assessmentResults.length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="pt-6 text-center py-8">
            <p className="text-gray-500">You haven't taken any assessments yet.</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/assessment')}
            >
              Take Assessment
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
                className="whitespace-nowrap"
                onClick={() => setSelectedResult(result)}
              >
                {format(new Date(result.timestamp), 'MMM d')}
              </Button>
            ))}
          </div>
          
          <Card className="shadow-md overflow-hidden animate-fade-in">
            <div className={`h-2 ${getLevelColor(selectedResult.level)}`} />
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedResult.level}</span>
                <span className="text-2xl">{getLevelEmoji(selectedResult.level)}</span>
              </CardTitle>
              <p className="text-sm text-gray-500">
                {format(new Date(selectedResult.timestamp), 'MMMM d, yyyy • h:mm a')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total Score</p>
                  <p className="text-xl font-semibold">{selectedResult.score}</p>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">What this means:</h3>
                  {selectedResult.level === 'Low Stress' && (
                    <p className="text-sm text-gray-600">
                      Your responses indicate low levels of stress and anxiety. It seems you're doing well overall. Continue your current wellness practices.
                    </p>
                  )}
                  {selectedResult.level === 'Mild Stress' && (
                    <p className="text-sm text-gray-600">
                      Your responses indicate mild levels of stress. It's normal to experience some stress, but keeping an eye on it is important.
                    </p>
                  )}
                  {selectedResult.level === 'Moderate Stress' && (
                    <p className="text-sm text-gray-600">
                      Your responses indicate moderate levels of stress and anxiety. This might be impacting your daily life.
                    </p>
                  )}
                  {selectedResult.level === 'High Stress' && (
                    <p className="text-sm text-gray-600">
                      Your responses indicate high levels of stress and anxiety. It's important to address these feelings.
                    </p>
                  )}
                  {selectedResult.level === 'Severe Stress' && (
                    <p className="text-sm text-gray-600">
                      Your responses indicate very high levels of stress and anxiety. We recommend seeking professional support.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AssessmentHistory;
