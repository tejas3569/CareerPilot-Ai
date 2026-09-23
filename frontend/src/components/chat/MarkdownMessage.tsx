import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2 } from 'lucide-react';

interface MarkdownMessageProps {
  content: string;
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  // Split content by code blocks: ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex, match.index),
      });
    }
    parts.push({
      type: 'code',
      language: match[1] || 'code',
      content: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.substring(lastIndex),
    });
  }

  return (
    <div className="space-y-3 font-sans leading-relaxed text-sm text-slate-800 dark:text-slate-100">
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return <CodeSnippet key={idx} language={part.language || 'code'} code={part.content} />;
        }
        return <FormattedTextBlock key={idx} text={part.content} />;
      })}
    </div>
  );
};

// Formats Code Blocks with copy button and language tag
const CodeSnippet: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-mono font-medium text-[11px] text-slate-300 uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>{language || 'code'}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-xs font-mono text-emerald-300/90 leading-relaxed scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Formats non-code markdown: headings, bullets, numbers, callouts, paragraphs
const FormattedTextBlock: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let lineIdx = 0;

  while (lineIdx < lines.length) {
    const rawLine = lines[lineIdx];
    const line = rawLine.trim();

    // Empty line spacer
    if (!line) {
      lineIdx++;
      continue;
    }

    // Heading 1 (# ...)
    if (line.startsWith('# ')) {
      elements.push(
        <h2 key={`h1-${lineIdx}`} className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-3 mb-1.5 flex items-center gap-2">
          {renderInlineFormatting(line.replace(/^#\s+/, ''))}
        </h2>
      );
      lineIdx++;
      continue;
    }

    // Heading 2 (## ...)
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={`h2-${lineIdx}`} className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-3 mb-1.5 flex items-center gap-2 border-l-3 border-indigo-500 pl-2">
          {renderInlineFormatting(line.replace(/^##\s+/, ''))}
        </h3>
      );
      lineIdx++;
      continue;
    }

    // Heading 3 (### ...)
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={`h3-${lineIdx}`} className="text-sm font-bold text-slate-900 dark:text-white mt-2.5 mb-1 text-indigo-950 dark:text-indigo-200">
          {renderInlineFormatting(line.replace(/^###\s+/, ''))}
        </h4>
      );
      lineIdx++;
      continue;
    }

    // Heading 4 (#### ...)
    if (line.startsWith('#### ')) {
      elements.push(
        <h5 key={`h4-${lineIdx}`} className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mt-2 mb-1">
          {renderInlineFormatting(line.replace(/^####\s+/, ''))}
        </h5>
      );
      lineIdx++;
      continue;
    }

    // Callout / Pro-tip / Blockquote (> ... or lines starting with 💡, ⚠️, 📌)
    if (line.startsWith('> ') || line.startsWith('💡') || line.startsWith('⚠️') || line.startsWith('📌')) {
      const cleanCallout = line.startsWith('> ') ? line.replace(/^>\s*/, '') : line;
      elements.push(
        <div
          key={`callout-${lineIdx}`}
          className="my-2.5 p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-indigo-500 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium shadow-2xs"
        >
          {renderInlineFormatting(cleanCallout)}
        </div>
      );
      lineIdx++;
      continue;
    }

    // Numbered List Item (1. ...)
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      const num = numberedMatch[1];
      const itemText = numberedMatch[2];
      elements.push(
        <div key={`num-${lineIdx}`} className="flex items-start gap-2.5 my-1.5 ml-0.5">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold flex items-center justify-center mt-0.5">
            {num}
          </span>
          <div className="flex-1 text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
            {renderInlineFormatting(itemText)}
          </div>
        </div>
      );
      lineIdx++;
      continue;
    }

    // Bullet List Item (- ... or * ... with indentation support)
    const bulletMatch = rawLine.match(/^(\s*)([-*+])\s+(.*)$/);
    if (bulletMatch) {
      const indentSpaces = bulletMatch[1].length;
      const isSubBullet = indentSpaces >= 2;
      const itemText = bulletMatch[3];

      elements.push(
        <div
          key={`bullet-${lineIdx}`}
          className={`flex items-start gap-2 my-1 ${isSubBullet ? 'ml-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300' : 'ml-1 text-sm text-slate-800 dark:text-slate-200'}`}
        >
          <span
            className={`flex-shrink-0 rounded-full mt-2 ${
              isSubBullet
                ? 'w-1.5 h-1.5 border border-indigo-400 bg-transparent'
                : 'w-2 h-2 bg-indigo-600 dark:bg-indigo-400'
            }`}
          />
          <div className="flex-1 leading-relaxed">
            {renderInlineFormatting(itemText)}
          </div>
        </div>
      );
      lineIdx++;
      continue;
    }

    // Regular Paragraph
    elements.push(
      <p key={`p-${lineIdx}`} className="my-1.5 leading-relaxed text-slate-800 dark:text-slate-200 text-sm">
        {renderInlineFormatting(line)}
      </p>
    );
    lineIdx++;
  }

  return <>{elements}</>;
};

// Helper: Renders inline markdown tokens (`code`, **bold**, *italic*, [links])
function renderInlineFormatting(text: string): React.ReactNode[] {
  // Regex to match inline code, bold, italic, and links
  const tokenRegex = /(`[^`]+`|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const nodes: React.ReactNode[] = [];

  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      nodes.push(text.substring(lastIdx, match.index));
    }

    const token = match[0];
    const key = `token-${match.index}`;

    // Inline code `code`
    if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code
          key={key}
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-semibold border border-slate-200/80 dark:border-slate-700/80"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    // Bold + Italic ***text***
    else if (token.startsWith('***') && token.endsWith('***')) {
      nodes.push(
        <strong key={key} className="font-bold italic text-slate-900 dark:text-white">
          {token.slice(3, -3)}
        </strong>
      );
    }
    // Bold **text**
    else if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong key={key} className="font-bold text-slate-900 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    }
    // Italic *text*
    else if (token.startsWith('*') && token.endsWith('*')) {
      nodes.push(
        <em key={key} className="italic text-slate-700 dark:text-slate-300">
          {token.slice(1, -1)}
        </em>
      );
    }
    // Link [text](url)
    else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        nodes.push(
          <a
            key={key}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        nodes.push(token);
      }
    } else {
      nodes.push(token);
    }

    lastIdx = match.index + token.length;
  }

  if (lastIdx < text.length) {
    nodes.push(text.substring(lastIdx));
  }

  return nodes;
}
