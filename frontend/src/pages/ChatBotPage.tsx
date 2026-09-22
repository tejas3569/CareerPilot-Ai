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
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
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
  { label: 'Master STAR Method', prompt: 'How do I answer "Tell me about a time you faced a technical conflict" using the STAR method?' },
  { label: 'React Virtual DOM', prompt: 'Explain the React Virtual DOM and diffing algorithm simply with an example.' },
  { label: 'Top ATS Red Flags', prompt: 'What are the top 5 ATS resume mistakes college students make, and how do I fix them?' },
  { label: 'System Design Framework', prompt: 'How should I structure a 45-minute System Design interview for entry-level roles?' },
  { label: 'Python Concurrency', prompt: 'Explain Python GIL, multiprocessing, and asyncio for technical interviews.' },
  { label: 'About Founder', prompt: 'Who founded CareerPilot AI and what was the vision behind it?' }
];

export const ChatBotPage: React.FC<ChatBotPageProps> = ({ onShowToast }) => {
  const { user } = useAuth();
  const targetRole = user?.profile?.target_role || 'Software Developer';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 Hi **${user?.profile?.name || 'there'}**! I am your **CareerPilot AI Copilot**.\n\nI can answer **any question about anything**: coding concepts, company-specific placement prep, resume bullet point reviews, salary negotiation, system design, or mock interview strategies.\n\nWhat would you like to prepare or explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowups: [
        'How can I optimize my resume bullet points?',
        'What are the most tested DSA patterns in placements?',
        'How do I prepare for a behavioral round?'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

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
        content: `Conversation cleared. Ask me anything about your technical career, target role of **${targetRole}**, or placement prep!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: [
          'What are the core technical questions for my role?',
          'How do I answer "What is your greatest technical weakness"?',
          'Review my 5-phase learning roadmap'
        ]
      }
    ]);
    onShowToast('Chat history cleared', 'info');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800/80 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                AI Career Copilot Chat
              </h1>
              <Badge variant="indigo" size="sm" className="hidden sm:inline-flex">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-400" /> Live AI Mentor
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ask anything: coding doubts, system design, interview answers, resume phrasing, or company tactics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Prompts:
        </span>
        {PRESET_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(p.prompt)}
            disabled={isSending}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 whitespace-nowrap transition-all cursor-pointer shadow-2xs"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                  isUser
                    ? 'bg-indigo-600'
                    : 'bg-gradient-to-tr from-indigo-700 to-purple-600'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-200 dark:shadow-none font-medium'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans space-y-2">
                    {m.content}
                  </div>

                  <div
                    className={`mt-2 flex items-center justify-between gap-4 text-[10px] ${
                      isUser ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleCopyText(m.id, m.content)}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Copy message"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Suggested Followups */}
                {!isUser && m.suggestedFollowups && m.suggestedFollowups.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 pl-1">
                    {m.suggestedFollowups.map((f, fidx) => (
                      <button
                        key={fidx}
                        type="button"
                        onClick={() => handleSendMessage(f)}
                        disabled={isSending}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-3 h-3 text-indigo-500" />
                        <span>{f}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isSending && (
          <div className="flex gap-3 max-w-lg mr-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-700 to-purple-600 flex items-center justify-center flex-shrink-0 text-white shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-400 text-xs flex items-center gap-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
              <span>CareerPilot AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-2 flex-shrink-0"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask any question about coding, interviews, resume, or placement strategy..."
            disabled={isSending}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all pr-12"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={!inputValue.trim() || isSending}
          isLoading={isSending}
          className="rounded-2xl px-5 py-3 cursor-pointer"
          rightIcon={<Send className="w-4 h-4" />}
        >
          Send
        </Button>
      </form>
    </div>
  );
};
