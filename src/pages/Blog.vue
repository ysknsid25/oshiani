<template>
  <v-container>
    <v-row v-if="loading">
      <v-col cols="12">
        <div align="center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </v-col>
    </v-row>
    <v-row dense class="mb-2" v-if="!loading">
      <v-col xs="12" md="12">
        <v-toolbar>
          <v-select
            :items="blogCategory"
            item-text="value"
            item-value="key"
            v-model="category"
            label="category"
            dense
            class="mr-4 mt-5"
          ></v-select>
          <v-btn icon @click="serchArticleByCategory()">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row dense v-if="!loading && articles.length > 0">
      <v-col
        v-for="articleInfo in articles"
        :key="articleInfo.articleId"
        xs="12"
        sm="6"
      >
        <v-card hover tile @click="doDispArticle(articleInfo.articleId)">
          <v-img
            :src="getImageUrl(articleInfo.imageUrl)"
            :max-height="$vuetify.breakpoint.xs ? '600px' : '300px'"
          >
          </v-img>
          <v-card-title
            class="subtitle-1"
            v-text="articleInfo.title"
          ></v-card-title>
          <v-card-subtitle v-text="articleInfo.postDate"></v-card-subtitle>
          <v-divider></v-divider>
          <v-card-actions>
            <ArticleCategoryChip
              :categoryObj="articleInfo.categoryObj"
            ></ArticleCategoryChip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense v-if="!loading && articles.length === 0">
      <v-col cols="12">
        <div align="center">
          <h1 class="text-h1">No Data</h1>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { getArticles, getCategoryArticles } from "../firestoreaccess/Article";
import { blogCategory, getImage } from "../api/Annict";
import ArticleCategoryChip from "../components/ArticleCategoryChip";
export default {
  name: "Blog",
  components: {
    ArticleCategoryChip,
  },
  data: () => ({
    loading: false,
    logined: false,
    articles: [],
    article: {},
    uid: "",
    imageUrl: "",
    title: "",
    postDate: "",
    categryObj: {},
    text: "",
    category: "",
    blogCategory: blogCategory,
  }),
  created: async function () {
    this.uid = localStorage.getItem("userInfo");
    this.logined = this.uid !== null && typeof this.uid !== "undefined";
    this.blogCategory.unshift({ key: "", value: "", color: "" });
    await this.getArticles();
  },
  methods: {
    getImageUrl(imageurl) {
      return getImage(imageurl);
    },
    async getArticles() {
      this.loading = true;
      this.articles = await getArticles(30);
      this.loading = false;
    },
    async getArticlesByCategory() {
      this.loading = true;
      this.articles = await getCategoryArticles(30, this.category);
      this.loading = false;
    },
    doDispArticle(articleId) {
      this.$router.push({
        name: "Article",
        path: "/Article",
        params: {
          articleId: articleId,
        },
      });
    },
    async serchArticleByCategory() {
      this.loading = true;
      if (this.category === "") {
        this.articles = this.getArticles();
      } else {
        this.articles = this.getArticlesByCategory();
      }
      this.loading = false;
    },
  },
};
</script>