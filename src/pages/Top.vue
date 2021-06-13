<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Application </v-list-item-title>
          <v-list-item-subtitle> subtext </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="white" app v-if="!loading">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>title</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="secondary" dark icon class="mr-2">
        <v-icon>fas fa-bell</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container v-if="!loading">
        <v-row dense class="mb-2">
          <v-col xs="12" md="12">
            <v-toolbar>
              <v-toolbar-title>Discover</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-toolbar>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col
            v-for="workInfo in workInfos"
            :key="workInfo.id"
            xs="12"
            md="6"
          >
            <v-card>
              <v-img
                :src="getImageUrl(workInfo.images.recommended_url)"
                max-height="300px"
              >
              </v-img>
              <v-card-title v-text="workInfo.title"></v-card-title>
              <v-card-actions>
                <v-icon v-if="workInfo.no_episodes">fas fa-film</v-icon>
                <v-icon v-if="!workInfo.no_episodes">fas fa-tv</v-icon>
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  v-if="workInfo.twitter_username !== ''"
                  :href="getTwitterAccountUrl(workInfo.twitter_username)"
                >
                  <v-icon color="#1DA1F2">fab fa-twitter</v-icon>
                </v-btn>

                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>

                <v-btn icon>
                  <v-icon>mdi-bookmark</v-icon>
                </v-btn>

                <v-btn
                  icon
                  :href="getTweetUrl(workInfo.title, workInfo.twitter_hashtag)"
                >
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row dense class="mb-2">
          <v-col xs="12" md="12">
            <div class="text-center">
              <v-pagination
                v-model="nowPage"
                :length="totalPage"
                @input="getNumber"
              ></v-pagination>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="loading">
        <v-row justify="center">
          <v-col cols="12">
            <div align="center">
              <v-progress-circular
                indeterminate
                color="indigo"
              ></v-progress-circular>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import { noteUrl } from "../constants/links";
import { getTweetUrl } from "../constants/links";
import {
  getNowYear,
  getNowSeason,
  getWorkInfoUrl,
  getTwitterUrl,
  getCount,
} from "../api/Annict";
export default {
  name: "Top",
  data: () => ({
    loading: false,
    noteUrl: noteUrl,
    user: "",
    drawer: true,
    items: [
      { icon: "hoge", title: "1" },
      { icon: "hoge", title: "2" },
      { icon: "hoge", title: "3" },
      { icon: "hoge", title: "4" },
    ],
    workInfos: [],
    totalPage: 0,
    nowPage: 1,
  }),
  mounted: async function () {
    await this.getAnimeInfo(this.nowPage);
  },
  methods: {
    async getAnimeInfo(targetPage) {
      this.loading = true;
      const nowSeason = getNowSeason();
      const nowYear = getNowYear();
      const targetUrl = getWorkInfoUrl(nowYear, nowSeason, targetPage);
      await this.axios
        .get(targetUrl)
        .then((response) => {
          //console.log("@@1");
          //console.log(response.data.works);
          this.workInfos = response.data.works;
          this.isExistPage(response.data.total_count);
        })
        .catch((error) => {
          console.log("@@2");
          console.log(error);
        });
      this.loading = false;
    },
    isExistPage(totalCount) {
      if (totalCount === 0) {
        return false;
      }
      const baseTotalPage = Math.floor(totalCount / getCount);
      const isExistAmari = totalCount % getCount !== 0;
      if (isExistAmari) {
        this.totalPage = baseTotalPage + 1;
      } else {
        this.totalPage = baseTotalPage;
      }
      return true;
    },
    getImageUrl(url) {
      if (url !== "") {
        return url;
      }
      return "https://placehold.jp/600x300.png";
    },
    getTwitterAccountUrl(url) {
      const retUrl = getTwitterUrl(url);
      //console.log(retUrl);
      return retUrl;
    },
    getTweetUrl(title, hashTag) {
      return getTweetUrl(title, hashTag);
    },
    async getNumber(pageNumber) {
      await this.getAnimeInfo(pageNumber);
    },
  },
};
</script>