import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav, { Tab } from '@/components/BottomNav';
import HomeScreen from '@/components/HomeScreen';
import SendScreen from '@/components/SendScreen';
import ExploreScreen from '@/components/ExploreScreen';
import AIAssistant from '@/components/AIAssistant';
import ProfileScreen from '@/components/ProfileScreen';
import ActivityScreen from '@/components/ActivityScreen';
import ContactsScreen from '@/components/ContactsScreen';
import WelcomeScreen from '@/components/WelcomeScreen';
import PinLock from '@/components/PinLock';
import { WalletProvider } from '@/hooks/useWallet';
import { PinProvider, usePin } from '@/hooks/usePin';

const WELCOME_KEY = 'stellarflow_welcomed';

const AppContent = () => {
  const [welcomed, setWelcomed] = useState(() => !!localStorage.getItem(WELCOME_KEY));
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { isPinSet, isLocked, verifyPin, unlockWallet } = usePin();
  const [pinError, setPinError] = useState(false);

  const handleWelcome = () => {
    localStorage.setItem(WELCOME_KEY, '1');
    setWelcomed(true);
  };

  const handlePinVerify = (pin: string) => {
    if (verifyPin(pin)) {
      unlockWallet();
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  if (!welcomed) {
    return <WelcomeScreen onGetStarted={handleWelcome} />;
  }

  if (isPinSet && isLocked) {
    return (
      <div className="max-w-md mx-auto">
        <PinLock mode="verify" onSuccess={handlePinVerify} title={pinError ? 'Wrong PIN. Try again' : undefined} />
      </div>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
      case 'send':
        return <SendScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'ai':
        return <AIAssistant onNavigate={(tab) => setActiveTab(tab as Tab)} />;
      case 'profile':
        return <ProfileScreen />;
      case 'activity':
        return <ActivityScreen />;
      case 'contacts':
        return <ContactsScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}>
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

const Index = () => {
  return (
    <WalletProvider>
      <PinProvider>
        <AppContent />
      </PinProvider>
    </WalletProvider>
  );
};

export default Index;
