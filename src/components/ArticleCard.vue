<template>
  <v-card class="mx-auto">
    <v-img :src="imageUrl" max-height="300px"> </v-img>
    <v-card-title>
      <span class="text-h3 font-weight-light mr-2">{{ title }}</span>
    </v-card-title>
    <v-card-subtitle>
      <v-row justify="end">
        <span class="caption">{{ postdate }}</span>
      </v-row>
      <v-row justify="end">
        <v-chip class="mt-2 mr-2" small :color="categryObj.color">{{
          categryObj.value
        }}</v-chip>
      </v-row>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text v-html="text"></v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "ArticleCard",
  props: ["imageUrl", "title", "postdate", "categryObj", "text"],
};
</script>