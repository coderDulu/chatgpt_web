import React, { useState, useEffect, useLayoutEffect } from 'react';
import { marked } from 'marked';
import hljs, { HighlightOptions } from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { message } from 'antd';

export default function MarkdownRenderer({ content }: { content: string }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const renderer = new marked.Renderer();
    renderer.code = (code: string | HighlightOptions, language: string) => {
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
      return `<pre><code class="hljs ${validLanguage}">${hljs.highlight(validLanguage, code).value}</code></pre>`;
    };
    // console.log(renderer);
    marked(content, { renderer }, (err, html) => {
      setHtml(html);
    });
  }, [content]);

  // return <div dangerouslySetInnerHTML={{ __html: html }} />;
  return html;
}

/**
 * 为每个代码块添加复制按钮
 */
export function addCopyToPre() {
  const codeBlocks = document.querySelectorAll('pre');

  codeBlocks.forEach((codeEl) => {
    codeEl.className = 'code-pre';

    if (codeEl.lastChild?.nodeName === 'CODE') {
      const btnEl = document.createElement('button');
      btnEl.className = "code-copy";
      btnEl.textContent = "复制";

      codeEl.appendChild(btnEl);
      // @ts-ignore
      const value = codeEl.children[0].innerText;
      btnEl.onclick = btnClick(value);
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