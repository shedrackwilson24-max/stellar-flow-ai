import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Loader2, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import ScheduledPayments from './ScheduledPayments';

const ASSETS = ['XLM', 'USDC', 'GAME', 'NGNX'];

const SendScreen = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('XLM');
  const [showAssets, setShowAssets] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!recipient || !amount) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setShowConfirm(true);
  };

  const confirmSend = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSending(false);
    setSent(true);
    setTimeout(() => {
      setShowConfirm(false);
      setSent(false);
      setRecipient('');
      setAmount('');
      toast({ title: 'Transaction sent!', description: `${amount} ${asset} sent successfully` });
    }, 1500);
  };

  return (
    <div className="px-4 pb-28 pt-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground">Send Money</h1>
        <p className="text-sm text-muted-foreground">Transfer funds instantly on Stellar</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-5 space-y-4">
        {/* Recipient */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Recipient Address</label>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="G..."
            className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Amount</label>
          <div className="flex gap-2">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              type="number"
              className="flex-1 bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button onClick={() => setShowAssets(!showAssets)}
              className="glass-card px-4 py-3 flex items-center gap-2 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors min-w-[90px] justify-center">
              {asset} <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          {showAssets && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="mt-2 glass-card p-2 space-y-1">
              {ASSETS.map((a) => (
                <button key={a} onClick={() => { setAsset(a); setShowAssets(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${a === asset ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary/50'}`}>
                  {a}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Send Button */}
        <button onClick={handleSend}
          className="w-full neon-gradient text-primary-foreground font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98]">
          <ArrowUpRight className="w-4 h-4" /> Send {asset}
        </button>
      </motion.div>

      {/* Scheduled Payments */}
      <ScheduledPayments />

      {/* Confirm Modal */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="glass-card border-border/50 max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {sent ? 'Transaction Sent!' : 'Confirm Transaction'}
            </DialogTitle>
          </DialogHeader>
          {sent ? (
            <div className="flex flex-col items-center py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <CheckCircle2 className="w-16 h-16 text-primary" />
              </motion.div>
              <p className="text-sm text-muted-foreground mt-3">Successfully sent</p>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">To</span>
                <span className="text-foreground font-mono text-xs truncate max-w-[180px]">{recipient}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-foreground font-semibold">{amount} {asset}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fee</span>
                <span className="text-primary text-xs">~0.00001 XLM</span>
              </div>
            </div>
          )}
          {!sent && (
            <DialogFooter>
              <button onClick={confirmSend} disabled={sending}
                className="w-full neon-gradient text-primary-foreground font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Send'}
              </button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SendScreen;
