<template>
  <div class="highlight-code">
    <pre><code :ref="ref">
<slot></slot>
    </code></pre>
  </div>
</template>

<script>
import 'highlight.js/styles/monokai-sublime.css'

import highlight from 'highlight.js/lib/highlight'

import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'

highlight.registerLanguage('xml', xml)
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

  code {
    font-family: 'code';
    background-color: transparent;
  }
}
</style>
