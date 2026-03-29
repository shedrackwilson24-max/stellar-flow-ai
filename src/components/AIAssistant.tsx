import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, ArrowUpRight, BarChart3, CalendarClock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: { label: string; type: 'send' | 'navigate' | 'info'; data?: Record<string, string> };
}

const EXAMPLE_PROMPTS = [
  { text: 'Send 5 XLM to John', icon: ArrowUpRight },
  { text: 'Show my transactions', icon: BarChart3 },
  { text: 'Schedule weekly payment', icon: CalendarClock },
];

interface AIAssistantProps {
  onNavigate?: (tab: string) => void;
}

const AIAssistant = ({ onNavigate }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: "Hi! I'm your **StellarFlow AI assistant**. I can help you send payments, track spending, manage contacts, and navigate the app. Try a command below!" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const parseCommand = (text: string): { content: string; action?: Message['action'] } => {
    const lower = text.toLowerCase();

    // Send command parsing
    const sendMatch = lower.match(/send\s+(\d+\.?\d*)\s*(xlm|usdc|ngnx)?\s*(to\s+)?(.+)?/i);
    if (sendMatch) {
      const amount = sendMatch[1];
      const asset = (sendMatch[2] || 'XLM').toUpperCase();
      const recipient = sendMatch[4]?.trim() || 'recipient';
      return {
        content: `I'll prepare to send **${amount} ${asset}** to **${recipient}**.\n\n💰 Amount: ${amount} ${asset}\n👤 To: ${recipient}\n💸 Fee: ~0.00001 XLM\n\nWould you like to proceed?`,
        action: { label: 'Go to Send', type: 'navigate', data: { tab: 'send' } },
      };
    }

    // Show transactions
    if (lower.includes('transaction') || lower.includes('history') || lower.includes('activity')) {
      return {
        content: "Here's a quick summary:\n\n📊 **Recent Activity:**\n• 5 sent transactions\n• 5 received transactions\n• Total volume: ~2,000 XLM\n\nI'll open your Activity screen for full details.",
        action: { label: 'View Activity', type: 'navigate', data: { tab: 'activity' } },
      };
    }

    // Add token
    if (lower.includes('add') && (lower.includes('token') || lower.includes('usdc') || lower.includes('ngnx'))) {
      return {
        content: "I can help you discover and add tokens! Let me open the **Explore** screen where you can browse all available assets on Stellar.",
        action: { label: 'Explore Tokens', type: 'navigate', data: { tab: 'explore' } },
      };
    }

    // Track spending
    if (lower.includes('track') || lower.includes('spending') || lower.includes('insight')) {
      return {
        content: "Here's your spending summary:\n\n📊 **This Week:** $555\n📉 **vs Last Week:** -12%\n💸 **Biggest Expense:** 200 XLM on Friday\n✅ **Total Transactions:** 7\n\n💡 *Tip: You're spending less than last week. Keep it up!*",
        action: { label: 'View Insights', type: 'navigate', data: { tab: 'home' } },
      };
    }

    // Schedule
    if (lower.includes('schedule') || lower.includes('recurring') || lower.includes('weekly')) {
      return {
        content: "I can set up a recurring payment:\n\n📅 **Frequency:** Weekly\n💰 **Amount:** Specify in Send screen\n📬 **Recipient:** Choose from contacts\n\nLet me take you to the Send screen.",
        action: { label: 'Set Up Schedule', type: 'navigate', data: { tab: 'send' } },
      };
    }

    // Contacts
    if (lower.includes('contact')) {
      return {
        content: "You have **3 saved contacts**. I'll open your contacts list where you can add new ones or send money directly.",
        action: { label: 'View Contacts', type: 'navigate', data: { tab: 'contacts' } },
      };
    }

    // Balance
    if (lower.includes('balance') || lower.includes('wallet')) {
      return {
        content: "Let me check your wallet. I'll take you to the home screen where you can see your full balance and refresh it in real-time.",
        action: { label: 'View Balance', type: 'navigate', data: { tab: 'home' } },
      };
    }

    return {
      content: "I can help with:\n\n• **Send payments** — *\"Send 5 XLM to John\"*\n• **View transactions** — *\"Show my history\"*\n• **Track spending** — *\"Track my spending\"*\n• **Manage contacts** — *\"Show contacts\"*\n• **Explore tokens** — *\"Add USDC token\"*\n\nWhat would you like to do?",
    };
  };

  const handleAction = (action: Message['action']) => {
    if (action?.type === 'navigate' && action.data?.tab && onNavigate) {
      onNavigate(action.data.tab);
    }
  };

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msg };
    setMessages((prev) => [...prev, userMsg]);

    setTyping(true);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    setTyping(false);

    const response = parseCommand(msg);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response.content, action: response.action };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 pt-6 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg neon-gradient flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">AI Assistant</h1>
            <p className="text-[10px] text-primary animate-pulse-glow">Online • Action Mode</p>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'neon-gradient text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5' : 'glass-card px-4 py-3 rounded-2xl rounded-bl-md'}`}>
                <p className="text-sm whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }}
                />
                {msg.action && (
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
            {EXAMPLE_PROMPTS.map((p) => (
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
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a command..."
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
