<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="9">
        <ArticleCard
          :imageUrl="imageUrl"
          :title="title"
          :postdate="postDate"
          :categryObj="categryObj"
          :text="text"
        ></ArticleCard>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import ArticleCard from "../components/ArticleCard";
export default {
  name: "Article",
  components: {
    ArticleCard,
  },
  props: ["imageUrl", "title", "postDate", "categryObj", "text"],
  mounted: function () {
    if (this.title === "" || typeof this.title === "undefined") {
      this.$router.push("/Blog");
    }
  },
};
</script>