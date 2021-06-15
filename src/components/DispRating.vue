<template>
  <v-rating
    :value="reviewInfo.avgStar"
    :color="reviewInfo.starColor"
    dense
    half-increments
    readonly
    :size="reviewInfo.starSize"
  ></v-rating>
</template>

<script>
export default {
  name: "DispRating",
  props: ["reviewInfo"],
};
</script>