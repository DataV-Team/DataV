<template>
  <pre><code class="highlight-code" :ref="ref">
<slot></slot>
  </code></pre>
</template>

<script>
import 'highlight.js/styles/monokai-sublime.css'

import highlight from 'highlight.js/lib/highlight'

import javascript from 'highlight.js/lib/languages/javascript'

highlight.registerLanguage('javascript', javascript)

export default {
  name: 'HighlightCode',
  data () {
    return {
      ref: `highlight-code-${(new Date()).getTime()}`
    }
  },
  methods: {
    init () {
      const { ref, $refs } = this

      const codeChunk = $refs[ref]

      highlight.highlightBlock(codeChunk)
    }
  },
  mounted () {
    const { init } = this

    init()
  }
}
</script>

<style lang="less">
.highlight-code {
  font-family: 'code';
  background-color: transparent;
}
</style>
