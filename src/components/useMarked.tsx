import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';

export default function MarkdownRenderer({ content }: { content: string }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const renderer = new marked.Renderer();
    renderer.code = (code, language: string) => {
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
      return `<pre><code class="hljs ${validLanguage}">${hljs.highlight(validLanguage, code).value}</code></pre>`;
    };
    // console.log(renderer);
    const html = marked(content, { renderer });
    setHtml(html);
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}