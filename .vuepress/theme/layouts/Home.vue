<template>
  <PublicLayout class="home">
    <HeaderImage :meta="dailyWife" />
    <PostList :pages="$site.pages.filter(i => i.title)" />
    <Post />
  </PublicLayout>
</template>

<script>
import PublicLayout from "@theme/layouts/PublicLayout";
import HeaderImage from "@theme/components/HeaderImage";
import Post from "@theme/components/Post";
import PostList from "@theme/components/PostList";

export default {
  components: { PublicLayout, HeaderImage, Post, PostList },
  computed: {
    dailyWife() {
      const dailyWife = this.$page.frontmatter.dailyWife;
      return dailyWife[new Date().getDay()] || dailyWife[0];
    }
  }
};
</script>
