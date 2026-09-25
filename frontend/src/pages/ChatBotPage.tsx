import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Code2,
  Lightbulb,
  Briefcase,
  Layers,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ArrowDown,
  RefreshCw,
  Terminal,
  Cpu
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { MarkdownMessage } from '../components/chat/MarkdownMessage';
import { chatApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedFollowups?: string[];
}

interface ChatBotPageProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const PRESET_PROMPTS = [
  { label: 'Master STAR Method', icon: Briefcase, prompt: 'How do I answer "Tell me about a time you faced a technical conflict" using the STAR method?' },
  { label: 'React Virtual DOM', icon: Code2, prompt: 'Explain the React Virtual DOM and diffing algorithm simply with an example.' },
  { label: 'Top ATS Red Flags', icon: Layers, prompt: 'What are the top 5 ATS resume mistakes college students make, and how do I fix them?' },
  { label: 'System Design Framework', icon: Cpu, prompt: 'How should I structure a 45-minute System Design interview for entry-level roles?' },
  { label: 'Python Concurrency', icon: Terminal, prompt: 'Explain Python GIL, multiprocessing, and asyncio for technical interviews.' },
  { label: 'JWT Security', icon: ShieldCheck, prompt: 'Explain how JWT authentication works, access vs refresh tokens, and security best practices.' },
  { label: 'About Founder', icon: Sparkles, prompt: 'Who founded CareerPilot AI and what was the vision behind it?' }
];

const QUICK_STARTER_CARDS = [
  {
    title: 'Behavioral STAR Drill',
    description: 'Master answering tough scenario, leadership, and conflict questions.',
    prompt: 'Can you give me a template and example for answering "Tell me about a time you failed" using the STAR method?',
    icon: Briefcase,
    color: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
  },
  {
    title: 'ATS Resume Engineering',
    description: 'Format bullet points with Google XYZ formula and target keywords.',
    prompt: 'How do I rewrite my project bullet points using the Google XYZ formula for software developer roles?',
    icon: Layers,
    color: 'from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60'
  },
  {
    title: 'System Design Blueprint',
    description: 'Learn end-to-end architecture: load balancers, caching, and databases.',
    prompt: 'Walk me through designing a scalable URL shortener like Bitly for a placement interview.',
    icon: Cpu,
    color: 'from-purple-500/10 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60'
  },
  {
    title: 'High-Yield DSA Patterns',
    description: 'Master sliding window, two pointers, graphs, and dynamic programming.',
    prompt: 'What are the top 6 high-yield DSA patterns tested by top tech companies in campus placements?',
    icon: Code2,
    color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
  }
];

export const ChatBotPage: React.FC<ChatBotPageProps> = ({ onShowToast }) => {
  const { user } = useAuth();
  const targetRole = user?.profile?.target_role || 'Software Developer';

  const initialGreeting: ChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: `👋 Hi **${user?.profile?.name || 'there'}**! I am your **CareerPilot AI Technical Copilot & Placement Mentor**.\n\nI can answer **any technical question with comprehensive depth**: coding algorithms, system design architectures, resume bullet point diagnostics, behavioral STAR answers, core CS concepts (OS, DBMS, Networks, OOP), and company placement strategies.\n\nWhat would you like to master today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedFollowups: [
      'How can I rewrite my resume bullet points with the XYZ formula?',
      'What are the most tested DSA patterns in campus placements?',
      'How do I answer "What is your greatest technical weakness"?'
    ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const quickTopicsRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [canScrollTopicsLeft, setCanScrollTopicsLeft] = useState(false);
  const [canScrollTopicsRight, setCanScrollTopicsRight] = useState(true);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    setShowScrollToBottom(false);
  };

  const handleChatScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 120;
      setShowScrollToBottom(isScrolledUp);
    }
  };

  const checkTopicsScroll = () => {
    if (quickTopicsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = quickTopicsRef.current;
      setCanScrollTopicsLeft(scrollLeft > 10);
      setCanScrollTopicsRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollTopics = (direction: 'left' | 'right') => {
    if (quickTopicsRef.current) {
      const offset = direction === 'left' ? -240 : 240;
      quickTopicsRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(checkTopicsScroll, 250);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  useEffect(() => {
    checkTopicsScroll();
    window.addEventListener('resize', checkTopicsScroll);
    return () => window.removeEventListener('resize', checkTopicsScroll);
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsSending(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await chatApi.sendMessage(text, historyPayload, targetRole);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: res.suggested_followups
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      onShowToast('Could not reach AI copilot. Please try again.', 'error');
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '⚠️ I encountered an error answering your question. Please verify your connection or try rephrasing.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('Response copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset',
        role: 'assistant',
        content: `Conversation refreshed. Ask me anything about your technical career, target role of **${targetRole}**, or placement preparation!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: [
          'What are the core technical questions for my role?',
          'How do I answer "What is your greatest technical weakness"?',
          'Explain the React Virtual DOM with an example'
        ]
      }
    ]);
    onShowToast('Chat conversation cleared', 'info');
    inputRef.current?.focus();
  };

  const isOnlyWelcome = messages.length === 1 && messages[0].id === 'welcome';

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] max-w-5xl mx-auto space-y-3">
      {/* Top Header Card */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/80 dark:border-slate-800/80 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-normal">
                AI Career Copilot Chat
              </h1>
              <Badge variant="indigo" size="sm" className="hidden sm:inline-flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Live AI Mentor
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Target Role:</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/60">
                {targetRole}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Preset Suggestion Chips Bar with Scroll Controls */}
      <div className="relative flex items-center group/topics flex-shrink-0">
        {canScrollTopicsLeft && (
          <button
            type="button"
            onClick={() => scrollTopics('left')}
            className="absolute left-0 z-10 p-1 rounded-full bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 shadow-md border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition-all cursor-pointer"
            title="Scroll topics left"
            aria-label="Scroll topics left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
        <div
          ref={quickTopicsRef}
          onScroll={checkTopicsScroll}
          className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 px-1 scroll-smooth"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Quick Topics:
          </span>
          {PRESET_PROMPTS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p.prompt)}
                disabled={isSending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 whitespace-nowrap transition-all cursor-pointer shadow-2xs group flex-shrink-0"
              >
                <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
        {canScrollTopicsRight && (
          <button
            type="button"
            onClick={() => scrollTopics('right')}
            className="absolute right-0 z-10 p-1 rounded-full bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 shadow-md border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition-all cursor-pointer"
            title="Scroll topics right"
            aria-label="Scroll topics right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Messages Stream Container with Scroll-to-Bottom Button */}
      <div className="relative flex-1 min-h-0 flex flex-col">
        <div
          ref={chatContainerRef}
          onScroll={handleChatScroll}
          className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 shadow-inner scroll-smooth"
        >
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
            >
              {/* Left Bot Avatar for Assistant */}
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 text-white shadow-sm mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              {/* Message Content Container */}
              <div className={`space-y-2 max-w-full ${isUser ? 'max-w-[85%] sm:max-w-[75%]' : 'flex-1'}`}>
                {isUser ? (
                  // User Message Bubble: Sleek, compact gradient bubble
                  <div className="flex flex-col items-end">
                    <div className="px-4 py-3 rounded-2xl rounded-tr-xs bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium text-sm leading-relaxed shadow-sm">
                      <p className="whitespace-pre-wrap break-words">{m.content}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 mr-1">
                      {m.timestamp}
                    </span>
                  </div>
                ) : (
                  // Assistant Message Card: Sleek modern card with header, rendered markdown, copy & actions
                  <div className="rounded-2xl rounded-tl-xs bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-5 space-y-3">
                    {/* Header bar of bot response */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                        <span className="text-indigo-600 dark:text-indigo-400">CareerPilot Copilot</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-[11px] font-normal text-slate-500">Senior Tech Mentor</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400">{m.timestamp}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(m.id, m.content)}
                          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Rich Formatted Markdown Content */}
                    <MarkdownMessage content={m.content} />

                    {/* Suggested Followups */}
                    {m.suggestedFollowups && m.suggestedFollowups.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Suggested Next Questions:</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {m.suggestedFollowups.map((f, fidx) => (
                            <button
                              key={fidx}
                              type="button"
                              onClick={() => handleSendMessage(f)}
                              disabled={isSending}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-800 text-left"
                            >
                              <ChevronRight className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                              <span>{f}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Avatar for User */}
              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow-sm mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state launcher cards when only welcome message is present */}
        {isOnlyWelcome && (
          <div className="pt-2 pb-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Quick Launch Modules:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUICK_STARTER_CARDS.map((card, cidx) => {
                const Icon = card.icon;
                return (
                  <button
                    key={cidx}
                    type="button"
                    onClick={() => handleSendMessage(card.prompt)}
                    className="p-4 rounded-xl border bg-white dark:bg-slate-900 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between space-y-2 border-slate-200/80 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center flex-shrink-0 border`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {card.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {card.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {isSending && (
          <div className="flex gap-3 max-w-lg mr-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-700 to-purple-600 flex items-center justify-center flex-shrink-0 text-white shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-xs bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs flex items-center gap-3 shadow-sm">
              <div className="flex space-x-1.5">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
              </div>
              <span className="font-medium text-slate-600 dark:text-slate-300">
                CareerPilot AI is formulating an in-depth answer...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
        </div>

        {/* Floating Scroll to Bottom Button */}
        {showScrollToBottom && (
          <button
            type="button"
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-xl shadow-indigo-500/40 hover:scale-105 transition-all cursor-pointer border border-indigo-400/40 backdrop-blur-sm animate-fade-in"
            title="Scroll to bottom"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            <span>Scroll to Bottom</span>
          </button>
        )}
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="pt-1 flex-shrink-0"
      >
        <div className="relative flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
          <div className="pl-3 text-slate-400 flex items-center pointer-events-none">
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask any technical doubt: DSA, React, System Design, STAR answers, OS, DBMS..."
            disabled={isSending}
            className="flex-1 px-2 py-2 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none placeholder:text-slate-400"
          />

          <Button
            type="submit"
            variant="primary"
            disabled={!inputValue.trim() || isSending}
            isLoading={isSending}
            className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer shadow-xs"
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Send
          </Button>
        </div>
        <div className="flex items-center justify-between px-3 pt-1.5 text-[11px] text-slate-400">
          <span>Press <strong>Enter</strong> to send • Accurate technical explanations & code snippets</span>
          <span className="hidden sm:inline">CareerPilot AI v2.4</span>
        </div>
      </form>
    </div>
  );
};
