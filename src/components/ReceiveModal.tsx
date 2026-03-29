import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy } from 'lucide-react';
import { WALLET_ADDRESS } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';

interface ReceiveModalProps {
  open: boolean;
  onClose: () => void;
}

const ReceiveModal = ({ open, onClose }: ReceiveModalProps) => {
  const copyAddress = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    toast({ title: 'Copied!', description: 'Wallet address copied' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card border-border/50 max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-foreground">Receive Payment</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-5 py-4">
          <div className="bg-foreground p-4 rounded-2xl">
            <QRCode value={WALLET_ADDRESS} size={180} bgColor="hsl(0 0% 95%)" fgColor="hsl(260 20% 6%)" />
          </div>
          <div className="w-full">
            <p className="text-xs text-muted-foreground mb-2 text-center">Your Wallet Address</p>
            <button onClick={copyAddress}
              className="w-full glass-card p-3 flex items-center justify-between hover:bg-secondary/50 transition-colors">
              <span className="font-mono text-xs text-foreground truncate">{WALLET_ADDRESS}</span>
              <Copy className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiveModal;
