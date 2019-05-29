<template>
    <div ref="dom"></div>
</template>

<script>
import { off } from '@/libs/tools'
export default {
  name: 'serviceRequests',
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
