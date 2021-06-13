<template>
  <v-btn icon color="primary" :href="getTweetUrl(title, hashTag, officialSite)">
    <v-icon>fas fa-share-alt</v-icon>
  </v-btn>
</template>
<script>
import { getTweetUrl } from "../constants/links";
export default {
  name: "ShareButton",
  props: ["title", "hashTag", "officialSite"],

  methods: {
    getTweetUrl(title, hashTag, officialSite) {
      return getTweetUrl(title, hashTag, officialSite);
    },
  },
};
</script>