
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Lock, Activity, Clock, Command, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Checkbox from '../components/ui/Checkbox';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

// 轮播图数据配置
const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop",
    title: "流动，\n亦是高效。",
    desc: "专为追求精准、美学与卓越性能的开发者打造的新一代 IoT 时序数据管理平台。"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop",
    title: "安全，\n坚若磐石。",
    desc: "企业级零信任架构，全链路数据加密，为您的核心资产提供银行级的安全防护。"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop",
    title: "洞察，\n决胜千里。",
    desc: "内置高性能分析引擎，毫秒级处理 PB 级海量数据，实时捕捉业务背后的每一丝脉动。"
  }
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000); // 6秒切换一次
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({
        name: '演示用户',
        email: email || 'demo@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff',
        role: 'admin'
      });
      setLoading(false);
    }, 1200);
  };

  const fillCredentials = () => {
    setEmail('demo@example.com');
    setPassword('password');
    setIsAutoFilled(true);
    setTimeout(() => setIsAutoFilled(false), 2000);
  };

  return (
    <div className="min-h-screen flex w-full bg-white overflow-hidden">
      {/* Left Section (Clean Form) */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-24 relative z-10 bg-white">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-8 left-8 lg:left-12 flex items-center gap-2.5"
        >
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20 relative overflow-hidden group">
            <Clock className="w-5 h-5 text-white/30 absolute -right-1 -bottom-1" />
            <Activity className="w-5 h-5 text-white relative z-10" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">iotdb-idmp</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="w-full max-w-[400px] mx-auto lg:mx-0"
        >
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">欢迎回来</h1>
            <p className="text-gray-500 leading-relaxed">
              请输入您的详细信息以登录管理控制台。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Input
                  id="email"
                  type="email"
                  label="电子邮箱"
                  icon={<Mail className="w-5 h-5" />}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Input
                  id="password"
                  type="password"
                  label="密码"
                  icon={<Lock className="w-5 h-5" />}
                  placeholder="请输入您的密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.35 }}
                className="flex items-center justify-between"
            >
                <Checkbox 
                    label="记住我" 
                    checked={rememberMe} 
                    onChange={setRememberMe} 
                />
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors">
                    忘记密码？
                </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Button 
                type="submit" 
                className="w-full h-12 text-base mt-2" 
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                disabled={!email || !password}
              >
                立即登录
              </Button>
            </motion.div>
          </form>

          {/* Quick Fill Demo Credentials */}
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             transition={{ delay: 0.8 }} 
             className="mt-8 pt-6 border-t border-gray-100"
           >
              <div 
                onClick={fillCredentials}
                className="group flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:border-primary-200 hover:bg-primary-50/50 transition-all select-none"
              >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isAutoFilled ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400 group-hover:text-primary-600'}`}>
                        {isAutoFilled ? <Check className="w-4 h-4"/> : <Command className="w-4 h-4"/>}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900">演示账号快速填充</span>
                        <span className="text-[10px] text-gray-400 font-mono group-hover:text-primary-600/70 transition-colors">demo@example.com</span>
                    </div>
                </div>
                <div className="text-xs font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    点击填充
                </div>
              </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Section (Cinematic Carousel) */}
      <div className="hidden lg:flex lg:w-3/5 bg-gray-900 relative overflow-hidden items-end p-16">
         {/* Background Slides */}
         <AnimatePresence mode="wait">
            <motion.div 
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }} // Cinematic slow fade & zoom
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${SLIDES[currentSlide].image})` }}
            />
         </AnimatePresence>

         {/* Gradient Overlay for Text Readability */}
         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent mix-blend-multiply opacity-90" />
         <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-transparent" />

         {/* Content Layer */}
         <div className="relative z-10 w-full max-w-2xl">
            {/* Animated Text */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-5xl xl:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white drop-shadow-lg whitespace-pre-line">
                        {SLIDES[currentSlide].title}
                    </h2>
                    <p className="text-lg text-indigo-100 leading-relaxed font-light opacity-90 max-w-lg">
                        {SLIDES[currentSlide].desc}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Progress Indicators */}
            <div className="flex items-center gap-3 mt-12">
                {SLIDES.map((_, index) => (
                    <div 
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="h-1 rounded-full cursor-pointer overflow-hidden bg-white/20 transition-all duration-300"
                        style={{ width: currentSlide === index ? 48 : 16 }}
                    >
                        {currentSlide === index && (
                            <motion.div 
                                className="h-full bg-white rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 6, ease: "linear" }}
                            />
                        )}
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Login;
