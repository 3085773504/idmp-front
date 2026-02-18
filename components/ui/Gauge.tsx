
import React from 'react';
import { motion } from 'framer-motion';

// --- Utils ---

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
};

// --- Types ---

interface BaseGaugeProps {
    value: number; // 0 - 100
    min?: number;
    max?: number;
    size?: number;
    label?: string;
    unit?: string;
    className?: string;
}

// --- 1. Simple Gauge (Clean Arc) ---

export const SimpleGauge: React.FC<BaseGaugeProps & { color?: string }> = ({ 
    value, min = 0, max = 100, size = 200, label = "CPU Usage", unit = "%", color = "#6366f1", className = "" 
}) => {
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    
    const strokeWidth = size * 0.1;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    
    // 240 degree arc (-120 to 120)
    const startAngle = -120;
    const endAngle = 120;
    const arcPath = describeArc(center, center, radius, startAngle, endAngle);

    return (
        <div className={`relative flex flex-col items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                <defs>
                    <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={color} />
                    </linearGradient>
                </defs>
                
                {/* Background Track */}
                <path 
                    d={arcPath} 
                    fill="none" 
                    stroke="#f1f5f9" 
                    strokeWidth={strokeWidth} 
                    strokeLinecap="round" 
                />
                
                {/* Foreground Path */}
                <motion.path 
                    d={arcPath} 
                    fill="none" 
                    stroke={`url(#gradient-${label})`} 
                    strokeWidth={strokeWidth} 
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: percentage / 100 }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                <motion.span 
                    className="text-4xl font-bold text-gray-900 font-mono tracking-tighter"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    {Math.round(value)}<span className="text-lg text-gray-400 ml-1 font-sans font-medium">{unit}</span>
                </motion.span>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">{label}</span>
            </div>
        </div>
    );
};

// --- 2. Speedometer Gauge (Needle & Ticks) ---

export const SpeedometerGauge: React.FC<BaseGaugeProps> = ({ 
    value, min = 0, max = 100, size = 240, label = "Speed", unit = "Mb/s", className = "" 
}) => {
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    
    // -90 to 270 range for ticks? No, let's do standard speedometer: -135 to 135 (270 total)
    const startDeg = -135;
    const endDeg = 135;
    const rangeDeg = endDeg - startDeg;
    
    // Needle rotation
    const rotation = startDeg + (percentage / 100) * rangeDeg;
    
    // Ticks generation
    const ticks = [];
    const tickCount = 11; // 0, 10, ... 100
    for(let i=0; i<tickCount; i++) {
        const tickVal = i * (100 / (tickCount - 1));
        const deg = startDeg + (tickVal / 100) * rangeDeg;
        ticks.push({ deg, isMajor: true, val: Math.round(min + (tickVal/100)*(max-min)) });
    }
    
    // Minor ticks
    const minorTicks = [];
    const subTickCount = 50;
    for(let i=0; i<=subTickCount; i++) {
        const deg = startDeg + (i / subTickCount) * rangeDeg;
        minorTicks.push({ deg });
    }

    const radius = size / 2;
    const center = size / 2;

    return (
        <div className={`relative ${className}`} style={{ width: size, height: size * 0.8 }}>
             <svg width={size} height={size}>
                {/* Minor Ticks */}
                {minorTicks.map((t, i) => {
                    const pos1 = polarToCartesian(center, center, radius - 15, t.deg);
                    const pos2 = polarToCartesian(center, center, radius - 25, t.deg);
                    return (
                        <line 
                            key={`minor-${i}`} 
                            x1={pos1.x} y1={pos1.y} 
                            x2={pos2.x} y2={pos2.y} 
                            stroke="#e2e8f0" 
                            strokeWidth="1" 
                        />
                    )
                })}

                {/* Major Ticks & Labels */}
                {ticks.map((t, i) => {
                    const pos1 = polarToCartesian(center, center, radius - 15, t.deg);
                    const pos2 = polarToCartesian(center, center, radius - 30, t.deg);
                    
                    // Label Pos
                    const labelPos = polarToCartesian(center, center, radius - 55, t.deg);
                    
                    const isActive = percentage >= ((t.val - min) / (max - min)) * 100;

                    return (
                        <React.Fragment key={`major-${i}`}>
                             <line 
                                x1={pos1.x} y1={pos1.y} 
                                x2={pos2.x} y2={pos2.y} 
                                stroke={isActive ? "#6366f1" : "#cbd5e1"} 
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            <text 
                                x={labelPos.x} y={labelPos.y} 
                                textAnchor="middle" 
                                dominantBaseline="middle" 
                                className={`text-[10px] font-bold ${isActive ? 'fill-primary-600' : 'fill-gray-400'}`}
                            >
                                {t.val}
                            </text>
                        </React.Fragment>
                    )
                })}
             </svg>

             {/* Needle Container */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <motion.div
                    className="w-full h-full relative"
                    initial={{ rotate: startDeg }}
                    animate={{ rotate: rotation }}
                    transition={{ type: "spring", stiffness: 50, damping: 10, mass: 0.5 }}
                    style={{ transformOrigin: "center center" }}
                 >
                     {/* The Needle */}
                     <div className="absolute top-[15%] left-1/2 -ml-[3px] w-[6px] h-[35%] bg-gradient-to-b from-primary-500 to-indigo-600 rounded-full shadow-lg shadow-indigo-500/30" />
                 </motion.div>
                 
                 {/* Center Cap */}
                 <div className="absolute w-16 h-16 bg-white rounded-full border-4 border-gray-50 shadow-xl flex items-center justify-center z-10">
                     <div className="w-3 h-3 bg-primary-600 rounded-full" />
                 </div>
             </div>

             {/* Value Label */}
             <div className="absolute bottom-10 inset-x-0 text-center">
                 <h4 className="text-3xl font-bold text-gray-900 tracking-tight">{Math.round(value)}</h4>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{label} ({unit})</p>
             </div>
        </div>
    )
}

// --- 3. Multi-Ring Gauge ---

interface RingData {
    value: number;
    color: string;
    label: string;
}

export const RingStackGauge: React.FC<{ rings: RingData[], size?: number, className?: string }> = ({ 
    rings, size = 260, className = "" 
}) => {
    const center = size / 2;
    const strokeWidth = 14;
    const gap = 12;
    const maxRadius = (size / 2) - 10;

    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {rings.map((ring, i) => {
                    const radius = maxRadius - (i * (strokeWidth + gap));
                    const circumference = 2 * Math.PI * radius;
                    const offset = circumference - (ring.value / 100) * circumference;
                    
                    return (
                        <React.Fragment key={i}>
                            {/* Track */}
                            <circle 
                                cx={center} cy={center} r={radius} 
                                fill="none" 
                                stroke="#f1f5f9" 
                                strokeWidth={strokeWidth} 
                                strokeLinecap="round"
                                opacity="0.8"
                            />
                            {/* Value Ring */}
                            <motion.circle 
                                cx={center} cy={center} r={radius} 
                                fill="none" 
                                stroke={ring.color} 
                                strokeWidth={strokeWidth} 
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                            />
                        </React.Fragment>
                    )
                })}
            </svg>
            
            {/* Center Legend */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <div className="flex flex-col gap-1.5 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm">
                     {rings.map((ring, i) => (
                         <div key={i} className="flex items-center gap-2">
                             <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ring.color }} />
                             <span className="text-xs font-bold text-gray-400 uppercase w-12">{ring.label}</span>
                             <span className="text-sm font-bold text-gray-900 tabular-nums">{ring.value}%</span>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    )
}
