import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  isLoading?: boolean;
}

export function MetricCard({ title, value, change, isPositive, icon, isLoading = false }: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="glass-panel metric-card">
        <div className="metric-header">
          <div className="skeleton" style={{ width: '40%', height: '16px' }}></div>
          <div className="skeleton" style={{ width: '24px', height: '24px', borderRadius: '50%' }}></div>
        </div>
        <div className="skeleton" style={{ width: '60%', height: '40px', margin: '0.5rem 0' }}></div>
        <div className="skeleton" style={{ width: '30%', height: '14px' }}></div>
      </div>
    );
  }

  return (
    <div className="glass-panel metric-card animate-fade-in">
      <div className="metric-header">
        <span>{title}</span>
        <div className="metric-icon">{icon}</div>
      </div>
      <div className="metric-value">{value}</div>
      <div className={`metric-change ${isPositive ? 'change-positive' : 'change-negative'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span>{change}</span>
        <span style={{ color: 'var(--text-muted)', marginLeft: '4px', fontWeight: 'normal' }}>vs last period</span>
      </div>
    </div>
  );
}
