import { useState } from 'react';
// FIX 1: Change 'motion/react' to the correct installed package name
import { motion } from 'framer-motion'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import { 
    Camera, 
    Clock, 
    DollarSign, 
    Users, 
    CheckCircle, 
    Upload,
    MapPin,
    Calendar
} from 'lucide-react';
import { mockProjects, mockDailyReports } from '../../lib/mockData';
// FIX 2: Import the real API submission function
import { submitDPR } from '../../lib/aiServices'; 


export function ExecutorDashboard() {
    const [formData, setFormData] = useState({
        scenes_shot_actual: '',
        scenes_shot_expected: '12',
        delay_hours: '',
        cost_variance_pct: '',
        notes: '',
        weather_conditions: 'Clear',
        crew_attendance: '',
        receipt_image: null as File | null
    });

    // FIX 3: Change to async function to await the API call
    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault();
        
        // 1. Prepare data (convert strings to numbers for Python/AI model)
        const submissionData = {
            project_id: mockProjects[0]._id, // Use the ID of the current project (from mockData)
            scenes_shot_actual: parseInt(formData.scenes_shot_actual) || 0,
            scenes_shot_expected: parseInt(formData.scenes_shot_expected) || 12,
            delay_hours: parseFloat(formData.delay_hours) || 0,
            cost_variance_pct: parseFloat(formData.cost_variance_pct) || 0,
            crew_attendance: parseFloat(formData.crew_attendance) || 100,
            weather_conditions: formData.weather_conditions,
            notes: formData.notes
            // receipt_image is handled separately; we send the rest as JSON
        };
        
        // 2. Call the actual backend API submission function
        const success = await submitDPR(submissionData);

        if (success) {
            // Success message: MongoDB write successful
            toast.success('Daily Production Report submitted successfully! MongoDB collections are created.');
        } else {
            // Failure message: Check console for Python traceback
            toast.error('Submission failed. Check the Flask terminal for database connection errors!');
        }

        // Reset form
        setFormData({
            scenes_shot_actual: '',
            scenes_shot_expected: '12',
            delay_hours: '',
            cost_variance_pct: '',
            notes: '',
            weather_conditions: 'Clear',
            crew_attendance: '',
            receipt_image: null
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, receipt_image: file }));
            toast.success('Receipt uploaded successfully!');
        }
    };

    const currentProject = mockProjects[0]; // Neon Horizon
    const todayProgress = {
        scenes_planned: 12,
        scenes_completed: parseInt(formData.scenes_shot_actual) || 0,
        time_elapsed: 8,
        budget_used: 85.2
    };

    const callSheet = {
        date: '2024-10-04',
        location: 'Studio A - Main Floor',
        call_time: '06:00 AM',
        wrap_time: '18:00 PM',
        scenes: ['Scene 15: Hero Introduction', 'Scene 16: Chase Sequence', 'Scene 17: Dialogue'],
        cast: ['Raj Patel (Lead)', 'Priya Sharma (Supporting)', 'Extras (15)'],
        crew_count: 45
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-3xl text-cyan-400 mb-2">FIELD OPERATIONS</h1>
                <p className="text-slate-400">Real-time production data entry and monitoring</p>
                <Badge className="mt-2 bg-cyan-900 text-cyan-400 border-cyan-500">
                    Project: {currentProject.title}
                </Badge>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <Card className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                        <Camera className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                        <div className="text-2xl text-cyan-400 font-mono">{todayProgress.scenes_completed}</div>
                        <div className="text-xs text-slate-400">Scenes Shot</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                        <Clock className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                        <div className="text-2xl text-amber-400 font-mono">{todayProgress.time_elapsed}h</div>
                        <div className="text-xs text-slate-400">Time Elapsed</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                        <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
                        <div className="text-2xl text-green-400 font-mono">{todayProgress.budget_used}%</div>
                        <div className="text-xs text-slate-400">Budget Used</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                        <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl text-purple-400 font-mono">{callSheet.crew_count}</div>
                        <div className="text-xs text-slate-400">Crew Present</div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Progress Tracking */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-cyan-400">TODAY'S PROGRESS</CardTitle>
                        <CardDescription className="text-slate-400">
                            Real-time tracking for {callSheet.date}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-slate-400">Scenes Completion</span>
                                <span className="text-white font-mono">
                                    {todayProgress.scenes_completed}/{todayProgress.scenes_planned}
                                </span>
                            </div>
                            <Progress 
                                value={(todayProgress.scenes_completed / todayProgress.scenes_planned) * 100} 
                                className="h-3"
                            />
                        </div>
                        
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-slate-400">Time Progress</span>
                                <span className="text-white font-mono">{todayProgress.time_elapsed}/12 hours</span>
                            </div>
                            <Progress 
                                value={(todayProgress.time_elapsed / 12) * 100} 
                                className="h-3"
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Call Sheet */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="bg-slate-900/50 border-slate-700 h-full">
                        <CardHeader>
                            <CardTitle className="text-cyan-400 flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                CALL SHEET
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    <span className="text-white">{callSheet.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Call Time:</span>
                                    <span className="text-amber-400 font-mono">{callSheet.call_time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Wrap Time:</span>
                                    <span className="text-amber-400 font-mono">{callSheet.wrap_time}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">Today's Scenes</h4>
                                <div className="space-y-1">
                                    {callSheet.scenes.map((scene, index) => (
                                        <div key={index} className="text-sm text-slate-300 flex items-center gap-2">
                                            <CheckCircle className="h-3 w-3 text-green-400" />
                                            {scene}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">Cast</h4>
                                <div className="space-y-1">
                                    {callSheet.cast.map((member, index) => (
                                        <div key={index} className="text-sm text-slate-300">
                                            {member}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* DPR Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="bg-slate-900/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-cyan-400">DAILY PRODUCTION REPORT</CardTitle>
                            <CardDescription className="text-slate-400">
                                Submit real-time production data
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="scenes-actual" className="text-slate-300">Scenes Shot</Label>
                                        <Input
                                            id="scenes-actual"
                                            type="number"
                                            value={formData.scenes_shot_actual}
                                            onChange={(e) => setFormData(prev => ({ ...prev, scenes_shot_actual: e.target.value }))}
                                            className="bg-slate-800 border-slate-600 text-white text-center text-xl font-mono"
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="crew-attendance" className="text-slate-300">Crew %</Label>
                                        <Input
                                            id="crew-attendance"
                                            type="number"
                                            value={formData.crew_attendance}
                                            onChange={(e) => setFormData(prev => ({ ...prev, crew_attendance: e.target.value }))}
                                            className="bg-slate-800 border-slate-600 text-white text-center text-xl font-mono"
                                            placeholder="100"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="delay-hours" className="text-slate-300">Delay (Hours)</Label>
                                        <Input
                                            id="delay-hours"
                                            type="number"
                                            step="0.5"
                                            value={formData.delay_hours}
                                            onChange={(e) => setFormData(prev => ({ ...prev, delay_hours: e.target.value }))}
                                            className="bg-slate-800 border-slate-600 text-white text-center font-mono"
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="cost-variance" className="text-slate-300">Cost Var %</Label>
                                        <Input
                                            id="cost-variance"
                                            type="number"
                                            step="0.1"
                                            value={formData.cost_variance_pct}
                                            onChange={(e) => setFormData(prev => ({ ...prev, cost_variance_pct: e.target.value }))}
                                            className="bg-slate-800 border-slate-600 text-white text-center font-mono"
                                            placeholder="0.0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="weather" className="text-slate-300">Weather</Label>
                                    <Select 
                                        value={formData.weather_conditions} 
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, weather_conditions: value }))}
                                    >
                                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Clear">Clear</SelectItem>
                                            <SelectItem value="Cloudy">Cloudy</SelectItem>
                                            <SelectItem value="Light Rain">Light Rain</SelectItem>
                                            <SelectItem value="Heavy Rain">Heavy Rain</SelectItem>
                                            <SelectItem value="Fog">Fog</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="notes" className="text-slate-300">Production Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                        className="bg-slate-800 border-slate-600 text-white"
                                        placeholder="Any issues, achievements, or important observations..."
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="receipt" className="text-slate-300">Receipt Upload</Label>
                                    <div className="mt-1">
                                        <Input
                                            id="receipt"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="bg-slate-800 border-slate-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                                        />
                                    </div>
                                    {formData.receipt_image && (
                                        <div className="mt-2 text-sm text-green-400 flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            {formData.receipt_image.name} uploaded
                                        </div>
                                    )}
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-lg py-6"
                                >
                                    <Upload className="mr-2 h-5 w-5" />
                                    SUBMIT DAILY REPORT
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Reports */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-cyan-400">RECENT REPORTS</CardTitle>
                        <CardDescription className="text-slate-400">
                            Last 7 days of production data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mockDailyReports.map((report) => (
                                <div key={report._id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-cyan-400 font-mono">{report.date}</div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-slate-400">Scenes:</span>
                                            <span className="text-white font-mono">{report.scenes_shot_actual}/{report.scenes_shot_expected}</span>
                                            
                                            <span className="text-slate-400">Delay:</span>
                                            <span className={`font-mono ${report.delay_hours > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                                {report.delay_hours > 0 ? '+' : ''}{report.delay_hours}h
                                            </span>
                                            
                                            <span className="text-slate-400">Weather:</span>
                                            <span className="text-white">{report.weather_conditions}</span>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`border-${report.delay_hours > 0 ? 'red' : 'green'}-500 text-${report.delay_hours > 0 ? 'red' : 'green'}-400`}>
                                        {report.delay_hours > 0 ? 'Delayed' : 'On Time'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}