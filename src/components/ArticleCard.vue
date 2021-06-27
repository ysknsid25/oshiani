<template>
  <div>
    <div v-if="isDataFound && !loading">
      <v-card class="mx-auto">
        <v-img :src="headImgUrl" max-height="300px"> </v-img>
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
            <ArticleCategoryChip
              :categoryObj="categryObj"
            ></ArticleCategoryChip>
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
    </div>
    <div v-if="!isDataFound && !loading" align="center">
      <h1 class="text-h1">404 Not Found</h1>
    </div>
    <div align="center" v-if="loading">
      <v-progress-circular indeterminate color="indigo"></v-progress-circular>
    </div>
  </div>
</template>
<script>
import ArticleCategoryChip from "../components/ArticleCategoryChip";
import { getBlogCommentTweetUrl } from "../constants/links";
import { getArticle } from "../firestoreaccess/Article";
export default {
  name: "ArticleCard",
  components: {
    ArticleCategoryChip,
  },
  props: ["articleId"],
  data: () => ({
    isDataFound: false,
    loading: false,
    title: "",
    headImgUrl: "",
    text: "",
    category: "",
    article1: "",
    article2: "",
    article3: "",
    article4: "",
    article5: "",
    article6: "",
    categryObj: {
      key: 0,
      value: "次にアニメ化しそうな作品",
      color: "#F8BBD0",
    },
    postdate: "",
  }),
  mounted: async function () {
    this.loading = true;
    const articleInfo = await getArticle(this.articleId);
    if (articleInfo.articleId !== "") {
      this.isDataFound = true;
      this.title = articleInfo.title;
      this.headImgUrl = this.getImageUrl(articleInfo.imageUrl);
      this.categryObj = articleInfo.categoryObj;
      this.category = this.categryObj.key;
      this.text =
        articleInfo.article1 +
        articleInfo.article2 +
        articleInfo.article3 +
        articleInfo.article4 +
        articleInfo.article5 +
        articleInfo.article6;
      this.postdate = articleInfo.postDate;
    }
    this.loading = false;
  },
  methods: {
    getTweetUrl() {
      return getBlogCommentTweetUrl();
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