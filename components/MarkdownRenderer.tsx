"use client"

import type React from "react"
import { useState, memo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CopyIcon, CheckIcon } from "./Icons"

interface MarkdownRendererProps {
  content: string
}

const CodeBlock = memo(({ language, children }: { language: string; children: string }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(children)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="rounded-xl overflow-hidden border border-[#1a1a1a] my-5 w-full max-w-[calc(100vw-4rem)] md:max-w-full shadow-md">
      <div className="bg-[#0a0a0a] px-4 py-2.5 flex justify-between items-center border-b border-[#1a1a1a]">
        <span className="text-xs text-gray-500 font-sans font-medium lowercase tracking-wide">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          {isCopied ? <CheckIcon className="w-3.5 h-3.5 text-green-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
          {isCopied ? "Copied!" : "Copy code"}
        </button>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <pre className="m-0 p-6 bg-black text-sm leading-relaxed font-mono min-w-full">
          <code className="font-mono text-gray-300">{children}</code>
        </pre>
      </div>
    </div>
  )
})

CodeBlock.displayName = "CodeBlock"

const MarkdownRenderer: React.FC<MarkdownRendererProps> = memo(({ content }) => {
  return (
    <div className="prose prose-invert prose-base max-w-none text-gray-200 prose-p:text-gray-200 prose-p:leading-7 prose-p:font-normal prose-headings:text-gray-50 prose-headings:font-semibold prose-strong:text-white prose-strong:font-medium prose-li:text-gray-200 prose-li:font-normal prose-ol:text-gray-200 prose-ul:text-gray-200 prose-blockquote:text-gray-400 font-['Inter'] w-full min-w-0 break-words overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-blue-400 hover:text-blue-300 hover:underline transition-colors font-normal"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <CodeBlock language={match[1]}>{String(children).replace(/\n$/, "")}</CodeBlock>
            ) : inline ? (
              <code
                className="bg-[#0a0a0a] text-gray-300 px-1.5 py-0.5 rounded text-[0.9em] font-mono whitespace-pre-wrap break-all border border-[#1a1a1a] font-normal"
                {...props}
              >
                {children}
              </code>
            ) : (
              <CodeBlock language="text">{String(children).replace(/\n$/, "")}</CodeBlock>
            )
          },
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 my-4 text-gray-200 space-y-2 font-normal" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 my-4 text-gray-200 space-y-2 font-normal" {...props} />
          ),
          h1: ({ node, ...props }) => (
            <h1
              className="text-3xl font-semibold mt-8 mb-4 text-white break-words border-b border-white/10 pb-2"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-7 mb-4 text-white break-words" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-6 mb-3 text-white break-words" {...props} />,
          p: ({ node, ...props }) => (
            <p className="mb-4 text-gray-200 leading-7 break-words font-normal" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-700 pl-4 py-1 italic text-gray-400 my-6 break-words bg-[#0a0a0a] rounded-r-lg font-normal"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6 border border-[#1a1a1a] rounded-xl shadow-sm scrollbar-thin">
              <table className="min-w-full divide-y divide-[#1a1a1a]" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-3 bg-[#0a0a0a] text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-4 py-3 whitespace-nowrap text-sm text-gray-200 border-t border-[#0d0d0d] font-normal"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
})

MarkdownRenderer.displayName = "MarkdownRenderer"

export default MarkdownRenderer
