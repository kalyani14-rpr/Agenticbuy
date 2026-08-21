import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  HelpCircle, 
  CornerDownLeft, 
  MessageSquare,
  Zap,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, ShoppingRequirements } from '../types';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  currency: 'INR' | 'USD';
  onQuickPrompt: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  {
    icon: '💻',
    title: 'Coding Laptop under ₹60,000',
    prompt: 'I need a laptop for coding under ₹60,000 with good battery life.',
  },
  {
    icon: '🎧',
    title: 'Study Headphones under ₹5,000',
    prompt: 'I need wireless headphones under ₹5,000 for studying.',
  },
  {
    icon: '📱',
    title: 'Camera Phone under ₹30,000',
    prompt: 'Suggest a good camera smartphone under ₹30,000 for content creation.',
  },
  {
    icon: '📱',
    title: 'Student Tablet under ₹25,000',
    prompt: 'Looking for a student tablet under ₹25,000 with active stylus support.',
  },
];

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isLoading,
  currency,
  onQuickPrompt,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // Find latest message with followUpQuestions or quickReplies
  const latestAgentMessage = [...messages].reverse().find(m => m.sender === 'agent');

  return (
    <div id="ai-shopping-chat-window" className="bg-white border border-slate-200/90 rounded-2xl shadow-sm flex flex-col h-[580px] overflow-hidden">
      
      {/* Chat Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                AI Shopping Assistant
              </h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Autonomous requirement extraction & decision engine
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80 font-medium">
          Agentic Mode
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 ring-8 ring-indigo-50/50 border border-indigo-100">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              What are you looking to buy today?
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
              Describe your target product, budget limit, and primary purpose in everyday plain words.
            </p>

            {/* Quick Starter Prompts */}
            <div className="w-full max-w-md space-y-2 text-left">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                Try a 1-Click Starter Demo:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STARTER_PROMPTS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => onQuickPrompt(item.prompt)}
                    className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 text-left transition-all group shadow-2xs"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      "{item.prompt}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* Follow-up Question Prompts if present in agent message */}
                  {!isUser && msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                    <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-indigo-800 font-bold text-[11px] uppercase tracking-wider">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Recommended Clarifications:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUpQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => onQuickPrompt(q)}
                            className="text-left px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-900 transition-colors text-xs flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>{q}</span>
                            <ArrowRight className="w-3 h-3 text-indigo-600 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Action Chips */}
                  {!isUser && msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickReplies.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => onQuickPrompt(chip)}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all shadow-2xs"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-white text-slate-700 border border-slate-200/90 rounded-2xl rounded-tl-none text-xs flex items-center gap-2 shadow-2xs">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Analyzing shopping requirements & ranking catalog...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g., 'I need a laptop for coding under ₹60,000 with good battery life'"
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-sm"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

    </div>
  );
};
