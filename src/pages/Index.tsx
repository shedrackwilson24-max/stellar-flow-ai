import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import HomeScreen from '@/components/HomeScreen';
import SendScreen from '@/components/SendScreen';
import ExploreScreen from '@/components/ExploreScreen';
import AIAssistant from '@/components/AIAssistant';
import ProfileScreen from '@/components/ProfileScreen';

type Tab = 'home' | 'send' | 'explore' | 'ai' | 'profile';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={(tab) => setActiveTab(tab)} />;
      case 'send':
        return <SendScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'ai':
        return <AIAssistant />;
      case 'profile':
        return <ProfileScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
