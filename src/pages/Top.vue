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
            <WorkInfoCard
              :workInfo="workInfo"
              :isLogined="logined"
            ></WorkInfoCard>
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
        <v-snackbar
          v-model="isOpenSnackbar"
          :color="snackbarColor"
          top
          :timeout="timeout"
        >
          {{ snackbarMessage }}
        </v-snackbar>
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
import WorkInfoCard from "../components/WorkInfoCard";
import {
  getNowYear,
  getNowSeason,
  getWorkInfoUrl,
  getCount,
} from "../api/Annict";
import { login, logout, anl } from "../plugins/firebase";
import { authorizeUser } from "../firestoreaccess/Users";
export default {
  name: "Top",
  components: {
    WorkInfoCard,
  },
  data: () => ({
    loading: false,
    sending: false,
    logined: false,
    isOpenSnackbar: false,
    snackbarColor: "success",
    snackbarMessage: "",
    timeout: 2000,
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
  mounted: function () {
    this.getAnimeInfo(this.nowPage);
    this.isLogined();
  },
  methods: {
    async login() {
      this.sending = true;
      anl.logEvent("logout detected");
      this.user = await login();
      localStorage.setItem("userInfo", this.user);
      if (this.user.isLoginSuccess) {
        await authorizeUser(this.user);
        this.isLogined();
        this.openSnackBar("ログインしました。", "success");
      } else {
        this.sending = false;
        this.openSnackBar("ログイン処理に失敗しました。", "error");
      }
      this.sending = false;
    },
    openSnackBar(message, type) {
      this.snackbarMessage = message;
      this.snackbarColor = type;
      this.isOpenSnackbar = true;
    },
    isLogined() {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo === null) {
        this.user = "";
        this.logined = false;
        console.log(this.logined);
      } else {
        this.user = userInfo;
        this.logined = true;
      }
    },
    async logout() {
      this.sending = true;
      localStorage.removeItem("userInfo");
      this.openSnackBar("ログアウトしました。", "info");
      this.isLogined();
      await logout();
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
    async getNumber(pageNumber) {
      await this.getAnimeInfo(pageNumber);
    },
  },
};
</script>