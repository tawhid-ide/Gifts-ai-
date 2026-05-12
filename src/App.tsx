/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useEffect, ReactNode, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  Gift, 
  User, 
  Calendar, 
  DollarSign, 
  Heart, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  ExternalLink, 
  RefreshCcw,
  Share2,
  Check,
  Gamepad2,
  Home,
  Book,
  Zap,
  ShoppingBag,
  Dumbbell,
  Music,
  ChefHat,
  MessageSquare,
  X,
  Send,
  Menu,
  Sun,
  Moon
} from 'lucide-react';

// --- Types ---

interface Product {
  title: string;
  description: string;
  reason: string;
  price_range: string;
  amazon_search: string;
  category: string;
}

interface SelectionState {
  recipient: string;
  ageRange: string;
  budget: string;
  occasion: string;
  interests: string[];
  customNotes: Record<string, string>;
}

// --- Constants ---

const RECIPIENTS = ['Friend', 'Partner', 'Parent', 'Child', 'Colleague', 'Myself'];
const AGE_RANGES = ['Under 18', '18-25', '26-35', '36-50', '50+'];
const BUDGETS = ['Under $20', '$20-50', '$50-100', '$100-200', '$200+'];
const OCCASIONS = ['Birthday', 'Anniversary', 'Holiday', 'Just Because', 'Graduation'];
const INTERESTS = [
  { id: 'Tech', icon: Zap },
  { id: 'Gaming', icon: Gamepad2 },
  { id: 'Fashion', icon: ShoppingBag },
  { id: 'Books', icon: Book },
  { id: 'Fitness', icon: Dumbbell },
  { id: 'Home', icon: Home },
  { id: 'Music', icon: Music },
  { id: 'Cooking', icon: ChefHat },
];

const AFFILIATE_TAG = import.meta.env.VITE_AMAZON_TAG || 'tawhidinsan-20';

// --- AI Initialization helper ---
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is missing. Please add it to your environment variables in Netlify.");
  }
  return new GoogleGenAI({ apiKey });
};

const LOADING_MESSAGES = [
  "Analyzing your preferences...",
  "Searching thousands of products...",
  "Finding the best deals on Amazon...",
  "Curating personalized recommendations...",
  "Almost there! Wrapping up your gifts..."
];

const LoadingOverlay = ({ theme }: { theme: 'light' | 'dark' }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const overlayBg = theme === 'dark' ? 'bg-[#0a0a0a]/90' : 'bg-white/90';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 ${overlayBg} backdrop-blur-md flex flex-col items-center justify-center p-6 text-center`}
    >
      <div className="relative w-24 h-24 mb-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-[#48e2ff]/20 border-t-[#48e2ff] rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Gift className="text-[#48e2ff] animate-pulse" size={32} />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.h2 
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`text-2xl font-bold mb-2 h-8 ${textColor}`}
        >
          {LOADING_MESSAGES[messageIndex]}
        </motion.h2>
      </AnimatePresence>
      <p className={`${mutedText} max-w-xs`}>Our AI is analyzing your preferences to find the best matches on Amazon.</p>
      
      <div className="mt-12 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 bg-[#48e2ff] rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
};

const FeedbackModal = ({ isOpen, onClose, theme }: { isOpen: boolean, onClose: () => void, theme: 'light' | 'dark' }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  
  const modalBg = theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-black/10 shadow-2xl';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const inputBg = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    
    const formData = new FormData(e.currentTarget);
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 2000);
    } catch (error) {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`${modalBg} border w-full max-w-md rounded-3xl p-8 relative overflow-hidden`}
      >
        <button onClick={onClose} className={`absolute top-4 right-4 ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'} transition-colors`}>
          <X size={24} />
        </button>

        {status === 'success' ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <Check size={32} />
            </div>
            <h2 className={`text-2xl font-bold ${textColor}`}>Thank You!</h2>
            <p className={mutedText}>Your feedback has been received.</p>
          </div>
        ) : (
          <>
            <h2 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${textColor}`}>
              <MessageSquare className="text-[#48e2ff]" size={24} />
              Feedback & Reports
            </h2>
            <p className={`${mutedText} mb-6 text-sm`}>Have a suggestion or found a bug? Let us know!</p>
            
            <form onSubmit={handleSubmit} className="space-y-4" name="feedback" data-netlify="true">
              <input type="hidden" name="form-name" value="feedback" />
              <div>
                <label className={`text-xs font-bold ${mutedText} uppercase mb-2 block`}>Email (Optional)</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="your@email.com" 
                  className={`w-full ${inputBg} border rounded-xl p-3 outline-none focus:border-[#48e2ff]/50 transition-all ${textColor}`}
                />
              </div>
              <div>
                <label className={`text-xs font-bold ${mutedText} uppercase mb-2 block`}>Message</label>
                <textarea 
                  required
                  name="message"
                  placeholder="How can we improve?" 
                  className={`w-full ${inputBg} border rounded-xl p-3 outline-none focus:border-[#48e2ff]/50 transition-all ${textColor} h-32 resize-none`}
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={status === 'sending'}
                className="w-full py-4 bg-[#48e2ff] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {status === 'sending' ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'home' | 'how-it-works' | 'categories' | 'about'>('home');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    }
    return 'dark';
  });
  const [selections, setSelections] = useState<SelectionState>({
    recipient: '',
    ageRange: '',
    budget: '',
    occasion: '',
    interests: [],
    customNotes: {},
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleSelection = (key: keyof SelectionState, value: string) => {
    if (key === 'customNotes') return; // Should not happen with this signature
    setSelections(prev => ({ ...prev, [key]: value }));
    if (key !== 'interests') {
      setStep(prev => prev + 1);
    }
  };

  const handleNoteChange = (key: string, value: string) => {
    setSelections(prev => ({
      ...prev,
      customNotes: { ...prev.customNotes, [key]: value }
    }));
  };

  const toggleInterest = (interest: string) => {
    setSelections(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const findGifts = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = getAI();
      const prompt = `Suggest 5 Amazon products for the following situation:
      Recipient: ${selections.recipient} ${selections.customNotes.recipient ? `(Extra detail: ${selections.customNotes.recipient})` : ''}
      Age Range: ${selections.ageRange} ${selections.customNotes.ageRange ? `(Extra detail: ${selections.customNotes.ageRange})` : ''}
      Budget: ${selections.budget} ${selections.customNotes.budget ? `(Extra detail: ${selections.customNotes.budget})` : ''}
      Occasion: ${selections.occasion} ${selections.customNotes.occasion ? `(Extra detail: ${selections.customNotes.occasion})` : ''}
      Interests: ${selections.interests.join(', ')} ${selections.customNotes.interests ? `(Extra detail: ${selections.customNotes.interests})` : ''}

      Return a JSON array of objects with exactly these fields:
      title: string,
      description: string,
      reason: string,
      price_range: string,
      amazon_search: string,
      category: string

      Only JSON, no markdown, no explanation.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                reason: { type: Type.STRING },
                price_range: { type: Type.STRING },
                amazon_search: { type: Type.STRING },
                category: { type: Type.STRING },
              },
              required: ['title', 'description', 'reason', 'price_range', 'amazon_search', 'category'],
            },
          },
        },
      });

      const data = JSON.parse(response.text || '[]');
      setResults(data);
      setStep(6); // Results step
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to get suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setSelections({
      recipient: '',
      ageRange: '',
      budget: '',
      occasion: '',
      interests: [],
      customNotes: {},
    });
    setResults([]);
    setError(null);
  };

  const shareResults = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAmazonLink = (searchTerm: string) => {
    return `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}&tag=${AFFILIATE_TAG}`;
  };

  const renderStep = () => {
    const cardBg = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

    switch (step) {
      case 0: // Welcome/Intro
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 space-y-8"
          >
            <div className="inline-block p-4 rounded-full bg-[#48e2ff]/10 text-[#48e2ff] mb-4">
              <Gift size={48} />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Find the <span className="text-[#48e2ff]">Perfect Gift</span> with AI
            </h1>
            <p className={`text-xl ${mutedText} max-w-2xl mx-auto`}>
              Answer a few simple questions and let our AI analyze thousands of 
              products to find the ideal match for your loved ones.
            </p>
            <button 
              onClick={() => setStep(1)}
              className="px-10 py-5 bg-[#48e2ff] text-black font-bold rounded-full text-xl hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-lg shadow-[#48e2ff]/20"
            >
              Start Finding <ChevronRight size={24} />
            </button>
          </motion.div>
        );

      case 1: // Recipient
        return (
          <StepContainer 
            title="Who is the gift for?" 
            icon={<User className="text-[#48e2ff]" />}
            onBack={() => setStep(0)}
            theme={theme}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {RECIPIENTS.map(name => (
                <OptionButton 
                  key={name}
                  label={name} 
                  selected={selections.recipient === name}
                  onClick={() => handleSelection('recipient', name)}
                  theme={theme}
                />
              ))}
            </div>
            <CustomNoteInput 
              value={selections.customNotes.recipient || ''} 
              onChange={(val) => handleNoteChange('recipient', val)}
              placeholder="e.g. A technology-loving friend who is also a digital nomad"
              theme={theme}
            />
          </StepContainer>
        );

      case 2: // Age Range
        return (
          <StepContainer 
            title="How old are they?" 
            icon={<Calendar className="text-[#48e2ff]" />}
            onBack={() => setStep(1)}
            theme={theme}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {AGE_RANGES.map(range => (
                <OptionButton 
                  key={range}
                  label={range} 
                  selected={selections.ageRange === range}
                  onClick={() => handleSelection('ageRange', range)}
                  theme={theme}
                />
              ))}
            </div>
            <CustomNoteInput 
              value={selections.customNotes.ageRange || ''} 
              onChange={(val) => handleNoteChange('ageRange', val)}
              placeholder="e.g. Turning 21 soon, very mature for their age"
              theme={theme}
            />
          </StepContainer>
        );

      case 3: // Budget
        return (
          <StepContainer 
            title="What's your budget?" 
            icon={<DollarSign className="text-[#48e2ff]" />}
            onBack={() => setStep(2)}
            theme={theme}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {BUDGETS.map(budget => (
                <OptionButton 
                  key={budget}
                  label={budget} 
                  selected={selections.budget === budget}
                  onClick={() => handleSelection('budget', budget)}
                  theme={theme}
                />
              ))}
            </div>
            <CustomNoteInput 
              value={selections.customNotes.budget || ''} 
              onChange={(val) => handleNoteChange('budget', val)}
              placeholder="e.g. Willing to go up to $300 for something exceptional"
              theme={theme}
            />
          </StepContainer>
        );

      case 4: // Occasion
        return (
          <StepContainer 
            title="What's the occasion?" 
            icon={<Heart className="text-[#48e2ff]" />}
            onBack={() => setStep(3)}
            theme={theme}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {OCCASIONS.map(occ => (
                <OptionButton 
                  key={occ}
                  label={occ} 
                  selected={selections.occasion === occ}
                  onClick={() => handleSelection('occasion', occ)}
                  theme={theme}
                />
              ))}
            </div>
            <CustomNoteInput 
              value={selections.customNotes.occasion || ''} 
              onChange={(val) => handleNoteChange('occasion', val)}
              placeholder="e.g. 5th Wedding Anniversary"
              theme={theme}
            />
            <button 
              onClick={() => setStep(5)}
              className={`w-full mt-6 py-4 ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} ${textColor} font-bold rounded-xl transition-all flex items-center justify-center gap-2`}
            >
              Next Step <ChevronRight size={20} />
            </button>
          </StepContainer>
        );

      case 5: // Interests
        return (
          <StepContainer 
            title="What are their interests?" 
            icon={<Zap className="text-[#48e2ff]" />}
            onBack={() => setStep(4)}
            theme={theme}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {INTERESTS.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => toggleInterest(id)}
                  className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                    selections.interests.includes(id)
                      ? 'bg-[#48e2ff]/20 border-[#48e2ff] text-[#48e2ff]'
                      : `${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-white/20 text-gray-400' : 'bg-black/5 border-black/10 hover:border-black/20 text-gray-600'}`
                  }`}
                >
                  <Icon size={32} />
                  <span className="font-medium">{id}</span>
                </button>
              ))}
            </div>
            <div className="mb-8">
              <CustomNoteInput 
                value={selections.customNotes.interests || ''} 
                onChange={(val) => handleNoteChange('interests', val)}
                placeholder="e.g. Specifically into mechanical keyboards and sci-fi books"
                theme={theme}
              />
            </div>
            <button 
              disabled={(selections.interests.length === 0 && !selections.customNotes.interests?.trim()) || loading}
              onClick={findGifts}
              className="w-full py-4 bg-[#48e2ff] text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Find Perfect Gifts'}
            </button>
          </StepContainer>
        );

      case 6: // Results
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`space-y-8 py-8 ${textColor}`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold">AI Recommended Gifts</h2>
                <p className={mutedText}>Based on your preferences for a {selections.recipient}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={shareResults}
                  className={`p-3 rounded-full ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'} transition-colors flex items-center gap-2`}
                >
                  {copied ? <Check size={20} className="text-green-400" /> : <Share2 size={20} />}
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
                <button 
                  onClick={reset}
                  className={`p-3 rounded-full ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'} transition-colors flex items-center gap-2`}
                >
                  <RefreshCcw size={20} />
                  <span>Start Over</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((product, idx) => (
                <ProductCard key={idx} product={product} link={getAmazonLink(product.amazon_search)} theme={theme} />
              ))}
            </div>

            <div className={`pt-12 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
              <h3 className="text-2xl font-bold mb-6">Explore Other Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Home Setup', 'Gaming Setup', 'Student Essentials', 'Fitness Gear'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => {
                      setSelections(prev => ({ ...prev, recipient: 'Myself', interests: [cat.split(' ')[0]] }));
                      setStep(1);
                    }}
                    className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10 hover:border-black/20'} hover:border-[#48e2ff]/50 transition-all text-left group`}
                  >
                    <div className="text-[#48e2ff] mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={24} />
                    </div>
                    <span className="font-bold">{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    if (loading) return <LoadingOverlay theme={theme} />;
    
    if (activeTab === 'how-it-works') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`space-y-12 py-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <h2 className="text-4xl font-bold text-center">How Gifts AI Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Tell us about them', desc: 'Answer simple questions about the recipient, occasion, and budget.' },
              { step: '02', title: 'AI Analysis', desc: 'Our advanced AI scans thousands of products to find the perfect matches.' },
              { step: '03', title: 'Get Results', desc: 'Receive personalized Amazon gift suggestions with direct purchase links.' }
            ].map((item, i) => (
              <div key={i} className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                <div className="text-4xl font-bold text-[#48e2ff] mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button onClick={() => setActiveTab('home')} className="px-8 py-4 bg-[#48e2ff] text-black font-bold rounded-full">Try it now</button>
          </div>
        </motion.div>
      );
    }

    if (activeTab === 'categories') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`space-y-12 py-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <h2 className="text-4xl font-bold text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Tech & Gadgets', 'Gaming Gear', 'Home Decor', 'Fitness', 'Books', 'Fashion', 'Kitchen', 'Music'].map((cat, i) => (
              <button 
                key={i} 
                onClick={() => {
                  setSelections(prev => ({ ...prev, interests: [cat] }));
                  setActiveTab('home');
                  setStep(1);
                }}
                className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-[#48e2ff]' : 'bg-black/5 border-black/10 hover:border-[#48e2ff]'} transition-all text-center`}
              >
                <div className="font-bold">{cat}</div>
              </button>
            ))}
          </div>
        </motion.div>
      );
    }

    if (activeTab === 'about') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`max-w-3xl mx-auto space-y-8 py-12 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <h2 className="text-4xl font-bold">About Gifts AI</h2>
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
            Gifts AI was created to solve the age-old problem of finding the perfect gift. 
            By combining the power of Google's Gemini AI with a curated selection process, 
            we help you find thoughtful, personalized gifts in seconds.
          </p>
          <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} italic`}>"Our mission is to make gift-giving effortless and meaningful."</p>
          </div>
        </motion.div>
      );
    }

    return renderStep();
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300 selection:bg-[#48e2ff]/30`}>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} theme={theme} />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-16 relative">
          <div 
            className="flex items-center gap-2 font-bold text-2xl cursor-pointer" 
            onClick={() => { setActiveTab('home'); reset(); setIsMenuOpen(false); }}
          >
            {import.meta.env.VITE_LOGO_URL ? (
              <img src={import.meta.env.VITE_LOGO_URL} alt="Logo" className="w-10 h-10 object-contain rounded-lg" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-10 h-10 bg-[#48e2ff] rounded-lg flex items-center justify-center text-black">
                <Gift size={24} />
              </div>
            )}
            <span>Gifts<span className="text-[#48e2ff]"> AI</span></span>
          </div>

          {/* Desktop Nav */}
          <nav className={`hidden md:flex gap-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-medium items-center`}>
            <button onClick={() => setActiveTab('how-it-works')} className={`hover:text-[#48e2ff] transition-colors ${activeTab === 'how-it-works' ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : ''}`}>How it works</button>
            <button onClick={() => setActiveTab('categories')} className={`hover:text-[#48e2ff] transition-colors ${activeTab === 'categories' ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : ''}`}>Categories</button>
            <button onClick={() => setActiveTab('about')} className={`hover:text-[#48e2ff] transition-colors ${activeTab === 'about' ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : ''}`}>About</button>
            
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} transition-all`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
            </button>

            <button 
              onClick={() => setIsFeedbackOpen(true)}
              className={`px-4 py-2 ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'} rounded-full transition-all flex items-center gap-2 text-sm`}
            >
              <MessageSquare size={16} /> Feedback
            </button>
          </nav>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} transition-all`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-indigo-600" />}
            </button>
            <button 
              className={`p-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-[#48e2ff] transition-colors`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Nav Dropdown */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`absolute top-full left-0 right-0 mt-4 p-6 ${theme === 'dark' ? 'bg-[#111]' : 'bg-white'} border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} rounded-2xl z-50 flex flex-col gap-6 md:hidden shadow-2xl backdrop-blur-xl`}
              >
                <button 
                  onClick={() => { setActiveTab('how-it-works'); setIsMenuOpen(false); }} 
                  className={`text-left text-lg font-medium ${activeTab === 'how-it-works' ? 'text-[#48e2ff]' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}`}
                >
                  How it works
                </button>
                <button 
                  onClick={() => { setActiveTab('categories'); setIsMenuOpen(false); }} 
                  className={`text-left text-lg font-medium ${activeTab === 'categories' ? 'text-[#48e2ff]' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}`}
                >
                  Categories
                </button>
                <button 
                  onClick={() => { setActiveTab('about'); setIsMenuOpen(false); }} 
                  className={`text-left text-lg font-medium ${activeTab === 'about' ? 'text-[#48e2ff]' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}`}
                >
                  About
                </button>
                <button 
                  onClick={() => { setIsFeedbackOpen(true); setIsMenuOpen(false); }}
                  className={`w-full py-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} rounded-xl flex items-center justify-center gap-2 font-bold text-[#48e2ff]`}
                >
                  <MessageSquare size={20} /> Feedback
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main>
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 space-y-6"
              >
                <div className="text-red-400 text-6xl">⚠️</div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{error}</h2>
                <button 
                  onClick={findGifts}
                  className={`px-8 py-3 ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} rounded-full transition-colors flex items-center gap-2 mx-auto ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  <RefreshCcw size={20} /> Retry
                </button>
              </motion.div>
            ) : (
              <div key={activeTab + step + loading}>
                {renderContent()}
              </div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className={`mt-32 pt-12 border-t ${theme === 'dark' ? 'border-white/5 text-gray-500' : 'border-black/5 text-gray-400'} text-center text-sm`}>
          <p>© 2026 Gifts AI. All product links are Amazon affiliate links. We may earn a commission at no extra cost to you.</p>
        </footer>
      </div>
    </div>
  );
}

// --- Helper Components ---

function StepContainer({ title, icon, children, onBack, theme }: { title: string, icon: ReactNode, children: ReactNode, onBack: () => void, theme: 'light' | 'dark' }) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <button onClick={onBack} className={`flex items-center gap-2 ${mutedText} hover:text-[#48e2ff] transition-colors`}>
        <ChevronLeft size={20} /> Back
      </button>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
          {icon}
        </div>
        <h2 className={`text-3xl md:text-4xl font-bold ${textColor}`}>{title}</h2>
      </div>
      <div className="pt-4">
        {children}
      </div>
    </motion.div>
  );
}

function OptionButton({ label, selected, onClick, theme }: { label: string, selected: boolean, onClick: () => void, theme: 'light' | 'dark', key?: string | number }) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl border text-lg font-bold transition-all ${
        selected 
          ? 'bg-[#48e2ff]/20 border-[#48e2ff] text-[#48e2ff]' 
          : `${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300' : 'bg-black/20 border-black/10 hover:border-black/20 text-gray-700'}`
      }`}
    >
      {label}
    </button>
  );
}

function CustomNoteInput({ value, onChange, placeholder, theme }: { value: string, onChange: (val: string) => void, placeholder: string, theme: 'light' | 'dark' }) {
  const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const inputBg = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10';

  return (
    <div className="space-y-2">
      <label className={`text-sm font-medium ${mutedText} uppercase tracking-wider`}>Additional Details (Optional)</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-4 rounded-xl ${inputBg} focus:border-[#48e2ff]/50 focus:ring-1 focus:ring-[#48e2ff]/50 outline-none transition-all resize-none h-24 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
      />
    </div>
  );
}

function ProductCard({ product, link, theme }: { product: Product, link: string, theme: 'light' | 'dark', key?: string | number }) {
  const cardBg = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-md hover:shadow-lg transition-shadow';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-6 rounded-3xl ${cardBg} border flex flex-col h-full backdrop-blur-sm`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 rounded-full bg-[#48e2ff]/10 text-[#48e2ff] text-xs font-bold uppercase tracking-wider">
          {product.category}
        </span>
        <span className={`${mutedText} text-sm font-medium`}>{product.price_range}</span>
      </div>
      <h3 className={`text-xl font-bold mb-3 line-clamp-2 ${textColor}`}>{product.title}</h3>
      <p className={`${mutedText} text-sm mb-4 line-clamp-3`}>{product.description}</p>
      
      <div className="mt-auto space-y-4">
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5 border-white/5 text-gray-300' : 'bg-black/5 border-black/5 text-gray-700'} italic text-sm`}>
          <span className="text-[#48e2ff] font-bold not-italic">Why AI picked this:</span> {product.reason}
        </div>
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-4 bg-[#48e2ff] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          Buy on Amazon <ExternalLink size={18} />
        </a>
      </div>
    </motion.div>
  );
}
