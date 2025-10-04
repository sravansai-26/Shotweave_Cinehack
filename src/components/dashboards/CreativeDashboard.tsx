import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Film, 
  FileText, 
  Calendar, 
  Users, 
  MapPin, 
  Camera,
  Clock,
  Eye,
  Sparkles
} from 'lucide-react';
import { mockProjects } from '../../lib/mockData';
import { processScriptBreakdown } from '../../lib/aiServices';
import { ScriptBreakdown } from '../../types';

export function CreativeDashboard() {
  const [scriptText, setScriptText] = useState('');
  const [breakdown, setBreakdown] = useState<ScriptBreakdown | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleScriptAnalysis = async () => {
    if (!scriptText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = processScriptBreakdown(scriptText);
    setBreakdown(result);
    setIsAnalyzing(false);
  };

  const currentProject = mockProjects[0]; // Neon Horizon

  const creativeAssets = [
    {
      type: 'Script',
      title: 'Final Draft v3.2',
      status: 'Approved',
      lastModified: '2024-10-01',
      pages: 127
    },
    {
      type: 'Storyboard',
      title: 'Action Sequences',
      status: 'In Review',
      lastModified: '2024-10-02',
      scenes: 23
    },
    {
      type: 'Shot List',
      title: 'Day 15-20',
      status: 'Draft',
      lastModified: '2024-10-03',
      shots: 156
    }
  ];

  const schedulePreview = [
    {
      date: '2024-10-04',
      location: 'Studio A',
      scenes: ['Scene 15: Hero Introduction', 'Scene 16: Chase Sequence'],
      duration: '8 hours',
      cast: ['Raj Patel', 'Priya Sharma']
    },
    {
      date: '2024-10-05',
      location: 'Outdoor Terrace',
      scenes: ['Scene 17: Dialogue', 'Scene 18: Confrontation'],
      duration: '6 hours',
      cast: ['Raj Patel', 'Supporting Cast']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl text-cyan-400 mb-2">CREATIVE CONTROL</h1>
          <p className="text-slate-400">Script management and creative oversight</p>
          <Badge className="mt-2 bg-purple-900 text-purple-400 border-purple-500">
            Project: {currentProject.title}
          </Badge>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Script Analysis
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-cyan-400">AI-Powered Script Breakdown</DialogTitle>
              <DialogDescription className="text-slate-400">
                Upload your script for automated location and character analysis
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Paste your script text here..."
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white min-h-[200px]"
              />
              <Button 
                onClick={handleScriptAnalysis}
                disabled={!scriptText.trim() || isAnalyzing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isAnalyzing ? 'Analyzing Script...' : 'Analyze Script'}
              </Button>
              
              {breakdown && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-4"
                >
                  <h3 className="text-white font-medium">Analysis Results</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <MapPin className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                          <div className="text-2xl text-cyan-400 font-mono">{breakdown.location_count}</div>
                          <div className="text-sm text-slate-400">Locations</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <Users className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                          <div className="text-2xl text-amber-400 font-mono">{breakdown.character_count}</div>
                          <div className="text-sm text-slate-400">Characters</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <Calendar className="h-8 w-8 text-green-400 mx-auto mb-2" />
                          <div className="text-2xl text-green-400 font-mono">{breakdown.estimated_shoot_days}</div>
                          <div className="text-sm text-slate-400">Est. Shoot Days</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                          <div className="text-2xl text-purple-400 font-mono">{breakdown.complexity_score}</div>
                          <div className="text-sm text-slate-400">Complexity Score</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-white font-medium">Detected Locations:</h4>
                    <div className="flex flex-wrap gap-2">
                      {breakdown.locations.map((location, index) => (
                        <Badge key={index} variant="outline" className="border-cyan-500 text-cyan-400">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-white font-medium">Detected Characters:</h4>
                    <div className="flex flex-wrap gap-2">
                      {breakdown.characters.map((character, index) => (
                        <Badge key={index} variant="outline" className="border-amber-500 text-amber-400">
                          {character}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <Tabs defaultValue="assets" className="space-y-6">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="assets" className="data-[state=active]:bg-purple-600">Creative Assets</TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-purple-600">Schedule Review</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-6">
          {/* Project Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-400">PROJECT PROGRESS</CardTitle>
                <CardDescription className="text-slate-400">
                  Creative milestones for {currentProject.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-400">Script Development</span>
                    <span className="text-green-400 font-mono">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-400">Pre-visualization</span>
                    <span className="text-amber-400 font-mono">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-400">Shot Planning</span>
                    <span className="text-cyan-400 font-mono">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-400">Principal Photography</span>
                    <span className="text-red-400 font-mono">30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Creative Assets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-400">CREATIVE ASSETS</CardTitle>
                <CardDescription className="text-slate-400">
                  Scripts, storyboards, and creative documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {creativeAssets.map((asset, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {asset.type === 'Script' && <FileText className="h-6 w-6 text-cyan-400" />}
                        {asset.type === 'Storyboard' && <Film className="h-6 w-6 text-purple-400" />}
                        {asset.type === 'Shot List' && <Camera className="h-6 w-6 text-amber-400" />}
                        <div>
                          <h3 className="text-white font-medium">{asset.title}</h3>
                          <p className="text-slate-400 text-sm">{asset.type}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Badge 
                          variant="outline" 
                          className={`${
                            asset.status === 'Approved' ? 'border-green-500 text-green-400' :
                            asset.status === 'In Review' ? 'border-amber-500 text-amber-400' :
                            'border-slate-500 text-slate-400'
                          }`}
                        >
                          {asset.status}
                        </Badge>
                        
                        <div className="text-sm text-slate-400">
                          Modified: {asset.lastModified}
                        </div>
                        
                        {asset.pages && (
                          <div className="text-sm text-slate-300">
                            {asset.pages} pages
                          </div>
                        )}
                        {asset.scenes && (
                          <div className="text-sm text-slate-300">
                            {asset.scenes} scenes
                          </div>
                        )}
                        {asset.shots && (
                          <div className="text-sm text-slate-300">
                            {asset.shots} shots
                          </div>
                        )}
                      </div>
                      
                      <Button size="sm" variant="outline" className="w-full mt-3 border-purple-500 text-purple-400">
                        <Eye className="mr-2 h-3 w-3" />
                        Review
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          {/* Schedule Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  UPCOMING SCHEDULE
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Review and approve upcoming shoots
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schedulePreview.map((day, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="text-purple-400 font-mono text-lg">{day.date}</div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            {day.location}
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Clock className="h-4 w-4 text-slate-400" />
                            {day.duration}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-purple-500 text-purple-400">
                          Review
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-white text-sm font-medium mb-1">Scenes:</h4>
                          <div className="flex flex-wrap gap-2">
                            {day.scenes.map((scene, sceneIndex) => (
                              <Badge key={sceneIndex} variant="outline" className="border-cyan-500 text-cyan-400 text-xs">
                                {scene}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-white text-sm font-medium mb-1">Cast:</h4>
                          <div className="flex flex-wrap gap-2">
                            {day.cast.map((actor, actorIndex) => (
                              <Badge key={actorIndex} variant="outline" className="border-amber-500 text-amber-400 text-xs">
                                {actor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}