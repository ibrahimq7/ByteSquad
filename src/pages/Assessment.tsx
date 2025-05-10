
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Define the assessment questions
const questions = [
  {
    id: 1,
    question: "How often have you felt nervous, anxious, or on edge?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 2,
    question: "How often have you been unable to stop or control worrying?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 3,
    question: "How often have you had little interest or pleasure in doing things?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 4,
    question: "How often have you felt down, depressed, or hopeless?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 5,
    question: "How often have you had trouble falling or staying asleep, or sleeping too much?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 6,
    question: "How often have you felt tired or had little energy?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 7,
    question: "How often have you had trouble concentrating on things?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
];

const Assessment = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; score: number }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<{
    score: number;
    level: 'Low Stress' | 'Mild Stress' | 'Moderate Stress' | 'High Stress' | 'Severe Stress';
    message: string;
    tips: string[];
    recommendedTask: {
      id: number;
      title: string;
      description: string;
      type: 'breathing' | 'gratitude' | 'meditation' | 'affirmation';
    };
  } | null>(null);
  
  const { addAssessmentResult, dailyTasks } = useData();
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  // Mark as onboarded when test is completed
  useEffect(() => {
    if (isCompleted) {
      localStorage.setItem('isOnboarded', 'true');
    }
  }, [isCompleted]);

  const handleNextQuestion = () => {
    if (selectedOption === null) {
      toast({
        title: "Please select an option",
        description: "You need to select an answer to continue.",
      });
      return;
    }

    const newAnswers = [...answers, { questionId: currentQuestion.id, score: selectedOption }];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset selection for next question
    } else {
      completeAssessment(newAnswers);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Remove the last answer
      const previousAnswers = [...answers];
      previousAnswers.pop();
      setAnswers(previousAnswers);
      // Set the previous selection
      const previousAnswer = answers[answers.length - 1];
      setSelectedOption(previousAnswer?.score || null);
    }
  };

  const getRecommendedTask = (level: string) => {
    let taskType: 'breathing' | 'gratitude' | 'meditation' | 'affirmation' = 'breathing';
    
    switch (level) {
      case 'High Stress':
      case 'Severe Stress':
        taskType = 'breathing';
        break;
      case 'Moderate Stress':
        taskType = 'meditation';
        break;
      case 'Mild Stress':
        taskType = 'gratitude';
        break;
      default:
        taskType = 'affirmation';
    }
    
    // Find a task of the appropriate type
    const tasksOfType = dailyTasks.filter(task => task.id.toString().includes(taskType));
    return tasksOfType.length > 0 ? tasksOfType[0] : dailyTasks[0];
  };

  const completeAssessment = (finalAnswers: { questionId: number; score: number }[]) => {
    // Calculate total score
    const totalScore = finalAnswers.reduce((sum, answer) => sum + answer.score, 0);
    
    // Determine stress level based on score
    let level: 'Low Stress' | 'Mild Stress' | 'Moderate Stress' | 'High Stress' | 'Severe Stress';
    let message: string;
    let tips: string[];
    
    const maxPossibleScore = questions.length * 3;
    const scorePercentage = (totalScore / maxPossibleScore) * 100;
    
    if (scorePercentage < 25) {
      level = 'Low Stress';
      message = "Your responses indicate low levels of stress and anxiety. It seems you're doing well overall!";
      tips = [
        "Continue your current wellness practices",
        "Practice mindfulness to maintain your mental wellness",
        "Regular exercise can help maintain your positive state"
      ];
    } else if (scorePercentage < 50) {
      level = 'Mild Stress';
      message = "Your responses indicate mild levels of stress. It's normal to experience some stress, but keeping an eye on it is important.";
      tips = [
        "Try deep breathing exercises when feeling stressed",
        "Make time for activities you enjoy",
        "Ensure you're getting enough sleep"
      ];
    } else if (scorePercentage < 75) {
      level = 'Moderate Stress';
      message = "Your responses indicate moderate levels of stress and anxiety. This might be impacting your daily life.";
      tips = [
        "Consider talking to someone you trust about your feelings",
        "Practice regular relaxation techniques like meditation",
        "Establish a consistent sleep schedule",
        "Limit caffeine and screen time before bed"
      ];
    } else if (scorePercentage < 90) {
      level = 'High Stress';
      message = "Your responses indicate high levels of stress and anxiety. It's important to address these feelings.";
      tips = [
        "Consider speaking with a mental health professional",
        "Set aside time each day for stress-relief activities",
        "Practice saying 'no' to additional responsibilities when feeling overwhelmed",
        "Focus on healthy eating and regular exercise"
      ];
    } else {
      level = 'Severe Stress';
      message = "Your responses indicate very high levels of stress and anxiety. We recommend seeking professional support.";
      tips = [
        "Reach out to a mental health professional as soon as possible",
        "Talk to your doctor about your symptoms",
        "Lean on your support network of friends and family",
        "Focus on basic self-care: sleep, nutrition, and gentle exercise"
      ];
    }
    
    // Find a recommended task based on stress level
    const recommendedTask = getRecommendedTask(level);
    
    const resultData = {
      score: totalScore,
      level,
      message,
      tips,
      recommendedTask
    };
    
    setResult(resultData);
    setIsCompleted(true);
    
    // Save assessment result
    addAssessmentResult({
      score: totalScore,
      level,
      responses: finalAnswers
    });
  };

  const handleViewResult = () => {
    navigate('/assessment-result', { state: { result } });
  };

  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsCompleted(false);
    setResult(null);
    setSelectedOption(null);
  };

  return (
    <div className={cn("container max-w-2xl mx-auto px-4 py-8 pb-20",
      theme === 'dark' ? 'text-gray-100' : '')}>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Mental Health Test
      </h1>
      
      {!isCompleted ? (
        <Card className={cn("shadow-md border-mindease-purple/20 animate-fade-in",
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : '')}>
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <span className={cn("text-sm", theme === 'dark' ? 'text-gray-300' : 'text-gray-500')}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <CardTitle className={cn("mt-4 text-xl",
              theme === 'dark' ? 'text-white' : '')}>
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              className="space-y-3 quiz-transition"
              value={selectedOption?.toString()}
              onValueChange={(value) => setSelectedOption(parseInt(value))}
            >
              {currentQuestion.options.map((option) => (
                <div key={option.value} className={cn(
                  "flex items-center p-4 rounded-lg",
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
                  selectedOption === option.value && (
                    theme === 'dark' ? 'bg-gray-700' : 'bg-mindease-purple/10'
                  )
                )}>
                  <RadioGroupItem 
                    value={option.value.toString()} 
                    id={`option-${option.value}`}
                  />
                  <Label 
                    htmlFor={`option-${option.value}`}
                    className={cn("ml-2 flex-1", theme === 'dark' ? 'text-gray-100' : '')}
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : ''}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex === questions.length - 1 ? (
                <>
                  Finish Test
                  <Check className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <Card className={cn("shadow-md overflow-hidden",
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : '')}>
            <div className={`h-2 ${result?.level === 'Low Stress' ? 'bg-green-500' : 
              result?.level === 'Mild Stress' ? 'bg-blue-500' :
              result?.level === 'Moderate Stress' ? 'bg-yellow-500' :
              result?.level === 'High Stress' ? 'bg-orange-500' : 'bg-red-500'}`} 
            />
            <CardHeader>
              <CardTitle className={cn("text-center text-2xl",
                theme === 'dark' ? 'text-white' : '')}>
                Your Results
              </CardTitle>
              <CardDescription className={cn("text-center",
                theme === 'dark' ? 'text-gray-300' : '')}>
                Assessment completed on {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <span className={cn("text-5xl font-bold inline-block p-4 rounded-full",
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100')}>
                  {result?.level === 'Low Stress' ? '😊' : 
                   result?.level === 'Mild Stress' ? '🙂' :
                   result?.level === 'Moderate Stress' ? '😐' :
                   result?.level === 'High Stress' ? '😥' : '😰'}
                </span>
                <h3 className={cn("text-xl font-bold mt-4",
                  theme === 'dark' ? 'text-white' : '')}>
                  {result?.level}
                </h3>
                <p className={cn("mt-2", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                  {result?.message}
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className={cn("font-bold", theme === 'dark' ? 'text-white' : '')}>
                  We've prepared a personalized report and activity for you:
                </h4>
                
                <div className="mt-4 space-y-4">
                  <Button 
                    className="w-full"
                    onClick={handleViewResult}
                  >
                    View Detailed Report
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={resetAssessment}
                    className={cn("w-full", 
                      theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : '')}
                  >
                    Retake Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className={cn("text-center text-sm", 
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            <p>Note: This assessment is for informational purposes only and is not a diagnostic tool.</p>
            <p className="mt-1">If you're experiencing severe distress, please seek professional help immediately.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;
