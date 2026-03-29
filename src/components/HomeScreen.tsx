import { motion } from 'framer-motion';
import { Copy, ArrowUpRight, ArrowDownLeft, Compass, Sparkles, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { BALANCE, WALLET_ADDRESS, TRANSACTIONS, SPENDING_DATA } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import ReceiveModal from './ReceiveModal';

interface HomeScreenProps {
  onNavigate: (tab: 'send' | 'explore') => void;
}

const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  const [showReceive, setShowReceive] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    toast({ title: 'Address copied!', description: 'Wallet address copied to clipboard' });
  };

  return (
    <div className="px-4 pb-28 pt-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Welcome back</p>
          <h1 className="text-xl font-bold text-foreground">StellarFlow</h1>
        </div>
        <div className="w-9 h-9 rounded-full neon-gradient flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-5 glow-green relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
        <p className="text-muted-foreground text-sm mb-1">Total Balance</p>
        <h2 className="text-3xl font-bold text-foreground glow-text-green">{BALANCE.xlm} <span className="text-lg text-muted-foreground">XLM</span></h2>
        <p className="text-sm text-muted-foreground mt-1">≈ {BALANCE.usd}</p>
        <button onClick={copyAddress} className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <span className="font-mono truncate max-w-[180px]">{WALLET_ADDRESS}</span>
          <Copy className="w-3 h-3 shrink-0" />
        </button>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3">
        {[
          { icon: ArrowUpRight, label: 'Send', color: 'text-primary', action: () => onNavigate('send') },
          { icon: ArrowDownLeft, label: 'Receive', color: 'text-accent', action: () => setShowReceive(true) },
          { icon: Compass, label: 'Explore', color: 'text-neon-purple', action: () => onNavigate('explore') },
        ].map((item) => (
          <button key={item.label} onClick={item.action}
            className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-secondary/50 transition-colors active:scale-95">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <span className="text-xs font-medium text-foreground">{item.label}</span>
          </button>
        ))}
      </motion.div>

      {/* AI Insight */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="glass-card p-4 flex items-center gap-3 gradient-border">
        <div className="w-8 h-8 rounded-lg neon-gradient flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <p className="text-xs text-secondary-foreground">You saved <span className="text-primary font-semibold">30% in fees</span> using Stellar this week 🎉</p>
      </motion.div>

      {/* Insights Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Weekly Spending</h3>
          <span className="text-xs text-muted-foreground">$555 total</span>
        </div>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SPENDING_DATA}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(260 10% 55%)', fontSize: 10 }} />
              <Bar dataKey="amount" fill="hsl(155 100% 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>7 transactions</span>
          <span>•</span>
          <span className="text-primary">↓ 12% vs last week</span>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h3 className="text-sm font-semibold text-foreground mb-3">Recent Transactions</h3>
        <div className="space-y-2">
          {TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="glass-card p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'sent' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                  {tx.type === 'sent' ? <ArrowUpRight className="w-4 h-4 text-destructive" /> : <ArrowDownLeft className="w-4 h-4 text-primary" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.type === 'sent' ? 'Sent' : 'Received'}</p>
                  <p className="text-xs text-muted-foreground">{tx.address} • {tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${tx.type === 'sent' ? 'text-destructive' : 'text-primary'}`}>
                  {tx.type === 'sent' ? '-' : '+'}{tx.amount} {tx.asset}
                </p>
                {tx.status === 'pending' && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                    <Clock className="w-2.5 h-2.5" /> Pending
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Powered by Stellar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-center py-4">
        <span className="text-xs text-muted-foreground">Powered by <span className="neon-gradient-text font-semibold">Stellar</span> ⚡</span>
      </motion.div>

      <ReceiveModal open={showReceive} onClose={() => setShowReceive(false)} />
    </div>
  );
};

export default HomeScreen;
