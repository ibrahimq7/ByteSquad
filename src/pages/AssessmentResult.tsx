
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Activity, Play } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '@/context/DataContext';
import { format } from 'date-fns';

const AssessmentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { assessmentResults } = useData();
  
  const result = location.state?.result;
  
  // If no result is passed, redirect to assessment page
  useEffect(() => {
    if (!result) {
      navigate('/assessment');
    }
  }, [result, navigate]);

  // Prepare historical data for charts
  const getChartData = () => {
    return assessmentResults.slice(-10).map(result => ({
      date: format(new Date(result.timestamp), 'MMM d'),
      score: result.score,
      level: result.level
    }));
  };

  // Calculate normalized sub-scores for anxiety, stress, depression
  const getDetailedScores = () => {
    if (!result) return [];
    
    // These are illustrative calculations - in a real app, you'd have actual subscores
    const anxiety = Math.min(100, (result.score / 21) * 100 * 0.9);
    const stress = Math.min(100, (result.score / 21) * 100 * 1.1);
    const depression = Math.min(100, (result.score / 21) * 100 * 0.85);
    
    return [
      { name: 'Anxiety', value: Math.round(anxiety) },
      { name: 'Stress', value: Math.round(stress) },
      { name: 'Depression', value: Math.round(depression) }
    ];
  };

  const handleStartTask = () => {
    navigate('/daily-task', { state: { task: result?.recommendedTask } });
  };

  if (!result) return null;

  return (
    <div className={cn("px-4 py-6 pb-20", theme === 'dark' ? 'text-gray-100' : '')}>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className={cn("mr-2", theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : '')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Mental Health Report</h1>
      </div>
      
      {/* Result Summary Card */}
      <Card className={cn("mb-6 shadow-md", 
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-mindease-blue/20')}>
        <div className={`h-2 ${result.level === 'Low Stress' ? 'bg-green-500' : 
          result.level === 'Mild Stress' ? 'bg-blue-500' :
          result.level === 'Moderate Stress' ? 'bg-yellow-500' :
          result.level === 'High Stress' ? 'bg-orange-500' : 'bg-red-500'}`} 
        />
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className={theme === 'dark' ? 'text-white' : ''}>{result.level}</CardTitle>
          <span className={cn("text-3xl", theme === 'dark' ? 'text-gray-100' : '')}>
            {result.level === 'Low Stress' ? '😊' : 
             result.level === 'Mild Stress' ? '🙂' :
             result.level === 'Moderate Stress' ? '😐' :
             result.level === 'High Stress' ? '😥' : '😰'}
          </span>
        </CardHeader>
        <CardContent>
          <p className={cn("mb-4", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>{result.message}</p>
          
          <div className={cn("p-3 rounded-md mb-4", theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className={cn("font-semibold", theme === 'dark' ? 'text-white' : '')}>
                Your Score
              </h3>
            </div>
            <p className={cn("text-lg font-bold", theme === 'dark' ? 'text-white' : '')}>
              {result.score} <span className={cn("text-sm font-normal", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                out of {21} {/* 7 questions × 3 max points */}
              </span>
            </p>
          </div>
          
          <h3 className={cn("font-semibold mb-2", theme === 'dark' ? 'text-white' : '')}>Suggested next steps:</h3>
          <ul className="space-y-1 mb-6">
            {result.tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-600 mr-2 mt-0.5">✓</span>
                <span className={theme === 'dark' ? 'text-gray-300' : ''}>{tip}</span>
              </li>
            ))}
          </ul>
          
          {/* Recommended Task */}
          {result.recommendedTask && (
            <div className={cn("p-4 rounded-lg mb-4 border",
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-mindease-purple/10 border-mindease-purple/20')}>
              <h3 className={cn("font-semibold mb-2", theme === 'dark' ? 'text-white' : '')}>
                Personalized Task For You
              </h3>
              <p className={cn("font-medium", theme === 'dark' ? 'text-white' : '')}>
                {result.recommendedTask.title}
              </p>
              <p className={cn("text-sm mb-4", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                {result.recommendedTask.description}
              </p>
              <Button onClick={handleStartTask} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Start This Activity
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Historical Trend Chart */}
      <Card className={cn("mb-6 shadow-md", 
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-mindease-green/20')}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Your Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn("h-64", theme === 'dark' ? 'text-gray-200' : '')}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#555' : '#eee'} />
                <XAxis 
                  dataKey="date" 
                  stroke={theme === 'dark' ? '#aaa' : '#888'} 
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#aaa' : '#888'} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#333' : '#fff',
                    color: theme === 'dark' ? '#eee' : '#333',
                    border: `1px solid ${theme === 'dark' ? '#555' : '#ddd'}`
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  name="Mental Health Score"
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Detailed Score Breakdown */}
      <Card className={cn("mb-6 shadow-md", 
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-mindease-peach/20')}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Breakdown By Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn("h-64", theme === 'dark' ? 'text-gray-200' : '')}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getDetailedScores()}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#555' : '#eee'} />
                <XAxis 
                  dataKey="name"
                  stroke={theme === 'dark' ? '#aaa' : '#888'} 
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#aaa' : '#888'}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Score']}
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#333' : '#fff',
                    color: theme === 'dark' ? '#eee' : '#333',
                    border: `1px solid ${theme === 'dark' ? '#555' : '#ddd'}`
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Percentage Score"
                  fill={theme === 'dark' ? '#6366f1' : '#8884d8'}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className={cn("text-sm mt-4 text-center",
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            Note: These scores are approximate estimates based on your responses.
          </p>
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex flex-col space-y-3">
        <Button 
          onClick={() => navigate('/daily-task', { state: { task: result.recommendedTask } })}
        >
          Begin Recommended Task
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/assessment-history')}
          className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}
        >
          View History
        </Button>
      </div>
    </div>
  );
};

export default AssessmentResult;
