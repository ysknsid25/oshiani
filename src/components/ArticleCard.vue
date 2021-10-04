<template>
  <div>
    <div v-if="isDataFound && !loading">
      <v-card class="mx-auto">
        <v-img :src="headImgUrl" max-height="400px"> </v-img>
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
          <div v-if="category === 2">
            <v-row dense class="mt-2">
              <v-col class="my-0">ストーリー</v-col>
              <v-col class="my-0">
                <DispRating :avgStar="rateStory"></DispRating>
              </v-col>
            </v-row>
            <v-row dense class="my-0">
              <v-col class="my-0">声優さんの演技</v-col>
              <v-col class="my-0">
                <DispRating :avgStar="rateActor"></DispRating>
              </v-col>
            </v-row>
            <v-row dense class="my-0">
              <v-col class="my-0">作画 </v-col>
              <v-col class="my-0">
                <DispRating :avgStar="ratePicture"></DispRating>
              </v-col>
            </v-row>
            <v-row dense class="my-0">
              <v-col class="my-0">音楽</v-col>
              <v-col class="my-0">
                <DispRating :avgStar="rateMusic"></DispRating>
              </v-col>
            </v-row>
          </div>
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
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </div>
</template>
<script>
import ArticleCategoryChip from "../components/ArticleCategoryChip";
import { getBlogCommentTweetUrl } from "../constants/links";
import { getArticle } from "../firestoreaccess/Article";
import DispRating from "../components/DispRating";
export default {
  name: "ArticleCard",
  components: {
    ArticleCategoryChip,
    DispRating,
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
    rateStory: 0,
    rateActor: 0,
    ratePicture: 0,
    rateMusic: 0,
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
      this.rateStory = articleInfo.rateStory;
      this.rateActor = articleInfo.rateActor;
      this.ratePicture = articleInfo.ratePicture;
      this.rateMusic = articleInfo.rateMusic;
    }
    this.loading = false;
  },
  methods: {
    getTweetUrl() {
      return getBlogCommentTweetUrl(this.articleId);
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