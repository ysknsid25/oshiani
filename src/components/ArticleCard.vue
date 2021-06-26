<template>
  <v-card class="mx-auto">
    <v-img :src="imageUrl" max-height="300px"> </v-img>
    <v-card-title>
      <span class="text-h3 black--text font-weight-light mr-2">{{
        title
      }}</span>
    </v-card-title>
    <v-card-subtitle>
      <v-row justify="end">
        <span class="caption">{{ postdate }}</span>
      </v-row>
      <v-row justify="end">
        <ArticleCategoryChip :categoryObj="categryObj"></ArticleCategoryChip>
      </v-row>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text v-html="text" class="black--text"></v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="#1DA1F2"
        outlined
        tile
        :href="getTweetUrl()"
        target="_blank"
      >
        <v-icon color="#1DA1F2" class="mr-2">fab fa-twitter</v-icon>
        コメントする
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import ArticleCategoryChip from "../components/ArticleCategoryChip.vue";
import { getBlogCommentTweetUrl } from "../constants/links";
export default {
  name: "ArticleCard",
  components: {
    ArticleCategoryChip,
  },
  props: ["imageUrl", "title", "postdate", "categryObj", "text"],
  methods: {
    getTweetUrl() {
      return getBlogCommentTweetUrl();
    },
  },
};
</script>