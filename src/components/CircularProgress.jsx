import React, { useEffect, useState } from 'react';

export default function CircularProgress({ percentage, color, valueText, size = 130, strokeWidth = 12 }) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    // アニメーションのために少し遅らせてセット
    const timer = setTimeout(() => {
      setAnimatedPercentage(Math.min(100, Math.max(0, percentage)));
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  const valueFontSize = (size * 0.22) + 'px';
  const labelFontSize = Math.max(10, size * 0.08) + 'px';

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div style={{ zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
        <div style={{ fontSize: labelFontSize, fontWeight: 700, color: '#475569', letterSpacing: '-0.2px' }}>
          {percentage.toFixed(0)}%
        </div>
        <div style={{ fontSize: valueFontSize, fontWeight: 900, color: color, lineHeight: 1, letterSpacing: '-0.5px' }}>
          {valueText}
        </div>
        <div style={{ fontSize: labelFontSize, fontWeight: 700, color: '#64748B' }}>
          進捗
        </div>
      </div>
    </div>
  );
}
