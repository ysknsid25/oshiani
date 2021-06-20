<template>
  <v-rating
    :value="avgStar"
    color="amber"
    dense
    half-increments
    readonly
    size="14"
  ></v-rating>
</template>

<script>
export default {
  name: "DispRating",
  props: ["avgStar"],
};
</script>