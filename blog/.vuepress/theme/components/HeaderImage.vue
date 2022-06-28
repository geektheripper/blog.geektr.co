<template>
  <header
    :style="{
        backgroundImage: `url(${$withBase(meta.image)})`,
        backgroundPosition: '22% 50%',
      }"
  >
    <a class="author" target="_blank" :href="meta.author.url" v-if="meta.author">
      <img class="avatar" :src="$withBase(meta.author.avatar)" alt />
      <span class="name">{{ meta.author.name }}</span>
    </a>
    <div class="shadow-area">
      <Content class="description" slot-key="header-image-text" />
    </div>
  </header>
</template>

<script>
export default { props: ["meta"] };
</script>

<style lang="stylus" scoped>
header
  position relative
  top 0
  left 0
  width 100%
  height 40vh
  display block
  background-size cover
  background-position center

.author
  position absolute
  top 10%
  right 10%
  background-color rgba(0, 0, 0, 0.6)
  color white
  height 1.5rem
  display flex
  user-select none

  .avatar
    height 100%

  .name
    padding 0 0.5rem

.shadow-area
  position absolute
  box-sizing border-box
  width 100%
  bottom 0
  background-image linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5))
  color white

  .description
    padding 1rem 5rem
    max-width $textAreaWidth
    margin 0 auto

@media (max-width: $MQMobile)
  header
    font-size 1rem
    height 30vh

  .shadow-area .description
    padding 1rem 2rem
</style>
