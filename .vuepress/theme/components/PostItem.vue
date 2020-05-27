<template>
  <div class="page-item">
    <a class="title" :href="page.regularPath">{{ page.title }}</a>
    <p class="subtitle">{{ page.frontmatter.subtitle }}</p>
    <div class="footer">
      <p class="tags" v-if="page.frontmatter.tags">
        <a class="tag" v-for="tag in page.frontmatter.tags" :key="tag" :href="`/tags/${tag}`">{{ tag }}</a>
      </p>
      <p class="date">{{ new Date(page.frontmatter.date).toLocaleDateString() }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["page"]
};
</script>

<style lang="stylus" scooped>
.page-item
  padding 1rem 0
  &>.title
    font-size 1.5rem

.footer
  display flex
  justify-content flex-end
  .tag
      padding-left 0.5rem
  .date
    padding-left 0.5rem

</style>