import { motion } from 'motion/react';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface RiskGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showTrend?: boolean;
  previousScore?: number;
}

export function RiskGauge({ score, size = 'lg', showTrend = false, previousScore }: RiskGaugeProps) {
  const getSize = () => {
    switch (size) {
      case 'sm': return { width: 120, height: 120, stroke: 8 };
      case 'md': return { width: 160, height: 160, stroke: 12 };
      case 'lg': return { width: 240, height: 240, stroke: 16 };
    }
  };

  const { width, height, stroke } = getSize();
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#ef4444'; // Red
    if (score >= 60) return '#f59e0b'; // Amber
    if (score >= 40) return '#eab308'; // Yellow
    return '#10b981'; // Green
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MODERATE';
    return 'LOW';
  };

  const trend = previousScore ? score - previousScore : 0;
  const color = getRiskColor(score);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative" style={{ width, height }}>
        {/* Background circle */}
        <svg
          width={width}
          height={height}
          className="transform -rotate-90"
        >
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            fill="transparent"
            className="text-slate-700"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ 
              duration: 1.5, 
              ease: "easeOut",
              delay: 0.2 
            }}
            style={{
              filter: `drop-shadow(0 0 8px ${color})`
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
              className="text-4xl font-mono text-white mb-1"
            >
              {score}
            </motion.div>
            <div className="text-sm text-slate-400 uppercase tracking-wide">
              Risk Score
            </div>
          </div>
        </div>

        {/* Risk indicator icon */}
        <div className="absolute top-2 right-2">
          <AlertTriangle 
            className="h-6 w-6" 
            style={{ color }}
          />
        </div>
      </div>

      {/* Risk level and trend */}
      <div className="text-center space-y-2">
        <div 
          className="text-lg font-mono uppercase tracking-wider"
          style={{ color }}
        >
          {getRiskLevel(score)} RISK
        </div>
        
        {showTrend && previousScore !== undefined && (
          <div className="flex items-center justify-center space-x-2 text-sm">
            {trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-red-400" />
            ) : trend < 0 ? (
              <TrendingDown className="h-4 w-4 text-green-400" />
            ) : null}
            <span className={trend > 0 ? 'text-red-400' : trend < 0 ? 'text-green-400' : 'text-slate-400'}>
              {trend > 0 ? '+' : ''}{trend} from last week
            </span>
          </div>
        )}
      </div>
    </div>
  );
}