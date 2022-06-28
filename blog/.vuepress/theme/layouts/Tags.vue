<template>
  <PublicLayout>
    <div class="default-content">
      <h2>Tags</h2>
      <ul>
        <li v-for="tag in $tag.list">
          <router-link class="page-link" :to="tag.path">{{ tag.name }}</router-link>
        </li>
      </ul>
    </div>
  </PublicLayout>
</template>

<script>
import PublicLayout from "@theme/layouts/PublicLayout";

export default {
  components: { PublicLayout }
};
</script>

<style lang="stylus" scoped>

</style>