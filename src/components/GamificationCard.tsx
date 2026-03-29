import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Award, Zap } from 'lucide-react';

const BADGES = [
  { icon: Zap, label: 'First Transaction', earned: true, color: 'text-primary' },
  { icon: Star, label: 'Frequent Sender', earned: true, color: 'text-accent' },
  { icon: Trophy, label: 'Investor', earned: false, color: 'text-neon-purple' },
  { icon: Award, label: 'Power User', earned: false, color: 'text-destructive' },
];

const GamificationCard = () => {
  const streak = 3;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Achievements</h3>
        <div className="flex items-center gap-1 text-xs font-semibold text-orange-400">
          <Flame className="w-4 h-4" /> {streak}-day streak
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {BADGES.map((badge, i) => (
          <motion.div key={badge.label}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
              badge.earned ? 'glass-card' : 'opacity-30'
            }`}>
            <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center ${badge.earned ? badge.color : 'text-muted-foreground'}`}>
              <badge.icon className="w-4 h-4" />
            </div>
            <span className="text-[9px] text-muted-foreground text-center leading-tight">{badge.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="bg-secondary/50 rounded-xl p-2.5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Level Progress</span>
          <span className="text-foreground font-semibold">2/4 badges</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: '50%' }} transition={{ delay: 0.5, duration: 0.8 }}
            className="h-full neon-gradient rounded-full" />
        </div>
      </div>
    </motion.div>
  );
};

export default GamificationCard;
