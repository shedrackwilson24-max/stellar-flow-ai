import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, ArrowUpRight, BarChart3, CalendarClock, CheckCircle2, Loader2, XCircle, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import { usePin } from '@/hooks/usePin';
import { stellarApi } from '@/lib/stellarApi';
import PinLock from './PinLock';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: { label: string; type: 'send' | 'navigate' | 'info'; data?: Record<string, string> };
  txPending?: { destination: string; amount: string; asset: string; memo?: string };
  txResult?: { status: 'success' | 'error'; hash?: string; message: string };
}

const EXAMPLE_PROMPTS = [
  { text: 'Send 5 XLM to GDEMO...', icon: ArrowUpRight },
  { text: 'Show my transactions', icon: BarChart3 },
  { text: 'Schedule weekly payment', icon: CalendarClock },
];

interface AIAssistantProps {
  onNavigate?: (tab: string) => void;
}

const AIAssistant = ({ onNavigate }: AIAssistantProps) => {
  const { wallet, refreshBalance } = useWallet();
  const { isPinSet, verifyPin } = usePin();
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: "Hi! I'm your **StellarFlow AI assistant**. I can actually send payments for you! Try: \"Send 5 XLM to G...\" or ask me anything." },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sendingTxId, setSendingTxId] = useState<string | null>(null);
  const [showPinFor, setShowPinFor] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const parseCommand = (text: string): Partial<Message> => {
    const lower = text.toLowerCase();

    // Send command parsing — match "send 5 xlm to GXXX..."
    const sendMatch = text.match(/send\s+(\d+\.?\d*)\s*(xlm|usdc|ngnx)?\s*(?:to\s+)?(G[A-Z0-9]{50,})/i);
    if (sendMatch) {
      const amount = sendMatch[1];
      const asset = (sendMatch[2] || 'XLM').toUpperCase();
      const destination = sendMatch[3];
      return {
        content: `I'll send **${amount} ${asset}** to \`${destination.slice(0, 8)}...${destination.slice(-6)}\`.\n\n💰 Amount: ${amount} ${asset}\n💸 Fee: ~0.00001 XLM\n\nApprove the transaction below:`,
        txPending: { destination, amount, asset },
      };
    }

    // Loose send command without valid address
    const looseSend = lower.match(/send\s+(\d+\.?\d*)\s*(xlm|usdc|ngnx)?\s*(to\s+)?(.+)?/i);
    if (looseSend) {
      const amount = looseSend[1];
      const asset = (looseSend[2] || 'XLM').toUpperCase();
      const recipient = looseSend[4]?.trim() || 'someone';
      return {
        content: `I'd love to send **${amount} ${asset}** to **${recipient}**, but I need a valid Stellar address (starts with G, 56 characters).\n\nTry: *"Send ${amount} ${asset} to GABC...XYZ"*`,
      };
    }

    if (lower.includes('transaction') || lower.includes('history') || lower.includes('activity')) {
      return {
        content: "Opening your **Activity** screen with full transaction history.",
        action: { label: 'View Activity', type: 'navigate', data: { tab: 'activity' } },
      };
    }

    if (lower.includes('balance') || lower.includes('wallet')) {
      return {
        content: "Let me show your wallet balance on the home screen.",
        action: { label: 'View Balance', type: 'navigate', data: { tab: 'home' } },
      };
    }

    if (lower.includes('contact')) {
      return {
        content: "Opening your **Contacts** list.",
        action: { label: 'View Contacts', type: 'navigate', data: { tab: 'contacts' } },
      };
    }

    if (lower.includes('explore') || lower.includes('token') || lower.includes('usdc')) {
      return {
        content: "Opening the **Explore** screen to browse Stellar assets.",
        action: { label: 'Explore Tokens', type: 'navigate', data: { tab: 'explore' } },
      };
    }

    if (lower.includes('schedule') || lower.includes('recurring')) {
      return {
        content: "Let me take you to the **Send** screen where you can set up payments.",
        action: { label: 'Go to Send', type: 'navigate', data: { tab: 'send' } },
      };
    }

    return {
      content: "I can **actually send payments** for you! Try:\n\n• *\"Send 10 XLM to GABC...XYZ\"*\n• *\"Show my transactions\"*\n• *\"Check my balance\"*\n• *\"Show contacts\"*\n\nJust paste a Stellar address and I'll handle the rest!",
    };
  };

  const handleAction = (action: Message['action']) => {
    if (action?.type === 'navigate' && action.data?.tab && onNavigate) {
      onNavigate(action.data.tab);
    }
  };

  const handleApproveTx = (msgId: string) => {
    if (!wallet) {
      toast({ title: 'No wallet', description: 'Create a wallet first in Profile', variant: 'destructive' });
      return;
    }
    if (isPinSet) {
      setShowPinFor(msgId);
    } else {
      executeTx(msgId);
    }
  };

  const handlePinSuccess = (pin: string) => {
    if (!showPinFor) return;
    if (verifyPin(pin)) {
      const msgId = showPinFor;
      setShowPinFor(null);
      executeTx(msgId);
    } else {
      toast({ title: 'Wrong PIN', description: 'Please try again', variant: 'destructive' });
    }
  };

  const executeTx = async (msgId: string) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg?.txPending || !wallet) return;

    setSendingTxId(msgId);

    try {
      const result = await stellarApi.sendPayment({
        secretKey: wallet.secretKey,
        destination: msg.txPending.destination,
        amount: msg.txPending.amount,
        memo: msg.txPending.memo,
      });

      setMessages(prev => prev.map(m =>
        m.id === msgId
          ? { ...m, txPending: undefined, txResult: { status: 'success', hash: result.hash, message: `Sent ${msg.txPending!.amount} ${msg.txPending!.asset} successfully!` } }
          : m
      ));

      await refreshBalance();
      toast({ title: 'Payment sent! ✅', description: 'Transaction confirmed on Stellar network.' });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Transaction failed';
      setMessages(prev => prev.map(m =>
        m.id === msgId
          ? { ...m, txPending: undefined, txResult: { status: 'error', message: errMsg } }
          : m
      ));
      toast({ title: 'Transaction failed', description: errMsg, variant: 'destructive' });
    } finally {
      setSendingTxId(null);
    }
  };

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);

    setTyping(true);
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    setTyping(false);

    const response = parseCommand(msg);
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content || '',
      action: response.action,
      txPending: response.txPending,
    };
    setMessages(prev => [...prev, aiMsg]);
  };

  if (showPinFor) {
    return (
      <div className="max-w-md mx-auto">
        <PinLock mode="verify" onSuccess={handlePinSuccess} onCancel={() => setShowPinFor(null)} title="Confirm Payment" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 pt-6 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg neon-gradient flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">AI Assistant</h1>
            <p className="text-[10px] text-primary animate-pulse-glow">Online • Can send real transactions</p>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'neon-gradient text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5' : 'glass-card px-4 py-3 rounded-2xl rounded-bl-md'}`}>
                <p className="text-sm whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/`([^`]+)`/g, '<code class="text-xs bg-secondary/50 px-1 py-0.5 rounded">$1</code>') }}
                />

                {/* Transaction approval card */}
                {msg.txPending && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 bg-secondary/30 rounded-xl p-3 space-y-2 border border-border/30">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">To</span>
                      <span className="text-foreground font-mono">{msg.txPending.destination.slice(0, 8)}...{msg.txPending.destination.slice(-6)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="text-foreground font-semibold">{msg.txPending.amount} {msg.txPending.asset}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Fee</span>
                      <span className="text-primary">~0.00001 XLM</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleApproveTx(msg.id)}
                        disabled={sendingTxId === msg.id}
                        className="flex-1 neon-gradient text-primary-foreground text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-50">
                        {sendingTxId === msg.id ? (
                          <><Loader2 className="w-3 h-3 animate-spin" /> Sending...</>
                        ) : (
                          <><CheckCircle2 className="w-3 h-3" /> {isPinSet ? '🔒 Approve' : 'Approve & Send'}</>
                        )}
                      </button>
                      <button
                        onClick={() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, txPending: undefined, txResult: { status: 'error', message: 'Cancelled by user' } } : m))}
                        className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Transaction result */}
                {msg.txResult && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className={`mt-3 rounded-xl p-3 border ${msg.txResult.status === 'success' ? 'bg-primary/10 border-primary/20' : 'bg-destructive/10 border-destructive/20'}`}>
                    <div className="flex items-center gap-2">
                      {msg.txResult.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive shrink-0" />
                      )}
                      <span className={`text-xs font-medium ${msg.txResult.status === 'success' ? 'text-primary' : 'text-destructive'}`}>
                        {msg.txResult.message}
                      </span>
                    </div>
                    {msg.txResult.hash && (
                      <p className="text-[10px] text-muted-foreground mt-1.5 font-mono break-all">
                        TX: {msg.txResult.hash.slice(0, 16)}...{msg.txResult.hash.slice(-8)}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Navigation action button */}
                {msg.action && !msg.txPending && !msg.txResult && (
                  <button onClick={() => handleAction(msg.action)}
                    className="mt-2 bg-primary/20 text-primary text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-primary/30 transition-colors flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" /> {msg.action.label}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        {messages.length === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="space-y-2 pt-2">
            <p className="text-xs text-muted-foreground">Try a command:</p>
            {EXAMPLE_PROMPTS.map(p => (
              <button key={p.text} onClick={() => sendMessage(p.text)}
                className="w-full glass-card p-3 flex items-center gap-3 text-left hover:bg-secondary/50 transition-colors active:scale-[0.98]">
                <p.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground">{p.text}</span>
              </button>
            ))}
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-24 pt-2">
        <div className="glass-card flex items-center gap-2 p-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Send 10 XLM to GABC..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none px-2" />
          <button onClick={() => sendMessage()} disabled={!input.trim()}
            className="w-8 h-8 rounded-lg neon-gradient flex items-center justify-center disabled:opacity-30 transition-opacity">
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
