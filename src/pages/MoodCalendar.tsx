
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const MoodCalendar = () => {
  const navigate = useNavigate();
  const { moodEntries, getMoodByDate } = useData();
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
  
  return (
    <div className="px-4 py-6 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Mood Calendar</h1>
      </div>
      
      <Card className="mb-6 shadow-sm">
        <CardContent className="pt-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            className="border rounded-md p-3"
            modifiers={{
              booked: (date) => 
                moodDates.some(mood => 
                  mood.getFullYear() === date.getFullYear() && 
                  mood.getMonth() === date.getMonth() && 
                  mood.getDate() === date.getDate()
                )
            }}
            modifiersStyles={{
              booked: { fontWeight: 'bold', backgroundColor: 'rgba(136, 132, 216, 0.1)' }
            }}
          />
        </CardContent>
      </Card>
      
      {selectedMood ? (
        <Card className="shadow-sm border-mindease-blue/20 animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="text-4xl mr-4">{getEmotionEmoji(selectedMood.mood)}</div>
              <div className="flex-1">
                <h3 className="font-medium capitalize">{selectedMood.mood}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(selectedMood.timestamp), 'MMMM d, yyyy • h:mm a')}
                </p>
                {selectedMood.note && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm">{selectedMood.note}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : date ? (
        <Card className="shadow-sm border-gray-200">
          <CardContent className="pt-6 text-center text-gray-500 py-8">
            <p>No mood entry for {format(date, 'MMMM d, yyyy')}</p>
            <Button 
              variant="outline" 
              className="mt-4"
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
