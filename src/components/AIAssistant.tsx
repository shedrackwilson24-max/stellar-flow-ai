import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, ArrowUpRight, BarChart3, CalendarClock } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: { label: string; icon: 'send' | 'chart' | 'schedule' };
}

const EXAMPLE_PROMPTS = [
  { text: 'Send 5 XLM to John', icon: ArrowUpRight },
  { text: 'Track my spending', icon: BarChart3 },
  { text: 'Schedule weekly payment', icon: CalendarClock },
];

const AI_RESPONSES: Record<string, { content: string; action?: Message['action'] }> = {
  'send': {
    content: "I'll send **5 XLM** to John's wallet. The transaction fee will be ~0.00001 XLM. Would you like to confirm?",
    action: { label: 'Confirm Send', icon: 'send' },
  },
  'track': {
    content: "Here's your spending summary:\n\n📊 **This Week:** $555\n📉 **vs Last Week:** -12%\n💸 **Biggest Expense:** 200 XLM on Friday\n✅ **Total Transactions:** 7\n\nYou're spending less than last week. Great job!",
    action: { label: 'View Details', icon: 'chart' },
  },
  'schedule': {
    content: "I can set up a recurring payment for you. Here's what I'll configure:\n\n📅 **Frequency:** Weekly\n💰 **Amount:** To be specified\n📬 **Recipient:** To be specified\n\nPlease provide the amount and recipient address.",
    action: { label: 'Set Up Schedule', icon: 'schedule' },
  },
};

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: "Hi! I'm your **StellarFlow AI assistant**. I can help you send payments, track spending, and manage schedules. What would you like to do?" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const getResponse = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('send')) return AI_RESPONSES['send'];
    if (lower.includes('track') || lower.includes('spending')) return AI_RESPONSES['track'];
    if (lower.includes('schedule') || lower.includes('weekly') || lower.includes('recurring')) return AI_RESPONSES['schedule'];
    return { content: "I understand your request. Let me help you with that. Could you provide more details about what you'd like to do? I can help with **sending payments**, **tracking spending**, or **scheduling recurring transfers**." };
  };

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msg };
    setMessages((prev) => [...prev, userMsg]);

    setTyping(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    setTyping(false);

    const response = getResponse(msg);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response.content, action: response.action };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 pt-6 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg neon-gradient flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">AI Assistant</h1>
            <p className="text-[10px] text-primary animate-pulse-glow">Online</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'neon-gradient text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5' : 'glass-card px-4 py-3 rounded-2xl rounded-bl-md'}`}>
                <p className="text-sm whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
                {msg.action && (
                  <button className="mt-2 bg-primary/20 text-primary text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-primary/30 transition-colors">
                    {msg.action.label}
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
            <p className="text-xs text-muted-foreground">Try asking:</p>
            {EXAMPLE_PROMPTS.map((p) => (
              <button key={p.text} onClick={() => sendMessage(p.text)}
                className="w-full glass-card p-3 flex items-center gap-3 text-left hover:bg-secondary/50 transition-colors">
                <p.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground">{p.text}</span>
              </button>
            ))}
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-24 pt-2">
        <div className="glass-card flex items-center gap-2 p-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none px-2"
          />
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
