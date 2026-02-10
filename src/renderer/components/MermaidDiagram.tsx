import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

let mermaidInitialized = false;

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      });
      mermaidInitialized = true;
    }
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (elementRef.current && chart) {
        try {
          elementRef.current.innerHTML = chart;
          elementRef.current.removeAttribute('data-processed');
          await mermaid.run({
            nodes: [elementRef.current],
          });
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          if (elementRef.current) {
            elementRef.current.innerHTML = `<pre style="color: red;">Mermaid Error: ${error}</pre>`;
          }
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return (
    <div
      ref={elementRef}
      id={idRef.current}
      className="mermaid"
      style={{ textAlign: 'center', margin: '20px 0' }}
    />
  );
};

export default MermaidDiagram;
