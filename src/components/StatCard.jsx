import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ icon: Icon, label, value, trend, trendLabel, color = 'green' }) {
  const isPositive = trend > 0;

  return (
    <div className="stat-card" id={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className={`stat-icon ${color}`}>
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {trend !== undefined && (
          <div className={`stat-trend ${trend === 0 ? 'neutral' : (isPositive ? 'up' : 'down')}`} style={trend === 0 ? { color: 'var(--text-muted)' } : {}}>
            {trend === 0 ? <Minus size={14} /> : (isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />)}
            {Math.abs(trend)}% {trendLabel || 'vs last week'}
          </div>
        )}
      </div>
    </div>
  );
}
