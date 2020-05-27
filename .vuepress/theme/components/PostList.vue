<template>
  <div class="default-content">
    <PostItem v-for="page in pages" :key="page.key" :page="page" />
  </div>
</template>


<script>
import PostItem from "@theme/components/PostItem";

export default {
  components: { PostItem },
  props: ["pages"]
};
</script>
