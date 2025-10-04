import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar, MapPin, Users, Star, Phone, Mail, Plus, Search } from 'lucide-react';
import { mockVendors, mockProjects } from '../../lib/mockData';
import { calculateLVR } from '../../lib/aiServices';

export function ManagerDashboard() {
  const [selectedVendor, setSelectedVendor] = useState(mockVendors[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.service_category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.service_category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(mockVendors.map(v => v.service_category))];

  const getLVRColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  const upcomingSchedule = [
    { date: '2024-10-04', time: '06:00', location: 'Studio A', scenes: ['Scene 15', 'Scene 16'], crew: 45 },
    { date: '2024-10-04', time: '14:00', location: 'Outdoor Terrace', scenes: ['Scene 17'], crew: 32 },
    { date: '2024-10-05', time: '08:00', location: 'Car Interior', scenes: ['Scene 18', 'Scene 19'], crew: 28 },
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
          <h1 className="text-3xl text-cyan-400 mb-2">LOGISTICS COMMAND</h1>
          <p className="text-slate-400">Production scheduling and vendor management</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-cyan-400">Add New Vendor</DialogTitle>
              <DialogDescription className="text-slate-400">
                Register a new vendor for production services
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="vendor-name" className="text-slate-300">Vendor Name</Label>
                <Input id="vendor-name" className="bg-slate-800 border-slate-600 text-white" />
              </div>
              <div>
                <Label htmlFor="vendor-category" className="text-slate-300">Service Category</Label>
                <Select>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vendor-contact" className="text-slate-300">Contact Details</Label>
                <Textarea id="vendor-contact" className="bg-slate-800 border-slate-600 text-white" 
                         placeholder="Phone, email, address..." />
              </div>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700">Register Vendor</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="schedule" className="data-[state=active]:bg-cyan-600">Schedule</TabsTrigger>
          <TabsTrigger value="vendors" className="data-[state=active]:bg-cyan-600">LVR System</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  PRODUCTION SCHEDULE
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Upcoming shoots and crew assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSchedule.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-cyan-400 font-mono text-sm">{item.date}</div>
                          <div className="text-amber-400 font-mono text-lg">{item.time}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-white">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            {item.location}
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Users className="h-4 w-4 text-slate-400" />
                            {item.crew} crew members
                          </div>
                          <div className="text-sm text-slate-400">
                            Scenes: {item.scenes.join(', ')}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-cyan-500 text-cyan-400">
                        Manage
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          {/* Vendor Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">VENDOR SEARCH & FILTER</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search vendors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* LVR Vendor Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">LOCALIZED VENDOR RATING (LVR)</CardTitle>
                <CardDescription className="text-slate-400">
                  AI-powered vendor selection based on price, reliability, and quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVendors.map((vendor, index) => (
                    <motion.div
                      key={vendor._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      onClick={() => setSelectedVendor(vendor)}
                      className={`p-6 rounded-lg cursor-pointer transition-all border ${
                        selectedVendor._id === vendor._id
                          ? 'bg-cyan-900/30 border-cyan-500'
                          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg text-white font-medium">{vendor.name}</h3>
                          <div className={`text-2xl font-mono ${getLVRColor(vendor.lvr_score)}`}>
                            {vendor.lvr_score}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Badge variant="outline" className="border-amber-500 text-amber-400">
                            {vendor.service_category}
                          </Badge>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Avg Price:</span>
                            <span className="text-green-400 font-mono">₹{vendor.base_price_avg.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Reliability:</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-amber-400 fill-current" />
                              <span className="text-white font-mono">
                                {(vendor.reliability_history.reduce((sum, h) => sum + h.rating, 0) / vendor.reliability_history.length).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Phone className="h-3 w-3" />
                            {vendor.contact_info.phone}
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Mail className="h-3 w-3" />
                            {vendor.contact_info.email}
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                          size="sm"
                        >
                          Select Vendor
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Selected Vendor Details */}
          {selectedVendor && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400">VENDOR DETAILS: {selectedVendor.name}</CardTitle>
                  <CardDescription className="text-slate-400">
                    LVR Score: <span className={`${getLVRColor(selectedVendor.lvr_score)} font-mono text-lg`}>
                      {selectedVendor.lvr_score}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium">Performance History</h4>
                      {selectedVendor.reliability_history.map((history, index) => (
                        <div key={index} className="p-3 bg-slate-800/50 rounded">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Project {history.project_id}</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-amber-400 fill-current" />
                              <span className="text-white">{history.rating}</span>
                            </div>
                          </div>
                          <div className="text-sm text-slate-500">
                            Delay: {history.delay_minutes} minutes
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-white font-medium">LVR Calculation</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Price Score (40%):</span>
                          <span className="text-green-400 font-mono">85</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Reliability Score (30%):</span>
                          <span className="text-amber-400 font-mono">90</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Quality Score (30%):</span>
                          <span className="text-cyan-400 font-mono">95</span>
                        </div>
                        <div className="border-t border-slate-600 pt-2">
                          <div className="flex justify-between text-lg">
                            <span className="text-white">Final LVR Score:</span>
                            <span className={`${getLVRColor(selectedVendor.lvr_score)} font-mono`}>
                              {selectedVendor.lvr_score}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}