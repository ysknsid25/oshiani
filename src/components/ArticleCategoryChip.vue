<template>
  <v-chip class="mt-2 mr-2" small :color="categoryObj.color">{{
    categoryObj.value
  }}</v-chip>
</template>
<script>
export default {
  name: "ArticleCategoryChip",
  props: ["categoryObj"],
};
</script>