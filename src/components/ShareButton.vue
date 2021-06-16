<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        color="primary"
        v-bind="attrs"
        v-on="on"
        :href="getTweetUrl(title, hashTag, officialSite)"
      >
        <v-icon>fas fa-share-alt</v-icon>
      </v-btn>
    </template>
    <span>twitterで共有する</span>
  </v-tooltip>
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