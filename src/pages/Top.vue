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
      <v-snackbar
        v-model="isOpenSnackbar"
        :color="snackbarColor"
        top
        :timeout="timeout"
      >
        {{ snackbarMessage }}
      </v-snackbar>
    </v-app-bar>
    <v-content>
      <router-view :key="logined"></router-view>
    </v-content>
  </v-app>
</template>
<script>
import { login, logout, anl } from "../plugins/firebase";
import { authorizeUser } from "../firestoreaccess/Users";
export default {
  name: "Top",
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
  }),
  mounted: function () {
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
        //console.log(this.logined);
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
  },
};
</script>