import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Bot } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-sm">
        {/* Logo */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-3xl neon-gradient mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/20">
          <Zap className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-4xl font-extrabold text-foreground tracking-tight">
          Stellar<span className="neon-gradient-text">Flow</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-muted-foreground mt-3 text-sm leading-relaxed">
          Send, Save, and Automate Money<br />with AI on Stellar
        </motion.p>

        {/* Feature pills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-2 mt-6">
          {[
            { icon: Zap, label: 'Instant Payments' },
            { icon: Shield, label: 'Secure Wallet' },
            { icon: Bot, label: 'AI Powered' },
          ].map((f) => (
            <span key={f.label} className="glass-card px-3 py-1.5 text-[10px] font-medium text-muted-foreground flex items-center gap-1.5">
              <f.icon className="w-3 h-3 text-primary" /> {f.label}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          onClick={onGetStarted}
          className="mt-8 w-full neon-gradient text-primary-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-base hover:opacity-90 transition-opacity active:scale-[0.98] shadow-lg shadow-primary/20">
          Get Started <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Storytelling */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="mt-6 space-y-2">
          <p className="text-[11px] text-muted-foreground italic">"No hidden fees. Financial freedom, simplified."</p>
        </motion.div>

        {/* Badge */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="mt-6 inline-flex items-center gap-1.5 glass-card px-4 py-2 rounded-full">
          <span className="text-xs text-muted-foreground">Powered by</span>
          <span className="neon-gradient-text font-bold text-xs">Stellar</span>
          <span className="text-xs">⚡</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
