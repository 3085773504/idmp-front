
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowRight, User as UserIcon, Lock, Activity, Clock, 
    Command, Check, Eye, EyeOff, AlertCircle, Shield,
    Wifi, Cpu, Database, Server
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Checkbox from '../components/ui/Checkbox';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

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
    title: "安全，\n坚若夯石。",
    desc: "企业级零信任架构，全链路数据加密，为您的核心资产提供银行级的安全防护。"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop",
    title: "洞察，\n决胜千里。",
    desc: "内置高性能分析引擎，毫秒级处理 PB 级海量数据，实时捕捉业务背后的每一丝脉动。"
  }
];

const FloatingIcon = ({ Icon, initialX, initialY, delay, duration, size = 200, opacity = 0.03 }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8, x: initialX, y: initialY }}
        animate={{ 
            opacity: opacity,
            scale: [1, 1.1, 1],
            x: [initialX, initialX + 30, initialX - 20, initialX],
            y: [initialY, initialY - 40, initialY + 20, initialY],
            rotate: [0, 10, -5, 0]
        }}
        transition={{ 
            opacity: { duration: 2, delay },
            default: { duration, repeat: Infinity, ease: "easeInOut", delay }
        }}
        className="absolute text-primary-600 pointer-events-none select-none"
    >
        <Icon size={size} strokeWidth={0.5} />
    </motion.div>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username || !password) {
        setErrorMsg("请填写所有必填字段");
        return;
    }

    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      if (username === 'error') {
        setErrorMsg("账户名或密码错误，请重试");
        setLoading(false);
      } else {
        onLogin({
          name: username === 'admin' ? '管理员' : username,
          email: username.includes('@') ? username : `${username}@iot.com`,
          avatar: `https://ui-avatars.com/api/?name=${username}&background=6366f1&color=fff`,
          role: 'admin'
        });
        setLoading(false);
      }
    }, 1500);
  };

  const fillCredentials = () => {
    setUsername('admin');
    setPassword('password123');
    setErrorMsg(null);
  };

  const horizontalPaddingClasses = "px-8 sm:px-12 lg:px-16 xl:px-24";

  return (
    <div className="min-h-screen flex w-full bg-white overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Left Section */}
      <div className="w-full lg:w-2/5 flex flex-col relative z-10 bg-white min-h-screen">
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <FloatingIcon Icon={Activity} initialX="-5%" initialY="10%" size={600} duration={20} delay={0} opacity={0.04} />
            <FloatingIcon Icon={Wifi} initialX="70%" initialY="5%" size={300} duration={15} delay={1} opacity={0.02} />
            <FloatingIcon Icon={Cpu} initialX="10%" initialY="60%" size={400} duration={25} delay={2} opacity={0.02} />
            <FloatingIcon Icon={Database} initialX="60%" initialY="75%" size={500} duration={18} delay={0.5} opacity={0.03} />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-40" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute top-10 left-0 w-full z-20 ${horizontalPaddingClasses}`}
        >
          <div className="flex items-center gap-3">
            <motion.div 
                layoutId="app-logo-box"
                className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-2xl shadow-primary-600/30 relative overflow-hidden group"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"
              />
              <Clock className="w-5 h-5 text-white/30 absolute -right-1 -bottom-1" />
              <Activity className="w-6 h-6 text-white relative z-10" />
            </motion.div>
            <motion.span layoutId="app-logo-text" className="font-bold text-2xl tracking-tight text-gray-900">iotdb-idmp</motion.span>
          </div>
        </motion.div>

        {/* Center Content */}
        <div className={`flex-1 flex flex-col justify-center py-20 relative z-10 ${horizontalPaddingClasses}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="w-full max-w-[400px] mx-auto lg:mx-0"
          >
            <div className="mb-10 text-left">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">欢迎回来</h1>
              <p className="text-gray-500 text-lg leading-relaxed font-medium">
                输入您的账号信息以继续。
              </p>
            </div>

            <AnimatePresence mode="wait">
              {errorMsg && (
                  <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="mb-6 overflow-hidden"
                  >
                      <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 shadow-sm">
                          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                          <p className="text-sm text-red-800 font-semibold leading-relaxed">{errorMsg}</p>
                      </div>
                  </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                    id="username"
                    value={username}
                    onChange={setUsername}
                    label="账号"
                    icon={<UserIcon className="w-5 h-5" />}
                    required
                />

                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={setPassword}
                    label="密码"
                    icon={<Lock className="w-5 h-5" />}
                    required
                    rightElement={
                      <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                      >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                />
              </div>

              <div className="flex items-center justify-between">
                  <Checkbox 
                      label="记住登录状态" 
                      checked={rememberMe} 
                      onChange={setRememberMe} 
                  />
                  <a href="#" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                      忘记密码？
                  </a>
              </div>

              <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold shadow-2xl shadow-primary-600/20" 
                  isLoading={loading}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                  进入工作区
              </Button>

              <div className="pt-4 border-t border-gray-50">
                  <Button 
                      variant="secondary" 
                      className="w-full h-14 justify-center border-gray-100 text-gray-600 font-bold bg-gray-50/50" 
                      leftIcon={<Shield className="w-5 h-5 text-indigo-500" />}
                  >
                      SSO 企业级单点登录
                  </Button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Bottom Helper */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1 }} 
          className={`absolute bottom-10 left-0 w-full z-20 pointer-events-none ${horizontalPaddingClasses}`}
        >
           <div 
             onClick={fillCredentials}
             className="group flex items-center justify-between p-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-gray-100/50 cursor-pointer hover:border-primary-200 hover:bg-white transition-all select-none max-w-[400px] mx-auto lg:mx-0 pointer-events-auto shadow-sm hover:shadow-xl"
           >
             <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-indigo-50 flex items-center justify-center text-gray-400 group-hover:text-primary-600 transition-colors">
                     <Command className="w-5 h-5"/>
                 </div>
                 <div className="flex flex-col text-left">
                     <span className="text-sm font-bold text-gray-900">演示账号快速填充</span>
                     <span className="text-xs text-gray-400 font-mono group-hover:text-primary-600/70 transition-colors uppercase">admin / password123</span>
                 </div>
             </div>
             <div className="text-xs font-bold text-primary-600 opacity-0 group-hover:opacity-100 transition-all pr-2 translate-x-2 group-hover:translate-x-0">
                 填充
             </div>
           </div>
       </motion.div>
      </div>

      {/* Right Carousel */}
      <div className="hidden lg:flex lg:w-3/5 bg-gray-950 relative overflow-hidden items-end p-16">
         <AnimatePresence mode="wait">
            <motion.div 
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(20px)' }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }} 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${SLIDES[currentSlide].image})` }}
            >
                <motion.div 
                    animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full bg-inherit"
                />
            </motion.div>
         </AnimatePresence>

         <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-80" />
         <div className="absolute inset-0 bg-gradient-to-r from-gray-950/40 to-transparent" />
         
         <div className="relative z-10 w-full max-w-2xl pb-10 text-left">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="mb-4">
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-extrabold text-white tracking-[0.2em] uppercase">
                            Nex-Gen Data Architecture
                        </span>
                    </div>
                    <h2 className="text-6xl xl:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tighter text-white drop-shadow-2xl whitespace-pre-line">
                        {SLIDES[currentSlide].title}
                    </h2>
                    <p className="text-xl text-indigo-50 leading-relaxed font-medium opacity-80 max-w-lg">
                        {SLIDES[currentSlide].desc}
                    </p>
                </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3 mt-12">
                {SLIDES.map((_, index) => (
                    <div 
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="h-1.5 rounded-full cursor-pointer overflow-hidden bg-white/10 hover:bg-white/30 transition-all duration-500"
                        style={{ width: currentSlide === index ? 64 : 16 }}
                    >
                        {currentSlide === index && (
                            <motion.div 
                                className="h-full bg-white rounded-full shadow-[0_0_10px_white]"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 8, ease: "linear" }}
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
