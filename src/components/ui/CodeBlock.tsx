'use client';

import React, { useState } from 'react';
import { Check, Copy, FileCode } from 'lucide-react';

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlightedLines?: number[];
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  highlightedLines = [],
  showLineNumbers = true,
  className = '',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div
      className={`rounded-xl overflow-hidden border border-slate-800/90 bg-slate-950/90 backdrop-blur-sm text-slate-100 font-mono text-xs ${className}`}
    >
      {filename && (
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <FileCode className="w-3.5 h-3.5 text-lime-400" />
            <span>{filename}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="uppercase text-[10px] tracking-wider text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded">
              {language}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      <div className="relative overflow-x-auto p-3 text-xs leading-5">
        {!filename && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-700/80 rounded transition-colors z-10"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
        <pre className="table w-full">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isHighlighted = highlightedLines.includes(lineNum);
            return (
              <div
                key={idx}
                className={`table-row transition-colors ${
                  isHighlighted ? 'bg-lime-400/10 border-l-2 border-lime-400 text-lime-100' : 'hover:bg-slate-900/40'
                }`}
              >
                {showLineNumbers && (
                  <span
                    className={`table-cell pr-4 text-right select-none text-[11px] ${
                      isHighlighted ? 'text-lime-400 font-bold' : 'text-slate-600'
                    }`}
                  >
                    {lineNum}
                  </span>
                )}
                <span className="table-cell whitespace-pre">{line || ' '}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
