
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MoodCalendar = () => {
  const navigate = useNavigate();
  const { moodEntries, getMoodByDate } = useData();
  const { theme } = useTheme();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedMood, setSelectedMood] = useState(date ? getMoodByDate(date) : undefined);
  
  const getEmotionEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😔';
      case 'anxious': return '😰';
      case 'neutral': return '😐';
      case 'angry': return '😠';
      default: return '';
    }
  };
  
  // Get all dates that have mood entries
  const moodDates = moodEntries.map(entry => {
    const date = new Date(entry.timestamp);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  });
  
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setSelectedMood(getMoodByDate(newDate));
    } else {
      setSelectedMood(undefined);
    }
  };

  // Prepare chart data - last 7 days of mood entries
  const getLast7DaysMoods = () => {
    const moodValues: { [key: string]: number } = {
      'happy': 5,
      'neutral': 3,
      'sad': 1,
      'anxious': 2,
      'angry': 0
    };
    
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date;
    });
    
    return last7Days.map(day => {
      const mood = getMoodByDate(day);
      return {
        date: format(day, 'EEE'),
        score: mood ? moodValues[mood.mood] || 3 : null
      };
    });
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
        <h1 className="text-2xl font-bold">Mood Calendar</h1>
      </div>
      
      <Card className={cn("mb-6 shadow-sm", 
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : '')}>
        <CardContent className="pt-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            className={cn("border rounded-md p-3", 
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : '')}
            modifiers={{
              booked: (date) => 
                moodDates.some(mood => 
                  mood.getFullYear() === date.getFullYear() && 
                  mood.getMonth() === date.getMonth() && 
                  mood.getDate() === date.getDate()
                )
            }}
            modifiersStyles={{
              booked: { fontWeight: 'bold', backgroundColor: theme === 'dark' ? 'rgba(136, 132, 216, 0.2)' : 'rgba(136, 132, 216, 0.1)' }
            }}
          />
        </CardContent>
      </Card>

      {/* Mood Trend Chart */}
      <Card className={cn("mb-6 shadow-sm", 
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-mindease-blue/20')}>
        <CardContent className="pt-6">
          <h3 className={cn("font-semibold mb-3", theme === 'dark' ? 'text-white' : '')}>
            Your Mood Trends (Last 7 Days)
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getLast7DaysMoods()}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#555' : '#eee'} />
                <XAxis 
                  dataKey="date" 
                  stroke={theme === 'dark' ? '#aaa' : '#888'} 
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#aaa' : '#888'}
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  tickFormatter={(value) => {
                    switch(value) {
                      case 5: return 'Happy';
                      case 4: return '';
                      case 3: return 'Neutral';
                      case 2: return 'Anxious';
                      case 1: return 'Sad';
                      case 0: return 'Angry';
                      default: return '';
                    }
                  }}
                />
                <Tooltip
                  formatter={(value) => {
                    if (value === 5) return ['Happy', 'Mood'];
                    if (value === 3) return ['Neutral', 'Mood'];
                    if (value === 2) return ['Anxious', 'Mood'];
                    if (value === 1) return ['Sad', 'Mood'];
                    if (value === 0) return ['Angry', 'Mood'];
                    return ['No entry', 'Mood'];
                  }}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#333' : '#fff',
                    color: theme === 'dark' ? '#eee' : '#333',
                    border: `1px solid ${theme === 'dark' ? '#555' : '#ddd'}`
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke={theme === 'dark' ? '#8884d8' : '#6366f1'}
                  strokeWidth={2}
                  connectNulls={true}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className={cn("text-xs text-center mt-2",
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            Tap on a day to see your mood details
          </p>
        </CardContent>
      </Card>
      
      {selectedMood ? (
        <Card className={cn("shadow-sm animate-fade-in",
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-mindease-blue/20')}>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="text-4xl mr-4">{getEmotionEmoji(selectedMood.mood)}</div>
              <div className="flex-1">
                <h3 className={cn("font-medium capitalize", theme === 'dark' ? 'text-white' : '')}>
                  {selectedMood.mood}
                </h3>
                <p className={cn("text-sm", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                  {format(new Date(selectedMood.timestamp), 'MMMM d, yyyy • h:mm a')}
                </p>
                {selectedMood.note && (
                  <div className={cn("mt-3 p-3 rounded-md", 
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
                    <p className={cn("text-sm", theme === 'dark' ? 'text-gray-300' : '')}>
                      {selectedMood.note}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : date ? (
        <Card className={cn("shadow-sm", 
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'border-gray-200')}>
          <CardContent className="pt-6 text-center py-8">
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}>
              No mood entry for {format(date, 'MMMM d, yyyy')}
            </p>
            <Button 
              variant="outline" 
              className={cn("mt-4", theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : '')}
              onClick={() => navigate('/mood')}
            >
              Add Mood Entry
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default MoodCalendar;
