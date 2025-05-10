
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, ArrowLeft, PlayCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define resource categories and items
const resourceCategories = [
  {
    id: "stress",
    name: "Stress Relief",
    icon: "😌",
    resources: [
      {
        id: "stress1",
        title: "5-Minute Breathing Exercise",
        description: "A quick breathing technique to help calm your nervous system.",
        type: "article",
        content: `
          <h2>5-Minute Breathing Exercise</h2>
          <p>This simple breathing technique can help reduce stress and anxiety in just 5 minutes.</p>
          <h3>Instructions:</h3>
          <ol>
            <li>Find a comfortable seated position.</li>
            <li>Breathe in slowly through your nose for 4 counts.</li>
            <li>Hold your breath for 4 counts.</li>
            <li>Exhale slowly through your mouth for 6 counts.</li>
            <li>Repeat for 5 minutes.</li>
          </ol>
          <p>Practice this exercise daily, especially during stressful moments.</p>
        `,
      },
      {
        id: "stress2",
        title: "Progressive Muscle Relaxation",
        description: "Learn how to release tension from your body through progressive muscle relaxation.",
        type: "article",
        content: `
          <h2>Progressive Muscle Relaxation</h2>
          <p>Progressive Muscle Relaxation (PMR) is a technique that helps reduce anxiety and stress by tensing and then releasing different muscle groups.</p>
          <h3>Instructions:</h3>
          <ol>
            <li>Start by sitting or lying in a comfortable position.</li>
            <li>Begin with your feet. Tense the muscles in your feet by curling your toes and holding for 5 seconds.</li>
            <li>Release the tension and notice how your feet feel when relaxed. Stay in this relaxed state for 15 seconds.</li>
            <li>Move up to your calf muscles. Tense them by pulling your toes toward you while keeping your legs straight.</li>
            <li>Continue this pattern, working your way up your body: thighs, abdomen, chest, hands, arms, shoulders, neck, and face.</li>
          </ol>
          <p>Practice this exercise for 10-15 minutes daily for best results.</p>
        `,
      },
      {
        id: "stress3",
        title: "Guided Stress Relief Meditation",
        description: "A 10-minute guided meditation to help manage stress and promote relaxation.",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/z6X5oEIg6Ak",
      },
    ],
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    icon: "🧠",
    resources: [
      {
        id: "mindfulness1",
        title: "Introduction to Mindfulness",
        description: "Learn the basics of mindfulness practice and how it can improve mental health.",
        type: "article",
        content: `
          <h2>Introduction to Mindfulness</h2>
          <p>Mindfulness is the practice of paying attention to the present moment with openness, curiosity, and without judgment.</p>
          <h3>Key Principles:</h3>
          <ul>
            <li><strong>Present moment awareness:</strong> Focusing your attention on the here and now.</li>
            <li><strong>Non-judgment:</strong> Observing experiences without labeling them as good or bad.</li>
            <li><strong>Acceptance:</strong> Acknowledging your current experience without trying to change it.</li>
            <li><strong>Beginner's mind:</strong> Approaching experiences with curiosity, as if encountering them for the first time.</li>
          </ul>
          <h3>Benefits of Mindfulness:</h3>
          <ul>
            <li>Reduced stress and anxiety</li>
            <li>Improved focus and concentration</li>
            <li>Better emotional regulation</li>
            <li>Enhanced self-awareness</li>
            <li>Improved sleep quality</li>
          </ul>
          <p>Start with just 5 minutes of mindfulness practice daily, gradually increasing the duration as you become more comfortable.</p>
        `,
      },
      {
        id: "mindfulness2",
        title: "Mindful Eating Practice",
        description: "Transform your relationship with food through mindful eating techniques.",
        type: "article",
        content: `
          <h2>Mindful Eating Practice</h2>
          <p>Mindful eating is about using mindfulness to reach a state of full attention to your experiences, cravings, and physical cues when eating.</p>
          <h3>How to Practice Mindful Eating:</h3>
          <ol>
            <li><strong>Engage your senses:</strong> Notice the colors, smells, sounds, textures, and flavors of your food.</li>
            <li><strong>Eat slowly:</strong> Put down your utensils between bites and chew thoroughly.</li>
            <li><strong>Eliminate distractions:</strong> Turn off screens and eat at a table.</li>
            <li><strong>Listen to hunger cues:</strong> Eat when you're hungry and stop when you're full.</li>
            <li><strong>Express gratitude:</strong> Take a moment to appreciate where your food came from.</li>
          </ol>
          <p>Try practicing mindful eating with just one meal per day to start.</p>
        `,
      },
      {
        id: "mindfulness3",
        title: "10-Minute Body Scan Meditation",
        description: "A guided meditation to help you connect with your body and practice mindfulness.",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/ZToicYcHIOU",
      },
    ],
  },
  {
    id: "sleep",
    name: "Sleep Help",
    icon: "😴",
    resources: [
      {
        id: "sleep1",
        title: "Sleep Hygiene Tips",
        description: "Simple habits to improve your sleep quality and overall health.",
        type: "article",
        content: `
          <h2>Sleep Hygiene Tips</h2>
          <p>Good sleep hygiene refers to habits that help you have good nighttime sleep quality and full daytime alertness.</p>
          <h3>Key Recommendations:</h3>
          <ul>
            <li><strong>Consistent schedule:</strong> Go to bed and wake up at the same time every day.</li>
            <li><strong>Create a restful environment:</strong> Keep your bedroom quiet, dark, cool, and comfortable.</li>
            <li><strong>Limit screen time:</strong> Avoid screens (phones, tablets, computers) for at least 1 hour before bed.</li>
            <li><strong>Be mindful of food and drinks:</strong> Avoid caffeine, alcohol, and large meals close to bedtime.</li>
            <li><strong>Develop a bedtime routine:</strong> Create relaxing pre-sleep rituals like reading, gentle stretching, or meditation.</li>
            <li><strong>Limit naps:</strong> Short naps (20-30 minutes) are best, and avoid napping late in the day.</li>
            <li><strong>Get regular exercise:</strong> Regular physical activity can help you fall asleep faster and enjoy deeper sleep.</li>
          </ul>
          <p>If you struggle with persistent sleep problems despite good sleep hygiene, consider speaking with a healthcare provider.</p>
        `,
      },
      {
        id: "sleep2",
        title: "Evening Wind-Down Routine",
        description: "A relaxing routine to prepare your body and mind for restful sleep.",
        type: "article",
        content: `
          <h2>Evening Wind-Down Routine</h2>
          <p>A consistent evening routine signals to your brain that it's time to relax and prepare for sleep.</p>
          <h3>Suggested 30-Minute Wind-Down Routine:</h3>
          <ol>
            <li><strong>10 minutes:</strong> Light tidying (prepare for tomorrow, put things away)</li>
            <li><strong>5 minutes:</strong> Personal hygiene (brush teeth, wash face)</li>
            <li><strong>5 minutes:</strong> Relaxation practice (deep breathing or gentle stretching)</li>
            <li><strong>10 minutes:</strong> Screen-free relaxing activity (reading a physical book, journaling, or meditating)</li>
          </ol>
          <h3>Tips for Success:</h3>
          <ul>
            <li>Dim the lights during your routine to help trigger melatonin production</li>
            <li>Keep devices out of the bedroom or in "do not disturb" mode</li>
            <li>Make your bedroom a sanctuary for sleep (comfortable bedding, appropriate temperature)</li>
            <li>Use the same routine consistently to build a strong sleep association</li>
          </ul>
        `,
      },
      {
        id: "sleep3",
        title: "Bedtime Deep Relaxation",
        description: "A guided meditation to help you release tension and prepare for sleep.",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/1aekdOEcmxM",
      },
    ],
  },
  {
    id: "depression",
    name: "Depression Support",
    icon: "💙",
    resources: [
      {
        id: "depression1",
        title: "Understanding Depression",
        description: "Learn about depression symptoms, causes, and treatment options.",
        type: "article",
        content: `
          <h2>Understanding Depression</h2>
          <p>Depression (major depressive disorder) is a common but serious mood disorder that affects how you feel, think, and handle daily activities.</p>
          <h3>Common Symptoms:</h3>
          <ul>
            <li>Persistent sad, anxious, or "empty" mood</li>
            <li>Loss of interest in activities once enjoyed</li>
            <li>Feelings of hopelessness or pessimism</li>
            <li>Decreased energy, fatigue</li>
            <li>Difficulty concentrating, remembering, or making decisions</li>
            <li>Sleep disturbances (insomnia, early-morning awakening, or oversleeping)</li>
            <li>Changes in appetite or weight</li>
            <li>Thoughts of death or suicide, or suicide attempts</li>
          </ul>
          <h3>Treatment Options:</h3>
          <ul>
            <li><strong>Therapy:</strong> Cognitive-behavioral therapy (CBT), interpersonal therapy (IPT), and other talk therapies</li>
            <li><strong>Medication:</strong> Antidepressants prescribed by a healthcare provider</li>
            <li><strong>Lifestyle changes:</strong> Regular exercise, healthy diet, adequate sleep</li>
            <li><strong>Social support:</strong> Connecting with family, friends, or support groups</li>
          </ul>
          <p><strong>Important:</strong> If you're experiencing symptoms of depression, please seek help from a mental health professional. Depression is treatable, and recovery is possible.</p>
        `,
      },
      {
        id: "depression2",
        title: "Daily Habits to Support Mental Health",
        description: "Small actions you can take every day to help manage depression symptoms.",
        type: "article",
        content: `
          <h2>Daily Habits to Support Mental Health</h2>
          <p>When dealing with depression, small daily actions can help support your mental health journey alongside professional treatment.</p>
          <h3>Helpful Daily Practices:</h3>
          <ul>
            <li><strong>Morning sunlight:</strong> Expose yourself to natural light within an hour of waking up.</li>
            <li><strong>Physical movement:</strong> Even a 10-minute walk can boost mood and energy.</li>
            <li><strong>Consistent meals:</strong> Eating regularly helps stabilize blood sugar and mood.</li>
            <li><strong>Stay hydrated:</strong> Dehydration can worsen fatigue and brain fog.</li>
            <li><strong>Social connection:</strong> Reach out to one person each day, even with a brief text.</li>
            <li><strong>Gratitude practice:</strong> Note three things you appreciate, no matter how small.</li>
            <li><strong>Achievable goals:</strong> Set and accomplish one small task daily.</li>
          </ul>
          <p>Remember that depression can make these actions feel difficult. Start small, be gentle with yourself, and recognize that some days will be harder than others. Any step forward, no matter how tiny, is progress.</p>
        `,
      },
      {
        id: "depression3",
        title: "Meditation for Depression",
        description: "A gentle guided practice to help during difficult emotional times.",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/2FGR-OspxMU",
      },
    ],
  },
];

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState(resourceCategories[0].id);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  
  const category = resourceCategories.find(cat => cat.id === selectedCategory) || resourceCategories[0];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 pb-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Mental Wellness Resources</h1>
      
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          {resourceCategories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="flex items-center space-x-1">
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {resourceCategories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cat.resources.map((resource) => (
                <Card key={resource.id} className="card-hover-effect shadow-sm border-mindease-blue/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <div className="bg-mindease-blue/20 p-2 rounded-lg">
                        {resource.type === 'article' ? (
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        ) : (
                          <PlayCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{resource.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                      </div>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4"
                          onClick={() => setSelectedResource(resource)}
                        >
                          {resource.type === 'article' ? 'Read Article' : 'Watch Video'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>{resource.title}</DialogTitle>
                          <DialogDescription>{resource.description}</DialogDescription>
                        </DialogHeader>
                        
                        {resource.type === 'article' ? (
                          <div className="mt-4 prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: resource.content }} />
                        ) : (
                          <div className="aspect-video w-full mt-4">
                            <iframe 
                              src={resource.videoUrl}
                              className="w-full h-full rounded-md"
                              title={resource.title}
                              allowFullScreen
                            ></iframe>
                          </div>
                        )}
                        
                        <DialogFooter>
                          <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <Card className="bg-gradient-to-r from-mindease-purple/20 to-mindease-blue/20 shadow-sm border-0 mb-8">
        <CardHeader>
          <CardTitle>Need immediate help?</CardTitle>
          <CardDescription>If you're experiencing a mental health crisis, please reach out for support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-bold">National Crisis Line</h3>
              <p className="text-sm text-gray-600 mt-1">Available 24/7 for emotional support</p>
              <p className="font-medium mt-2">988</p>
              <Button variant="outline" size="sm" className="mt-2 flex items-center">
                <ExternalLink className="h-3 w-3 mr-1" />
                Visit Website
              </Button>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-bold">Crisis Text Line</h3>
              <p className="text-sm text-gray-600 mt-1">Text support for any type of crisis</p>
              <p className="font-medium mt-2">Text HOME to 741741</p>
              <Button variant="outline" size="sm" className="mt-2 flex items-center">
                <ExternalLink className="h-3 w-3 mr-1" />
                Visit Website
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;
