import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MermaidDiagram from './MermaidDiagram';
import 'katex/dist/katex.min.css';

interface MarkdownViewerProps {
  markdown: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ markdown }) => {
  return (
    <div id="markflow-viewer" className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            // Mermaid diagram
            if (!inline && language === 'mermaid') {
              return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
            }

            // Syntax highlighting for code blocks
            return !inline && language ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // 外部リンクを新しいウィンドウで開く
          a({ node, children, href, ...props }: any) {
            const isExternal = href?.startsWith('http://') || href?.startsWith('https://');

            if (isExternal) {
              return (
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.electronAPI?.openExternal) {
                      window.electronAPI.openExternal(href);
                    }
                  }}
                  {...props}
                >
                  {children}
                </a>
              );
            }

            return (
              <a href={href} {...props}>
                {children}
              </a>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
