<script setup lang="ts">
import { marked } from 'marked';
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import { computed } from 'vue';

import markedKatex from "marked-katex-extension";

const props = defineProps<{ renderer: string }>()
const rendererHtml = computed(() => addHighlight(props.renderer))

function addHighlight(data: string) {
  const renderer = new marked.Renderer()

  renderer.code = (code, language: string) => {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
    const highlighted = hljs.highlight(validLanguage, code).value

    return `<pre><code class="hljs ${validLanguage}">${highlighted}</code></pre>`
  }

  marked.setOptions({
    renderer: renderer,
    highlight: (code, language) => {
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
      return hljs.highlight(validLanguage, code).value
    },
    langPrefix: 'hljs language-',
  })
 
  marked.use( markedKatex({ throwOnError: false }))

  return marked.parse(data)
}




</script>

<template>
  <div v-html="rendererHtml"></div>
</template>

<style scoped>
pre {
  position: relative;
}

.copy-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  padding: 0 10px;
}
</style>
