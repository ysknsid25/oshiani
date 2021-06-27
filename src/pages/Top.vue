<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            <div align="center">
              <v-avatar size="56">
                <img
                  alt="oshianilogo"
                  src="../../public/images/icons/icon-192x192.png"
                  class="mr-2"
                />
              </v-avatar>
            </div>
          </v-list-item-title>
          <v-list-item-subtitle>
            <div align="center">推しアニ！</div>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item
          v-for="nav_list in nav_lists"
          :key="nav_list.name"
          link
          :to="nav_list.url"
        >
          <v-list-item-icon>
            <v-icon :color="nav_list.iconColor">{{ nav_list.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ nav_list.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="nav_list in constLists"
          :key="nav_list.name"
          :href="nav_list.url"
        >
          <v-list-item-icon>
            <v-icon :color="nav_list.iconColor">{{ nav_list.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ nav_list.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/PostArticle" v-if="user === admin">
          <v-list-item-icon>
            <v-icon>fas fa-pen-nib</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ブログ投稿</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2 caption text-center">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-small
                text
                v-bind="attrs"
                v-on="on"
                link
                href="https://twitter.com/samurai_se"
              >
                <v-icon x-small class="mx-1">far fa-copyright</v-icon>
                {{ new Date().getFullYear() }} —
                <strong class="ml-1">Ramen Tabetaro</strong>
              </v-btn>
            </template>
            <span>開発者のTwitterへ</span>
          </v-tooltip>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar color="white" app v-if="!loading">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="secondary"
        v-if="logined && !sending"
        dark
        outlined
        tile
        @click="logout"
      >
        Sign out
      </v-btn>
      <v-dialog
        v-if="!logined && !sending"
        v-model="isOpenLoginDialog"
        max-width="300"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="secondary"
            v-if="!logined && !sending"
            dark
            outlined
            tile
            v-bind="attrs"
            v-on="on"
            @click="isOpenLoginDialog = true"
          >
            Sign in
          </v-btn>
        </template>
        <v-card class="mx-auto">
          <v-card-text>
            <v-container>
              <v-row justify="center" class="mt-2">
                <v-btn
                  color="#1DA1F2"
                  v-if="!logined && !sending"
                  outlined
                  tile
                  width="250"
                  @click="login(1)"
                >
                  <v-icon color="#1DA1F2" class="mr-2">fab fa-twitter</v-icon>
                  Sign in with twitter
                </v-btn>
              </v-row>
              <v-row justify="center" class="mt-2">
                <v-btn
                  color="#C62828"
                  v-if="!logined && !sending"
                  dark
                  outlined
                  tile
                  width="250"
                  @click="login(2)"
                >
                  <v-icon color="#C62828" class="mr-2">fab fa-google</v-icon>
                  Sign in with google
                </v-btn>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="isOpenLoginDialog = false">
              close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
    <v-content class="pt-0">
      <router-view :key="logined"></router-view>
    </v-content>
  </v-app>
</template>
<script>
import {
  login,
  loginWithGoogle,
  logout,
  anl,
  RAMEN,
} from "../plugins/firebase";
import { authorizeUser } from "../firestoreaccess/Users";
import { menulist, constMenuLists } from "../constants/menulist";
export default {
  name: "Top",
  data: () => ({
    loading: false,
    sending: false,
    logined: false,
    isOpenLoginDialog: false,
    isOpenSnackbar: false,
    snackbarColor: "success",
    snackbarMessage: "",
    timeout: 2000,
    user: "",
    admin: RAMEN,
    drawer: true,
    nav_lists: menulist,
    constLists: constMenuLists,
  }),
  mounted: function () {
    this.isLogined();
  },
  methods: {
    async login(loginType) {
      this.isOpenLoginDialog = false;
      this.sending = true;
      anl.logEvent("logout detected");
      if (loginType === 1) {
        this.user = await login();
      } else if (loginType === 2) {
        this.user = await loginWithGoogle();
      }
      const userInfo = this.user.uid;
      localStorage.setItem("userInfo", userInfo);
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
      if (userInfo === null || typeof userInfo === "undefined") {
        this.user = "";
        this.logined = false;
      } else {
        this.user = userInfo;
        this.logined = true;
      }
      this.nav_lists = menulist.filter(
        (item) => !item.needLogin || this.logined
      );
    },
    async logout() {
      this.sending = true;
      localStorage.removeItem("userInfo");
      this.openSnackBar("ログアウトしました。", "info");
      this.isLogined();
      await logout();
      this.sending = false;
      this.$router.push("/Logout");
    },
  },
};
</script>