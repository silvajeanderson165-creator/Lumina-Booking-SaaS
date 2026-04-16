import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  date: string;
  mrrValue: number;
  churnedAmount: number;
}

interface DashboardChartProps {
  data: ChartData[];
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel" style={{ padding: '1rem', border: '1px solid var(--border-glass)' }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: entry.color,
              boxShadow: `0 0 8px ${entry.color}`
            }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>{entry.name}:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function DashboardChart({ data, isLoading = false }: DashboardChartProps) {
  if (isLoading) {
    return (
      <div className="glass-panel chart-section">
        <div className="chart-header">
          <div className="skeleton" style={{ width: '150px', height: '24px' }}></div>
          <div className="skeleton" style={{ width: '200px', height: '20px' }}></div>
        </div>
        <div className="skeleton" style={{ flexGrow: 1, marginTop: '20px', borderRadius: 'var(--radius-sm)' }}></div>
      </div>
    );
  }

  return (
    <div className="glass-panel chart-section animate-fade-in">
      <div className="chart-header">
        <div className="chart-title">Revenue Dynamics</div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot mrr"></span>
            <span>Monthly Recurring Revenue</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot churn"></span>
            <span>Churned Revenue</span>
          </div>
        </div>
      </div>
      
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="var(--text-muted)" 
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="var(--text-muted)"
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="mrrValue" 
              name="MRR" 
              stroke="var(--accent-cyan)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorMrr)" 
              activeDot={{ r: 6, fill: 'var(--accent-cyan)', stroke: '#fff', strokeWidth: 2, boxShadow: '0 0 15px var(--accent-cyan)' }}
            />
            <Area 
              type="monotone" 
              dataKey="churnedAmount" 
              name="Churn" 
              stroke="var(--accent-purple)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorChurn)" 
              activeDot={{ r: 6, fill: 'var(--accent-purple)', stroke: '#fff', strokeWidth: 2, boxShadow: '0 0 15px var(--accent-purple)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
