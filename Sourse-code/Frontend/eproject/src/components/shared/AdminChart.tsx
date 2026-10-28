import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart, Utensils, Crown, Sparkles, Flame, Layers } from 'lucide-react';
export interface RevenueChartProps {
  data?: { month: string; revenue: number; members: number; growth: string }[];
}

const defaultRevenueData = [
  { month: 'Mar', revenue: 4200, members: 42, growth: '+14%' },
  { month: 'Apr', revenue: 6800, members: 68, growth: '+18%' },
  { month: 'May', revenue: 9400, members: 94, growth: '+22%' },
  { month: 'Jun', revenue: 12200, members: 122, growth: '+26%' },
  { month: 'Jul', revenue: 15600, members: 156, growth: '+28%' },
  { month: 'Aug', revenue: 18900, members: 189, growth: '+31%' },
];

export const AdminRevenueAreaChart: React.FC<RevenueChartProps> = ({
  data = defaultRevenueData,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeWindow, setActiveWindow] = useState<'6m' | 'q2' | 'year'>('6m');

  const maxRevenue = Math.max(...data.map((d) => d.revenue)) * 1.18;
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 36;
  const paddingY = 28;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (d.revenue / maxRevenue) * (svgHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (p.x - prev.x) / 2;
    const cpY2 = p.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;
  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xl flex flex-col justify-between gap-6 text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[var(--color-accent)]/10 blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-accent)] font-bold">
              Recurring Financial Velocity
            </span>
          </div>
          <h3 className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-[var(--color-text)] tracking-tight">
            Subscription Revenue
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Real-time MRR generated from VIP passes ($100/mo & $1,000/yr).
          </p>
        </div>

        <div className="flex items-center gap-3.5 bg-[var(--color-surface-2)] p-3 px-4 rounded-2xl border border-[var(--color-border)] shrink-0 shadow-warm-xs">
          <div>
            <span className="text-[10px] font-mono uppercase text-[var(--color-text-subtle)] block font-bold">
              {hoveredIndex !== null ? `${activePoint.month} 2026 Snapshot` : 'Current Run-Rate'}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
                ${activePoint.revenue.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-[var(--color-success)] font-bold flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                {activePoint.growth}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden select-none">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 sm:h-56 overflow-visible">
          <defs>
            <linearGradient id="luxuryGoldMesh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.45" />
              <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="60%" stopColor="var(--color-accent)" />
              <stop offset="100%" stopColor="#E2B35B" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = svgHeight - paddingY - ratio * (svgHeight - paddingY * 2);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="var(--color-border)"
                  strokeDasharray="4 6"
                  opacity={0.5}
                />
                <text
                  x={paddingX - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-[var(--color-text-subtle)] font-medium"
                >
                  ${Math.round((maxRevenue * ratio) / 1000)}k
                </text>
              </g>
            );
          })}

          <motion.path
            d={areaD}
            fill="url(#luxuryGoldMesh)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glowFilter)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {hoveredIndex !== null && (
            <line
              x1={points[hoveredIndex].x}
              y1={paddingY}
              x2={points[hoveredIndex].x}
              y2={svgHeight - paddingY}
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}

          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g key={p.month} className="cursor-pointer">
                {/* Month Label */}
                <text
                  x={p.x}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  className={`text-[11px] font-mono font-bold transition-colors ${
                    isHovered
                      ? 'fill-[var(--color-accent)] font-extrabold'
                      : 'fill-[var(--color-text-subtle)]'
                  }`}
                >
                  {p.month}
                </text>

                {isHovered && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={12}
                    className="fill-[var(--color-accent)]/20 animate-ping"
                  />
                )}

                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 7 : 5}
                  className="fill-[var(--color-surface)] stroke-[var(--color-accent)] stroke-[3.5px] transition-all duration-200 shadow-warm-md"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {isHovered && (
                  <g className="pointer-events-none">
                    <rect
                      x={p.x - 58}
                      y={p.y - 48}
                      width="116"
                      height="38"
                      rx="12"
                      className="fill-[var(--color-surface-2)] stroke-[var(--color-accent)] stroke-[1.5px] shadow-warm-xl"
                    />
                    <text
                      x={p.x}
                      y={p.y - 30}
                      textAnchor="middle"
                      className="text-[12px] font-bold fill-[var(--color-text)] font-sans"
                    >
                      ${p.revenue.toLocaleString()}
                    </text>
                    <text
                      x={p.x}
                      y={p.y - 17}
                      textAnchor="middle"
                      className="text-[9px] font-mono fill-[var(--color-text-muted)] font-semibold"
                    >
                      {p.members} VIP Subscribers
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
export const AdminCategoryBarChart: React.FC = () => {
  const disciplines = [
    {
      name: 'Italian Gastronomy',
      count: 18,
      percentage: 35,
      icon: '🍷',
      gradient: 'from-[#53131B] via-[#7B1D28] to-[#A67628]',
      accentColor: '#53131B',
    },
    {
      name: 'French Haute Cuisine',
      count: 14,
      percentage: 27,
      icon: '👑',
      gradient: 'from-[#A67628] via-[#C99138] to-[#E2B35B]',
      accentColor: '#A67628',
    },
    {
      name: 'Artisan Pastry & Baking',
      count: 11,
      percentage: 21,
      icon: '🥐',
      gradient: 'from-[#2D6A4F] via-[#40916C] to-[#52B788]',
      accentColor: '#2D6A4F',
    },
    {
      name: 'Mediterranean Seafood',
      count: 9,
      percentage: 17,
      icon: '🐟',
      gradient: 'from-[#1D3557] via-[#457B9D] to-[#A8DADC]',
      accentColor: '#1D3557',
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xl flex flex-col justify-between gap-6 text-left">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-primary)] font-bold">
            Curriculum Density
          </span>
        </div>
        <h3 className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-[var(--color-text)] tracking-tight">
          Discipline Distribution
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Active formulation count & curriculum coverage by culinary vertical.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {disciplines.map((cat, idx) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="flex flex-col gap-2 p-3 rounded-2xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-base">{cat.icon}</span>
                <span className="font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[var(--color-text)]">
                  {cat.count} Formulations
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-accent)]">
                  {cat.percentage}%
                </span>
              </div>
            </div>

            {/* Glowing Rounded Progress Track */}
            <div className="w-full h-3.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden p-0.5 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(cat.count / 18) * 100}%` }}
                transition={{ duration: 1.1, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-full bg-gradient-to-r ${cat.gradient} shadow-warm-xs`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export const AdminMembershipDonutChart: React.FC = () => {
  const tiers = [
    { label: 'Annual VIP ($1,000/yr)', count: 68, percent: 52, color: '#A67628', gradient: 'from-[#A67628] to-[#E2B35B]' },
    { label: 'Monthly VIP ($100/mo)', count: 48, percent: 36, color: '#53131B', gradient: 'from-[#53131B] to-[#9E2A2B]' },
    { label: 'Apprentice Trial', count: 16, percent: 12, color: '#2D6A4F', gradient: 'from-[#2D6A4F] to-[#52B788]' },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-warm-xl flex flex-col justify-between gap-6 text-left">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <PieChart className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-accent)] font-bold">
            Subscription Segmentation
          </span>
        </div>
        <h3 className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-[var(--color-text)] tracking-tight">
          Member Tier Demographics
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Breakdown of active subscriber tiers and trial accounts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        <div className="sm:col-span-5 flex justify-center">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="var(--color-surface-2)"
                strokeWidth="11"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#A67628"
                strokeWidth="11"
                strokeDasharray="238.76"
                strokeDashoffset="238.76"
                animate={{ strokeDashoffset: 238.76 * (1 - 0.52) }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                strokeLinecap="round"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#53131B"
                strokeWidth="11"
                strokeDasharray="238.76"
                strokeDashoffset="238.76"
                animate={{ strokeDashoffset: 238.76 * (1 - 0.36) }}
                transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
                strokeLinecap="round"
                className="opacity-95"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#2D6A4F"
                strokeWidth="11"
                strokeDasharray="238.76"
                strokeDashoffset="238.76"
                animate={{ strokeDashoffset: 238.76 * (1 - 0.12) }}
                transition={{ duration: 1.2, delay: 0.4, ease: 'easeInOut' }}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-serif text-3xl font-bold text-[var(--color-text)] leading-none">132</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-accent)] font-bold mt-1">
                Total VIPs
              </span>
            </div>
          </div>
        </div>

        <div className="sm:col-span-7 flex flex-col gap-2.5">
          {tiers.map((t) => (
            <div
              key={t.label}
              className="flex items-center justify-between p-3 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-warm-xs" style={{ backgroundColor: t.color }} />
                <span className="text-xs sm:text-sm font-semibold text-[var(--color-text)]">{t.label}</span>
              </div>
              <span className="text-xs font-mono font-bold text-[var(--color-text)]">
                {t.count} ({t.percent}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
