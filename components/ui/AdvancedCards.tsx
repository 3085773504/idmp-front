
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CreditCard, ShieldCheck, Zap, TrendingUp, Lock } from 'lucide-react';

// --- 1. 极光流体卡片 (Mesh Gradient Card) ---
export const MeshCard = ({ title, subtitle, icon: Icon, color = "purple" }: { title: string, subtitle: string, icon: any, color?: "purple" | "blue" | "orange" }) => {
    const bgColors = {
        purple: "bg-purple-200/50",
        blue: "bg-blue-200/50",
        orange: "bg-orange-200/50"
    };
    
    const blobColor = {
        purple: "bg-indigo-300",
        blue: "bg-cyan-300",
        orange: "bg-amber-300"
    };

    return (
        <motion.div
            whileHover="hover"
            initial="idle"
            className="relative h-64 w-full bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden group cursor-pointer select-none"
        >
            {/* 动态背景光斑 */}
            <motion.div 
                variants={{
                    idle: { x: 0, y: 0, scale: 1 },
                    hover: { x: 20, y: -20, scale: 1.1 }
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`absolute -top-10 -right-10 w-48 h-48 ${bgColors[color]} rounded-full blur-3xl opacity-60`} 
            />
            <motion.div 
                variants={{
                    idle: { x: 0, y: 0, scale: 1 },
                    hover: { x: -20, y: 10, scale: 1.2 }
                }}
                transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
                className={`absolute -bottom-10 -left-10 w-56 h-56 ${blobColor[color]} rounded-full blur-3xl opacity-20`} 
            />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <motion.div 
                        variants={{ hover: { scale: 1.1, rotate: -5 } }}
                        className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-50 flex items-center justify-center text-gray-900"
                    >
                        <Icon className="w-7 h-7" />
                    </motion.div>
                    <motion.div
                        variants={{ idle: { opacity: 0, x: -10 }, hover: { opacity: 1, x: 0 } }}
                        className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white"
                    >
                        <ArrowUpRight className="w-4 h-4" />
                    </motion.div>
                </div>
                
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">{title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm font-medium">
                        {subtitle}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

// --- 2. 暗夜霓虹卡片 (Dark Neon Card) ---
export const DarkCard = () => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="relative h-64 w-full bg-[#0f172a] rounded-[2.5rem] p-8 overflow-hidden group cursor-pointer text-white shadow-2xl shadow-indigo-900/20 select-none"
        >
            {/* 边框流光效果 */}
            <div className="absolute inset-0 p-[1px] rounded-[2.5rem] overflow-hidden">
                <div className="absolute inset-0 bg-gray-800 rounded-[2.5rem]" /> {/* 默认边框 */}
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-[200%] h-full opacity-0 group-hover:opacity-100"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
            </div>
            {/* 内部遮罩，用于盖住中间部分只露边框，但这里我们用 inset-[1px] 来模拟 */}
            <div className="absolute inset-[1px] bg-[#0f172a] rounded-[calc(2.5rem-1px)] z-0" />
            
            {/* 内部氛围光 */}
            <motion.div 
                className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <ShieldCheck className="w-6 h-6 text-indigo-400" />
                    </div>
                    <span className="px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-bold text-indigo-300 tracking-wide uppercase">
                        Enterprise
                    </span>
                </div>
                
                <div>
                    <h3 className="text-xl font-bold mb-2 text-white">全域安全防护</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        端到端加密通道已建立，实时威胁检测引擎运行中。
                    </p>
                    
                    {/* 进度条装饰 */}
                    <div className="mt-6 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-indigo-500"
                            initial={{ width: "60%" }}
                            whileHover={{ width: "85%" }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>STATUS: ACTIVE</span>
                        <span>98% SECURE</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// --- 3. 磨砂玻璃卡片 (Glassmorphism Card) ---
export const GlassCard = () => {
    return (
        <motion.div
            whileHover="hover"
            initial="idle"
            className="relative h-64 w-full rounded-[2.5rem] overflow-hidden cursor-pointer group shadow-lg"
        >
            {/* 背景图层 */}
            <motion.div 
                variants={{
                    idle: { scale: 1 },
                    hover: { scale: 1.1 }
                }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639815188546-c43c240ff4df?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center" 
            />
            
            {/* 黑色遮罩，增强文字对比度 */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            
            {/* 玻璃覆盖层 */}
            <div className="absolute inset-0 flex flex-col justify-end p-4">
                <motion.div 
                    variants={{
                        idle: { y: 0, backgroundColor: "rgba(255, 255, 255, 0.1)" },
                        hover: { y: -5, backgroundColor: "rgba(255, 255, 255, 0.2)" }
                    }}
                    className="backdrop-blur-xl rounded-[1.8rem] border border-white/20 p-5 text-white shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                 <CreditCard className="w-5 h-5" />
                             </div>
                             <div>
                                 <p className="text-xs font-medium text-white/70">总资产估值</p>
                                 <p className="text-lg font-bold tracking-tight">¥ 124,592.00</p>
                             </div>
                         </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-white/10 rounded-xl p-2 text-center border border-white/5 hover:bg-white/20 transition-colors">
                            <span className="text-[10px] text-white/60 block">收益率</span>
                            <span className="text-sm font-bold text-green-300">+24.5%</span>
                        </div>
                        <div className="flex-1 bg-white/10 rounded-xl p-2 text-center border border-white/5 hover:bg-white/20 transition-colors">
                            <span className="text-[10px] text-white/60 block">波动</span>
                            <span className="text-sm font-bold text-white">Low</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
