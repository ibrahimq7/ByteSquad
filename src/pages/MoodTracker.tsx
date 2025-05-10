
import { useState } from "react";
import { BarChart, Calendar, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/context/DataContext";
import { format } from "date-fns";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line } from 'recharts';
import { Link } from "react-router-dom";

const moodOptions = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "sad", label: "Sad", emoji: "😔" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "angry", label: "Angry", emoji: "😠" },
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [timeRange, setTimeRange] = useState<"7days" | "30days">("7days");
  const { addMoodEntry, getRecentMoods } = useData();

  const recentMoods = getRecentMoods(timeRange === "7days" ? 7 : 30);
  
  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    await addMoodEntry({
      mood: selectedMood as any,
      note: note.trim() ? note : undefined
    });
    
    // Reset form
    setSelectedMood(null);
    setNote("");
  };
  
  // Format mood data for chart
  const moodValueMap: Record<string, number> = {
    happy: 5,
    neutral: 3,
    anxious: 2,
    sad: 1,
    angry: 0
  };

  const chartData = recentMoods.map(entry => ({
    date: format(new Date(entry.timestamp), 'MM/dd'),
    mood: entry.mood,
    value: moodValueMap[entry.mood],
    emoji: moodOptions.find(m => m.value === entry.mood)?.emoji
  }));

  return (
    <div className="px-4 py-6 pb-20">
      <h1 className="text-2xl font-bold mb-6">Mood Tracker</h1>
      
      <Tabs defaultValue="today" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Track</TabsTrigger>
          <TabsTrigger value="history">Trends</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today">
          <Card className="shadow-md border-mindease-blue/20">
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>Select the emoji that best represents your current mood</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`mood-item flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                      selectedMood === mood.value
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <span className="text-2xl mb-1">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Add a note (optional)</label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's contributing to your mood today?"
                  className="border-mindease-blue/20"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                disabled={!selectedMood}
                className="w-full"
              >
                Save Mood
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="shadow-md border-mindease-blue/20">
            <CardHeader>
              <CardTitle>Your Mood Trends</CardTitle>
              <CardDescription>Track patterns in your emotional wellbeing</CardDescription>
              
              <div className="flex space-x-2 mt-4">
                <Button 
                  variant={chartType === "bar" ? "default" : "outline"} 
                  size="sm" 
                  className="flex items-center"
                  onClick={() => setChartType("bar")}
                >
                  <BarChart className="h-4 w-4 mr-1" />
                  Bar Chart
                </Button>
                <Button 
                  variant={chartType === "line" ? "default" : "outline"} 
                  size="sm" 
                  className="flex items-center"
                  onClick={() => setChartType("line")}
                >
                  <LineChart className="h-4 w-4 mr-1" />
                  Line Chart
                </Button>
              </div>
              
              <div className="flex space-x-2 mt-2">
                <Button 
                  variant={timeRange === "7days" ? "default" : "outline"} 
                  size="sm" 
                  className="flex items-center"
                  onClick={() => setTimeRange("7days")}
                >
                  Last 7 Days
                </Button>
                <Button 
                  variant={timeRange === "30days" ? "default" : "outline"} 
                  size="sm" 
                  className="flex items-center"
                  onClick={() => setTimeRange("30days")}
                >
                  Last 30 Days
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentMoods.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No mood entries yet. Start tracking your mood daily!</p>
                </div>
              ) : (
                <>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "bar" ? (
                        <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="date" />
                          <YAxis 
                            domain={[0, 5]}
                            ticks={[0, 1, 2, 3, 4, 5]} 
                            tickFormatter={(value) => {
                              const moodLabels: Record<number, string> = {
                                0: "Angry",
                                1: "Sad",
                                2: "Anxious",
                                3: "Neutral",
                                5: "Happy"
                              };
                              return moodLabels[value] || '';
                            }}
                          />
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-2 border rounded shadow-sm">
                                    <p className="font-medium">
                                      {payload[0].payload.emoji} {payload[0].payload.mood}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                      {payload[0].payload.date}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar 
                            dataKey="value" 
                            fill="#8884d8" 
                            radius={[4, 4, 0, 0]}
                          />
                        </RechartsBarChart>
                      ) : (
                        <RechartsLineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="date" />
                          <YAxis 
                            domain={[0, 5]}
                            ticks={[0, 1, 2, 3, 4, 5]} 
                            tickFormatter={(value) => {
                              const moodLabels: Record<number, string> = {
                                0: "Angry",
                                1: "Sad",
                                2: "Anxious",
                                3: "Neutral",
                                5: "Happy"
                              };
                              return moodLabels[value] || '';
                            }}
                          />
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-2 border rounded shadow-sm">
                                    <p className="font-medium">
                                      {payload[0].payload.emoji} {payload[0].payload.mood}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                      {payload[0].payload.date}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                            dot={{ fill: "#8884d8", r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </RechartsLineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-2 mt-6">
                    <h4 className="font-medium text-sm">Recent Entries</h4>
                    <div className="space-y-3">
                      {recentMoods.slice().reverse().slice(0, 5).map((entry) => {
                        const emoji = moodOptions.find(m => m.value === entry.mood)?.emoji;
                        return (
                          <div key={entry.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                            <div className="text-2xl mr-3">{emoji}</div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium capitalize">{entry.mood}</p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                                </p>
                              </div>
                              {entry.note && (
                                <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card className="shadow-md border-mindease-blue/20">
            <CardHeader>
              <CardTitle>Mood Calendar</CardTitle>
              <CardDescription>View your mood history by date</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simplified calendar preview since we'll create a dedicated page for it */}
              <div className="border rounded-md p-4 text-center">
                <Calendar className="h-16 w-16 mx-auto text-gray-600" />
                <p className="mt-4">View your complete mood history organized by date</p>
                <Link to="/mood/calendar">
                  <Button className="mt-4">Open Calendar View</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MoodTracker;
