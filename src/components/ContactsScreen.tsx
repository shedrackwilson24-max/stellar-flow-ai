import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Send, UserPlus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  name: string;
  address: string;
  color: string;
}

const COLORS = [
  'bg-primary/20 text-primary',
  'bg-accent/20 text-accent',
  'bg-neon-purple/20 text-neon-purple',
  'bg-destructive/20 text-destructive',
];

const DEFAULT_CONTACTS: Contact[] = [
  { id: '1', name: 'Alice Chen', address: 'GBKX...4F2Q', color: COLORS[0] },
  { id: '2', name: 'Bob Johnson', address: 'GCWZ...8K3R', color: COLORS[1] },
  { id: '3', name: 'Carol Smith', address: 'GDPK...9M1T', color: COLORS[2] },
];

interface ContactsScreenProps {
  onSendTo?: (address: string) => void;
}

const ContactsScreen = ({ onSendTo }: ContactsScreenProps) => {
  const [contacts, setContacts] = useState<Contact[]>(DEFAULT_CONTACTS);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const getInitials = (n: string) => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const addContact = () => {
    if (!name.trim() || !address.trim()) {
      toast({ title: 'Missing info', description: 'Enter name and address', variant: 'destructive' });
      return;
    }
    const newContact: Contact = {
      id: Date.now().toString(),
      name: name.trim(),
      address: address.trim(),
      color: COLORS[contacts.length % COLORS.length],
    };
    setContacts(prev => [...prev, newContact]);
    setName('');
    setAddress('');
    setShowAdd(false);
    toast({ title: 'Contact saved! ✅', description: `${newContact.name} added to contacts` });
  };

  return (
    <div className="px-4 pb-28 pt-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Contacts</h1>
          <p className="text-sm text-muted-foreground">{contacts.length} saved contacts</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="w-9 h-9 rounded-xl neon-gradient flex items-center justify-center active:scale-95 transition-transform">
          <Plus className="w-4 h-4 text-primary-foreground" />
        </button>
      </motion.div>

      <div className="space-y-2">
        {contacts.map((c, i) => (
          <motion.div key={c.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${c.color}`}>
              {getInitials(c.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground font-mono truncate">{c.address}</p>
            </div>
            {onSendTo && (
              <button onClick={() => onSendTo(c.address)}
                className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Send className="w-3.5 h-3.5 text-primary" />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add Contact Modal */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="glass-card border-border/50 max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" /> Add Contact
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contact name"
                className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Wallet Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="G..."
                className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono" />
            </div>
            <button onClick={addContact}
              className="w-full neon-gradient text-primary-foreground font-semibold py-3 rounded-xl active:scale-[0.98] transition-transform">
              Save Contact
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsScreen;
