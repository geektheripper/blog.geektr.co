<template>
  <PublicLayout class="home">
    <HeaderImage :meta="dailyWife" />
    <Post />
  </PublicLayout>
</template>

<script>
import PublicLayout from "@theme/layouts/PublicLayout";
import HeaderImage from "@theme/components/HeaderImage";
import Post from "@theme/components/Post";

export default {
  components: { PublicLayout, HeaderImage, Post },
  computed: {
    dailyWife() {
      const dailyWife = this.$page.frontmatter.dailyWife;
      return dailyWife[new Date().getDay()] || dailyWife[0];
    }
  }
};
</script>
