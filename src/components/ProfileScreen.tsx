import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, LogOut, Key, Shield, ChevronRight, Wallet } from 'lucide-react';
import { WALLET_ADDRESS } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

const ProfileScreen = () => {
  const [hasWallet, setHasWallet] = useState(true);

  const copyAddress = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    toast({ title: 'Copied!', description: 'Wallet address copied to clipboard' });
  };

  const createWallet = () => {
    setHasWallet(true);
    toast({ title: 'Wallet Created!', description: 'Your new Stellar wallet is ready' });
  };

  return (
    <div className="px-4 pb-28 pt-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your wallet & settings</p>
      </motion.div>

      {/* Wallet Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-5 glow-blue relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent/5 blur-3xl" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl neon-gradient flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Stellar Wallet</p>
            <p className="text-xs text-primary">Connected</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Public Key</p>
          <button onClick={copyAddress}
            className="w-full bg-secondary/50 rounded-xl p-3 flex items-center justify-between hover:bg-secondary/70 transition-colors">
            <span className="font-mono text-xs text-foreground truncate">{WALLET_ADDRESS}</span>
            <Copy className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
          </button>
        </div>
      </motion.div>

      {/* Wallet Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground mb-2">Wallet</h3>
        {[
          { icon: Key, label: 'Create New Wallet', desc: 'Generate a new Stellar keypair', action: createWallet },
          { icon: Download, label: 'Import Wallet', desc: 'Import with secret key', action: () => toast({ title: 'Import', description: 'Import wallet functionality (simulated)' }) },
        ].map((item) => (
          <button key={item.label} onClick={item.action}
            className="w-full glass-card p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <item.icon className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </motion.div>

      {/* Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground mb-2">Settings</h3>
        {[
          { icon: Shield, label: 'Security', desc: 'Backup & recovery options' },
        ].map((item) => (
          <button key={item.label}
            className="w-full glass-card p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <item.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </motion.div>

      {/* Logout */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <button className="w-full glass-card p-4 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </motion.div>

      {/* Powered by Stellar */}
      <div className="text-center py-4">
        <span className="text-xs text-muted-foreground">Powered by <span className="neon-gradient-text font-semibold">Stellar</span> ⚡</span>
      </div>
    </div>
  );
};

export default ProfileScreen;
