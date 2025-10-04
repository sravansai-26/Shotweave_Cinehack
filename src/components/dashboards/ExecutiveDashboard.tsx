import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RiskGauge } from '../RiskGauge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp, Calendar, Users, AlertCircle, Plus } from 'lucide-react';
import { mockProjects, mockDailyReports } from '../../lib/mockData';
import { Project } from '../../types';
import { predictBudgetRisk } from '../../lib/aiServices';

export function ExecutiveDashboard() {
  const [selectedProject, setSelectedProject] = useState<Project>(mockProjects[0]);
  const [riskHistory, setRiskHistory] = useState([
    { date: 'Week 1', risk: 45 },
    { date: 'Week 2', risk: 52 },
    { date: 'Week 3', risk: 68 },
    { date: 'Week 4', risk: 75 }
  ]);

  // Calculate updated risk score with AI
  useEffect(() => {
    const updateRiskScore = () => {
      const prediction = predictBudgetRisk({
        days_behind: 3,
        cost_variance_pct: 15.2,
        star_delay_factor: 2,
        weather_impact: 3,
        crew_efficiency: 85
      });
      
      setSelectedProject(prev => ({
        ...prev,
        ai_risk_score: prediction.risk_score,
        predicted_overrun_crores: prediction.predicted_overrun_crores
      }));
    };

    const interval = setInterval(updateRiskScore, 10000); // Update every 10 seconds for demo
    return () => clearInterval(interval);
  }, []);

  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget_total, 0);
  const totalRisk = mockProjects.reduce((sum, p) => sum + p.predicted_overrun_crores, 0);

  const budgetData = mockProjects.map(project => ({
    name: project.title,
    budget: project.budget_total,
    risk: project.predicted_overrun_crores,
    riskScore: project.ai_risk_score
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl text-cyan-400 mb-2">EXECUTIVE COMMAND CENTER</h1>
          <p className="text-slate-400">Real-time production oversight and risk management</p>
        </div>
        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-slate-400">Total Portfolio</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-400 font-mono">₹{totalBudget.toFixed(1)}Cr</div>
            <p className="text-xs text-slate-500">Across {mockProjects.length} active projects</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-slate-400">Risk Exposure</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-400 font-mono">₹{totalRisk.toFixed(1)}Cr</div>
            <p className="text-xs text-slate-500">Predicted overrun potential</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-slate-400">Active Projects</CardTitle>
            <Calendar className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-amber-400 font-mono">{mockProjects.filter(p => p.status === 'PRODUCTION').length}</div>
            <p className="text-xs text-slate-500">Currently in production</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-slate-400">Team Efficiency</CardTitle>
            <Users className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-cyan-400 font-mono">87%</div>
            <p className="text-xs text-slate-500">Average crew performance</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Risk Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="bg-slate-900/50 border-slate-700 h-full">
            <CardHeader>
              <CardTitle className="text-cyan-400">AI RISK ASSESSMENT</CardTitle>
              <CardDescription className="text-slate-400">
                Real-time prediction for {selectedProject.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <RiskGauge 
                score={selectedProject.ai_risk_score} 
                showTrend={true}
                previousScore={68}
              />
              <div className="text-center space-y-2">
                <div className="text-lg text-amber-400 font-mono">
                  Predicted Overrun: ₹{selectedProject.predicted_overrun_crores}Cr
                </div>
                <Badge variant="outline" className="border-amber-500 text-amber-400">
                  Updated 2 min ago
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="bg-slate-900/50 border-slate-700 h-full">
            <CardHeader>
              <CardTitle className="text-cyan-400">RISK TREND ANALYSIS</CardTitle>
              <CardDescription className="text-slate-400">
                4-week risk progression for {selectedProject.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={riskHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Project Portfolio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">PROJECT PORTFOLIO</CardTitle>
            <CardDescription className="text-slate-400">
              Budget allocation and risk distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="budget" fill="#10b981" name="Budget (Cr)" />
                <Bar dataKey="risk" fill="#ef4444" name="Risk (Cr)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Project Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">PROJECT OVERVIEW</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockProjects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => setSelectedProject(project)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedProject._id === project._id
                      ? 'bg-cyan-900/30 border border-cyan-500'
                      : 'bg-slate-800/50 hover:bg-slate-700/50'
                  }`}
                >
                  <h3 className="text-lg text-white mb-2">{project.title}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Budget:</span>
                      <span className="text-green-400 font-mono">₹{project.budget_total}Cr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Risk Score:</span>
                      <span className="text-amber-400 font-mono">{project.ai_risk_score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <Badge variant="outline" className="border-cyan-500 text-cyan-400 text-xs">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}