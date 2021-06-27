<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="9">
        <ArticleCard :articleId="articleId"></ArticleCard>
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
  props: ["articleId"],
  mounted: function () {
    if (this.articleId === "" || typeof this.articleId === "undefined") {
      this.$router.push("/Blog");
    }
  },
};
</script>