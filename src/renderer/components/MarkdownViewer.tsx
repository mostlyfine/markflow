import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import MermaidDiagram from './MermaidDiagram';

interface MarkdownViewerProps {
  markdown: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ markdown }) => {
  return (
    <div id="markflow-viewer" className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            // Mermaid diagram
            if (!inline && language === 'mermaid') {
              return (
                <MermaidDiagram chart={String(children).replace(/\n$/, '')} />
              );
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Open external links in the user's browser
          a({ node, children, href, ...props }: any) {
            const isExternal =
              href?.startsWith('http://') || href?.startsWith('https://');

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
