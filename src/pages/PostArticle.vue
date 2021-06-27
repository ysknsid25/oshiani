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
              v-model="postdate"
              label="Post Date"
              required
            ></v-text-field>
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
            <v-text-field v-model="rateStory" label="ストーリー"></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="rateActor"
              label="声優さんの演技"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field v-model="ratePicture" label="作画"></v-text-field>
          </v-row>
          <v-row>
            <v-text-field v-model="rateMusic" label="音楽"></v-text-field>
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
          <v-card class="mx-auto">
            <v-img :src="getImageUrl()" max-height="300px"> </v-img>
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
              <v-btn color="#1DA1F2" outlined tile target="_blank">
                <v-icon color="#1DA1F2" class="mr-2">fab fa-twitter</v-icon>
                コメントする
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { blogCategory, getImage } from "../api/Annict";
import { getTimeStamp } from "../constants/cmnfunc";
import { postArticle, getArticle } from "../firestoreaccess/Article";
import ArticleCategoryChip from "../components/ArticleCategoryChip";
import DispRating from "../components/DispRating";
export default {
  name: "PostArticle",
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
    rateStory: 0,
    rateActor: 0,
    ratePicture: 0,
    rateMusic: 0,
    categryObj: {
      key: 0,
      value: "次にアニメ化しそうな作品",
      color: "#F8BBD0",
    },
    postdate: "",
  }),
  components: {
    ArticleCategoryChip,
    DispRating,
  },
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
        category: this.category,
        article1: this.article1,
        article2: this.article2,
        article3: this.article3,
        article4: this.article4,
        article5: this.article5,
        article6: this.article6,
        postDate: this.postdate,
        rateStory: this.rateStory,
        rateActor: this.rateActor,
        ratePicture: this.ratePicture,
        rateMusic: this.rateMusic,
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
      this.rateStory = articleInfo.rateStory;
      this.rateActor = articleInfo.rateActor;
      this.ratePicture = articleInfo.ratePicture;
      this.rateMusic = articleInfo.rateMusic;
    },
  },
};
</script>