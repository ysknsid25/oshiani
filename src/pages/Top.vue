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
      <v-btn
        color="secondary"
        v-if="logined && !sending"
        dark
        icon
        @click="logout"
      >
        <v-icon>fas fa-door-open</v-icon>
      </v-btn>
      <v-btn
        color="secondary"
        v-if="!logined && !sending"
        dark
        icon
        @click="login"
      >
        <v-icon>fas fa-door-closed</v-icon>
      </v-btn>
      <v-progress-circular
        v-if="sending"
        indeterminate
        color="indigo"
      ></v-progress-circular>
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
              <v-card-title>
                {{ workInfo.title }}
              </v-card-title>
              <v-card-text>
                <v-row align="center" class="mx-0">
                  <v-chip
                    v-if="workInfo.media !== ''"
                    :color="getMediaTypeColor(workInfo.media)"
                    v-text="
                      workInfo.media_text === '' ? 'Othre' : workInfo.media_text
                    "
                  >
                  </v-chip>
                  <v-spacer></v-spacer>
                  <v-rating
                    :value="4.5"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="14"
                  ></v-rating>
                  <div class="grey--text ms-4">4.5 (413)</div>
                </v-row>
              </v-card-text>
              <v-divider class="mx-4"></v-divider>
              <v-card-actions>
                <v-menu>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      v-if="
                        isExistpages(
                          workInfo.official_site_url,
                          workInfo.wikipedia_url
                        )
                      "
                    >
                      <v-icon>fas fa-external-link-alt</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item v-if="workInfo.official_site_url !== ''">
                      <v-list-item-title>
                        <v-btn text :href="workInfo.official_site_url">
                          official page
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="workInfo.wikipedia_url !== ''">
                      <v-list-item-title>
                        <v-btn text :href="workInfo.wikipedia_url">
                          wikipedia
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  v-if="workInfo.twitter_username !== ''"
                  :href="getTwitterAccountUrl(workInfo.twitter_username)"
                >
                  <v-icon color="#1DA1F2">fab fa-twitter</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>fas fa-bookmark</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="primary"
                  :href="getTweetUrl(workInfo.title, workInfo.twitter_hashtag)"
                >
                  <v-icon>fas fa-share-alt</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>fas fa-ellipsis-v</v-icon>
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
import { getTweetUrl } from "../constants/links";
import {
  getNowYear,
  getNowSeason,
  getWorkInfoUrl,
  getTwitterUrl,
  getCount,
  mediaType,
} from "../api/Annict";
import { login, logout, getAuthUserInfo, anl } from "../plugins/firebase";
import { authorizeUser } from "../firestoreaccess/Users";
export default {
  name: "Top",
  components: {},
  data: () => ({
    loading: false,
    sending: false,
    logined: false,
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
    await this.isLogined();
  },
  methods: {
    async login() {
      this.sending = true;
      anl.logEvent("logout detected");
      this.user = await login();
      if (this.user.isLoginSuccess) {
        await authorizeUser(this.user);
        await this.isLogined();
      } else {
        alert("ログイン処理に失敗しました。");
        this.sending = false;
      }
      this.sending = false;
    },
    async isLogined() {
      const userInfo = await getAuthUserInfo();
      this.logined = userInfo !== "";
    },
    async logout() {
      this.sending = true;
      await logout();
      await this.isLogined();
      this.sending = false;
    },
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
    isExistpages(official, wiki) {
      return official !== "" && wiki !== "";
    },
    getMediaTypeColor(media) {
      if (media === "") {
        return media;
      }
      return mediaType[media];
    },
  },
};
</script>