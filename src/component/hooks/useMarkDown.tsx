import { message } from 'antd'
import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// @ts-ignore
import { a11yDark as codeStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const CodeBlock = (config: any) => {
  const { inline, className, children, props } = config;
  // console.log(props);
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter
      showLineNumbers={true}
      style={codeStyle}
      language={match[1]}
      PreTag='div'
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
        return CodeBlock({className, children, inline, props})
      }
    }}
  >
    {content}
  </ReactMarkdown>
}

/**
 * 为每个代码块添加复制按钮
 */
export function addCopyToPre() {
  const codeBlocks = document.querySelectorAll('pre');

  codeBlocks.forEach((codeEl) => {
    codeEl.className = 'code-pre';
    const divEl = codeEl.childNodes[0];

    if (divEl.lastChild?.nodeName === 'CODE') {
      const btnEl = document.createElement('button');
      btnEl.className = "code-copy";
      btnEl.textContent = "复制";

      codeEl.appendChild(btnEl);
      // @ts-ignore
      const value = codeEl.children[0].innerText;

      btnEl.onclick = btnClick(value?.replace(/^\d{1, 4}/, ''));
    }

  })

  function btnClick(value: string) {
    return (e: MouseEvent) => {
      navigator.clipboard.writeText(value)
        .then(() => {
          message.success('复制成功')
        })
        .catch((error) => {
          console.error("Failed to copy message to clipboard: ", error);
        });
    }
  }
}
