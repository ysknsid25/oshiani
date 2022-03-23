<template>
  <v-card class="auth-card">
    <v-card-title class="text-no-wrap">
      <v-icon class="mr-4 primary--text">far fa-newspaper</v-icon>
      <span class="kagerou thirdColor--text">管理人ブログの人気記事</span>
    </v-card-title>
    <v-card-text class="d-flex align-center mt-2 pb-2 ps-2">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="4"
            xs="12"
            class="mt-0 pt-0"
            v-for="articleInfo in adminBlogArticles"
            :key="articleInfo.articleId"
          >
            <v-card hover tile @click="doDispArticle(articleInfo.articleId)">
              <v-img :src="articleInfo.imgUrl" height="150px"> </v-img>
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
//import ArticleCategoryChip from "../../components/ArticleCategoryChip";
//import { getArticles } from "../../firestoreaccess/Article";
import "../../assets/scss/style.scss";
export default {
  name: "AdminBlogCard",
  data: () => ({
    adminBlogArticles: [
      {
        url: "https://untitledreport.com/%e3%82%a2%e3%82%a4%e3%83%89%e3%83%ab%e3%81%ae%e7%90%86%e6%83%b3%e3%81%a8%e7%8f%be%e5%ae%9f%e3%82%92%e6%8f%8f%e3%81%84%e3%81%9f%e7%89%a9%e8%aa%9e-%e3%80%8e%e3%81%8d%e3%81%bf%e3%81%af%e6%9c%ac/",
        imgUrl:
          "http://untitledreport.com/wp-content/uploads/2022/02/君天1.png",
        title:
          '"アイドルの理想と現実を描いた物語" 『きみは本当に僕の天使なのか』 感想 レビュー ネタバレ',
        postDate: "2022年3月9日",
      },
      {
        url: "https://untitledreport.com/%e5%af%be%e8%a9%b1%e3%81%8c%e8%b6%b3%e3%82%8a%e3%81%aa%e3%81%8b%e3%81%a3%e3%81%9f2%e4%ba%ba%e3%81%ae%e5%86%8d%e4%bc%9a%e3%81%ae%e7%89%a9%e8%aa%9e-%e3%80%8e%e5%90%9b%e3%81%af%e5%83%95%e3%81%ae/",
        imgUrl:
          "https://untitledreport.com/wp-content/uploads/2022/02/%E5%90%9B%E3%82%8A%E3%81%901.png",
        title:
          '"対話が足りなかった2人の再会の物語" 『君は僕の後悔』 感想 レビュー ネタバレ',
        postDate: "2022年3月2日",
      },
      {
        url: "https://untitledreport.com/%e3%81%84%e3%81%a4%e3%81%8b%e3%82%89%e3%83%ad%e3%82%b7%e3%82%a2%e8%aa%9e%e3%81%8c%e5%88%86%e3%81%8b%e3%82%89%e3%81%aa%e3%81%84%e3%81%a8%e9%8c%af%e8%a6%9a%e3%81%97%e3%81%a6%e3%81%84%e3%81%9f%ef%bc%9f/",
        imgUrl:
          "http://untitledreport.com/wp-content/uploads/2022/02/アーリャさん.png",
        title:
          '"いつからロシア語が分からないと錯覚していた？" 『時々ボソッとロシア語でデレる隣のアーリャさん』 感想 レビュー ネタバレ',
        postDate: "2022年2月13日",
      },
    ],
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
  },
};
</script>