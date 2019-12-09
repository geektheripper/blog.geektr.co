<template>
  <a target="_blank" :href="href">
    <img
      :alt="label"
      :src="`https://img.shields.io/badge/${escape(label)}-${escape(message)}-${color}?style=flat-square&logo=${logo}`"
    />
  </a>
</template>

<script>
export default {
    props: ['label', 'message', 'color', 'href', 'logo'],
    methods: {
        escape(text) {
            return encodeURI(text).replace(/-/, '--')
        }
    }
}
</script>