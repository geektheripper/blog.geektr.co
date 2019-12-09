<template>
  <main class="home">
    <Header :meta="dailyWife" />

    <Content class="theme-default-content custom" />

    <Footer />
  </main>
</template>

<script>
import Footer from "./Footer";
import Header from "./Header";

export default {
  components: { Header, Footer },
  computed: {
    dailyWife() {
      const dailyWife = this.$page.frontmatter.dailyWife;
      return dailyWife[new Date().getDay()] || dailyWife[0];
    }
  }
};
</script>

<style lang="stylus">
.home
  .theme-default-content
    max-width 960px
    margin 0 auto
    padding 2rem 5rem

@media (max-width: $MQMobile)
  .home
    .theme-default-content
      padding 1rem 2rem
</style>
