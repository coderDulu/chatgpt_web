import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// @ts-ignore
import { a11yDark as codeStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const CodeBlock = (props: any) => {
  const { inline, className, children } = props;
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter
      showLineNumbers={true}
      style={codeStyle}
      language={match[1]}
      // PreTag='div'
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

export const useMarkDown = ({ content }: { content: string }) => {
  return <ReactMarkdown
    components={{
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return CodeBlock({className, children, inline, props})
      }
    }}
  >
    {content}
  </ReactMarkdown>
}