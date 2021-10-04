<template>
  <v-card class="auth-card secondary">
    <v-card-title class="text-no-wrap">
      <v-icon class="mr-4 primary--text">far fa-newspaper</v-icon>
      <span class="kagerou thirdColor--text">管理人ブログ</span>
    </v-card-title>
    <v-card-text class="d-flex align-center mt-2 pb-2 ps-2">
      <v-container>
        <v-row v-if="adminBlogLoading">
          <v-col cols="12">
            <div align="center">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
          </v-col>
        </v-row>
        <v-row v-if="!adminBlogLoading">
          <v-col
            cols="12"
            md="4"
            xs="12"
            class="mt-0 pt-0"
            v-for="articleInfo in adminBlogArticles"
            :key="articleInfo.articleId"
          >
            <v-card
              hover
              tile
              class="secondary"
              @click="doDispArticle(articleInfo.articleId)"
            >
              <v-img :src="getImageUrl(articleInfo.imageUrl)" height="150px">
                <ArticleCategoryChip
                  :categoryObj="articleInfo.categoryObj"
                ></ArticleCategoryChip>
              </v-img>
              <v-card-title
                class="subtitle-1"
                v-text="articleInfo.title"
              ></v-card-title>
              <v-card-subtitle v-text="articleInfo.postDate"></v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
import ArticleCategoryChip from "../../components/ArticleCategoryChip";
import { getArticles } from "../../firestoreaccess/Article";
import "../../assets/scss/style.scss";
export default {
  name: "AdminBlogCard",
  components: {
    ArticleCategoryChip,
  },
  mounted: async function () {
    this.adminBlogLoading = true;
    this.adminBlogArticles = await getArticles(3);
    this.adminBlogLoading = false;
  },
  data: () => ({
    adminBlogArticles: [],
    adminBlogLoading: true,
  }),
  methods: {
    doDispArticle(articleId) {
      this.$router.push({
        name: "Article",
        path: "/Article",
        params: {
          articleId: articleId,
        },
      });
    },
    getImageUrl(url) {
      if (url === "./images/noimage.png") {
        return "../images/noimage.png";
      }
      if (url !== "") {
        return url;
      }
      return "../images/noimage.png";
    },
  },
};
</script>