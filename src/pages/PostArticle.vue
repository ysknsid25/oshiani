<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="articleId"
                label="Article ID"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="secondary"
                dark
                outlined
                tile
                @click="searchArticle"
              >
                検索
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-text-field v-model="title" label="title" required></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="headImgUrl"
              label="image URL"
              @change="getImageUrl"
              required
            ></v-text-field>
          </v-row>
          <v-row>
            <v-select
              label="category"
              :items="blogCategory"
              item-text="value"
              item-value="key"
              v-model="category"
              @change="changeCategory"
            >
            </v-select>
          </v-row>
          <v-row>
            <v-textarea
              outlined
              v-model="article1"
              label="article1"
              counter="500"
              @keydown="concatText"
              @blur="concatText"
            ></v-textarea>
          </v-row>
          <v-row>
            <v-textarea
              outlined
              v-model="article2"
              label="article2"
              counter="500"
              @keydown="concatText"
              @blur="concatText"
            ></v-textarea>
          </v-row>
          <v-row>
            <v-textarea
              outlined
              v-model="article3"
              label="article3"
              counter="500"
              @keydown="concatText"
              @blur="concatText"
            ></v-textarea>
          </v-row>
          <v-row>
            <v-textarea
              outlined
              v-model="article4"
              label="article4"
              counter="500"
              @keydown="concatText"
              @blur="concatText"
            ></v-textarea>
          </v-row>
          <v-row>
            <v-textarea
              outlined
              v-model="article5"
              label="article5"
              counter="500"
              @keydown="concatText"
              @blur="concatText"
            ></v-textarea>
          </v-row>
          <v-row>
            <v-textarea
              outlined
              v-model="article6"
              label="article6"
              counter="500"
              @keydown="concatText"
              @blur="concatText"
            ></v-textarea>
          </v-row>
          <v-row>
            <v-btn color="secondary" dark outlined tile @click="postArticle">
              投稿
            </v-btn>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="8">
        <v-container>
          <ArticleCard
            :imageUrl="getImageUrl()"
            :title="title"
            :postdate="postdate"
            :categryObj="categryObj"
            :text="text"
          ></ArticleCard>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { blogCategory, getImage } from "../api/Annict";
import { getTimeStamp } from "../constants/cmnfunc";
import ArticleCard from "../components/ArticleCard";
import { postArticle, getArticle } from "../firestoreaccess/Article";
export default {
  name: "PostArticle",
  components: {
    ArticleCard,
  },
  data: () => ({
    articleId: "",
    title: "",
    headImgUrl: "",
    text: "",
    blogCategory: blogCategory,
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
  mounted: function () {
    this.postdate = getTimeStamp();
  },
  methods: {
    getImageUrl() {
      this.headImgUrl = getImage(this.headImgUrl);
      return this.headImgUrl;
    },
    concatText() {
      this.text =
        this.article1 +
        this.article2 +
        this.article3 +
        this.article4 +
        this.article5 +
        this.article6;
    },
    changeCategory() {
      this.categryObj = blogCategory.find(
        (category) => this.category === category.key
      );
    },
    async postArticle() {
      const articleInfo = {
        articleId: this.articleId,
        title: this.title,
        imageUrl: this.headImgUrl,
        categoryObj: this.categryObj,
        article1: this.article1,
        article2: this.article2,
        article3: this.article3,
        article4: this.article4,
        article5: this.article5,
        article6: this.article6,
        postDate: this.postdate,
      };
      const result = await postArticle(articleInfo);
      alert(result);
    },
    async searchArticle() {
      const articleInfo = await getArticle(this.articleId);
      //console.log(articleInfo);
      this.articleId = articleInfo.articleId;
      this.title = articleInfo.title;
      this.headImgUrl = articleInfo.imageUrl;
      this.categoryObj = articleInfo.categoryObj;
      this.category = this.categoryObj.key;
      this.article1 = articleInfo.article1;
      this.article2 = articleInfo.article2;
      this.article3 = articleInfo.article3;
      this.article4 = articleInfo.article4;
      this.article5 = articleInfo.article5;
      this.article6 = articleInfo.article6;
      this.postdate = articleInfo.postDate;
    },
  },
};
</script>