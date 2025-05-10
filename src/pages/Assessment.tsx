
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/DataContext";

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; score: number }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    level: 'Low Stress' | 'Mild Stress' | 'Moderate Stress' | 'High Stress' | 'Severe Stress';
    message: string;
    tips: string[];
  } | null>(null);
  
  const { addAssessmentResult } = useData();
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;
  
  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, { questionId: currentQuestion.id, score }];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeAssessment(newAnswers);
    }
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
    
    const resultData = {
      score: totalScore,
      level,
      message,
      tips
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

  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsCompleted(false);
    setResult(null);
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 pb-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Mental Wellness Assessment</h1>
      
      {!isCompleted ? (
        <Card className="shadow-md border-mindease-purple/20 animate-fade-in">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <CardTitle className="mt-4 text-xl">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 quiz-transition">
              {currentQuestion.options.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className="w-full justify-start text-left py-6 px-4 hover:bg-mindease-purple/10 hover:border-mindease-purple/30 transition-all"
                  onClick={() => handleAnswer(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <Card className="shadow-md overflow-hidden">
            <div className={`h-2 ${result?.level === 'Low Stress' ? 'bg-green-500' : 
              result?.level === 'Mild Stress' ? 'bg-blue-500' :
              result?.level === 'Moderate Stress' ? 'bg-yellow-500' :
              result?.level === 'High Stress' ? 'bg-orange-500' : 'bg-red-500'}`} 
            />
            <CardHeader>
              <CardTitle className="text-center text-2xl">Your Results</CardTitle>
              <CardDescription className="text-center">
                Assessment completed on {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <span className="text-5xl font-bold inline-block p-4 rounded-full bg-gray-100">
                  {result?.level === 'Low Stress' ? '😊' : 
                   result?.level === 'Mild Stress' ? '🙂' :
                   result?.level === 'Moderate Stress' ? '😐' :
                   result?.level === 'High Stress' ? '😥' : '😰'}
                </span>
                <h3 className="text-xl font-bold mt-4">{result?.level}</h3>
                <p className="mt-2 text-gray-600">{result?.message}</p>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-bold">Suggested next steps:</h4>
                <ul className="mt-3 space-y-2">
                  {result?.tips.map((tip, index) => (
                    <li key={index} className="flex">
                      <span className="text-green-600 mr-2">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={resetAssessment} 
                className="w-full"
              >
                Take Assessment Again
              </Button>
            </CardFooter>
          </Card>
          
          <div className="text-center text-sm text-gray-500">
            <p>Note: This assessment is for informational purposes only and is not a diagnostic tool.</p>
            <p className="mt-1">If you're experiencing severe distress, please seek professional help immediately.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;
