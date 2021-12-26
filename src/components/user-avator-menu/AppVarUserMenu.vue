<template>
  <div>
    <div v-if="sending">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-if="!sending">
      <v-menu
        offset-y
        left
        nudge-bottom="14"
        min-width="230"
        content-class="user-profile-menu-content"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-avatar
            v-if="!logined"
            color="thirdColor"
            size="40px"
            v-bind="attrs"
            v-on="on"
          >
            <v-img :src="require('@/assets/upper_body-2.png')"></v-img>
          </v-avatar>
          <v-avatar
            v-if="logined && photoUrl !== ''"
            size="40px"
            v-bind="attrs"
            v-on="on"
          >
            <v-img :src="photoUrl"></v-img>
          </v-avatar>
          <v-avatar
            v-if="logined && photoUrl === ''"
            color="brown"
            size="40px"
            v-bind="attrs"
            v-on="on"
          >
            <span class="white--text text-h5">{{
              displayName.substring(0, 1)
            }}</span>
          </v-avatar>
        </template>
        <v-list v-if="logined" class="secondary">
          <div class="pb-3 pt-2">
            <v-avatar
              v-if="!logined"
              color="thirdColor"
              size="40px"
              class="ml-2"
            >
              <v-img :src="require('@/assets/upper_body-2.png')"></v-img>
            </v-avatar>
            <v-avatar
              v-if="logined && photoUrl !== ''"
              size="40px"
              class="ml-2"
            >
              <v-img :src="photoUrl"></v-img>
            </v-avatar>
            <v-avatar
              v-if="logined && photoUrl === ''"
              color="brown"
              size="40px"
              class="ml-2"
            >
              <span class="white--text text-h5">{{
                displayName.substring(0, 1)
              }}</span>
            </v-avatar>
            <div
              class="d-inline-flex flex-column justify-center ms-3"
              style="vertical-align: middle"
            >
              <span class="text--primary font-weight-semibold mb-n1">
                {{ displayName }}
              </span>
            </div>
          </div>

          <v-divider></v-divider>

          <!-- Profile -->
          <v-list-item
            link
            class="secondary"
            v-for="constantMenuInfo in constantMenuInfoArr"
            :key="constantMenuInfo.icon"
            :to="constantMenuInfo.url"
          >
            <v-list-item-icon class="me-2" :color="constantMenuInfo.color">
              <v-icon size="22"> {{ constantMenuInfo.icon }} </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{
                constantMenuInfo.title
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- Only Admin -->
          <v-list-item link to="/PostArticle" v-if="user === admin">
            <v-list-item-icon class="me-2">
              <v-icon size="22">fas fa-pen-nib</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>ブログ投稿</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- Logout -->
          <v-list-item link @click="logout()">
            <v-list-item-icon class="me-2">
              <v-icon size="22"> fas fa-sign-out-alt </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Sign out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list v-if="!logined" class="secondary">
          <v-list-item
            link
            v-for="signInIconInfo in signInIconInfoArr"
            :key="signInIconInfo.icon"
            @click="login(signInIconInfo.methodNo)"
          >
            <v-list-item-icon class="me-2">
              <v-icon size="22" :color="signInIconInfo.color">
                {{ signInIconInfo.icon }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ signInIconInfo.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import {
  login,
  loginWithGoogle,
  logout,
  anl,
  RAMEN,
} from "../../plugins/firebase";
import { authorizeUser } from "../../firestoreaccess/Users";
import { mdiTwitter, mdiGoogle } from "@mdi/js";
export default {
  data: () => ({
    sending: false,
    logined: false,
    isOpenLoginDialog: false,
    snackbarColor: "success",
    snackbarMessage: "",
    timeout: 2000,
    user: "",
    photoUrl: "",
    displayName: "",
    admin: RAMEN,
    signInIconInfoArr: [
      {
        icon: mdiTwitter,
        color: "#1da1f2",
        title: "Sign in By Twitter",
        methodNo: 1,
      },
      {
        icon: mdiGoogle,
        color: "#db4437",
        title: "Sign in By Google",
        methodNo: 2,
      },
    ],
    constantMenuInfoArr: [
      {
        icon: "fas fa-users-cog",
        color: "#191970",
        url: "/Profile",
        title: "プロフィール",
      },
      {
        icon: "far fa-eye",
        color: "#191970",
        url: "/WatchList",
        title: "ウォッチリスト",
      },
    ],
  }),
  mounted: function () {
    this.isLogined();
  },
  methods: {
    async login(loginType) {
      this.isOpenLoginDialog = false;
      this.sending = true;
      anl.logEvent("login detected");
      if (loginType === 1) {
        this.user = await login();
      } else if (loginType === 2) {
        this.user = await loginWithGoogle();
      }
      //userInfoは元々uidを指していたけれど、ユーザー表示名と画像URLも使うことになってしまった
      //userInfoはローカルストレージに保存していて、他でも使われてしまっているので、
      //オブジェクト方式で格納してしまうと、影響がかなりでてしまう。
      //なので個別に格納する方式にしている
      const userInfo = this.user.uid;
      const photoUrl = this.user.photoUrl;
      const displayName = this.user.displayName;
      localStorage.setItem("userInfo", userInfo);
      localStorage.setItem("photoUrl", photoUrl);
      localStorage.setItem("displayName", displayName);
      if (this.user.isLoginSuccess) {
        await authorizeUser(this.user);
        this.isLogined();
      } else {
        this.sending = false;
      }
      this.sending = false;
    },
    isLogined() {
      const userInfo = localStorage.getItem("userInfo");
      const photoUrl = localStorage.getItem("photoUrl");
      const displayName = localStorage.getItem("displayName");
      if (
        userInfo === null ||
        typeof userInfo === "undefined" ||
        userInfo === ""
      ) {
        this.user = "";
        this.photoUrl = "";
        this.displayName = "";
        this.logined = false;
      } else {
        this.user = userInfo;
        this.photoUrl = photoUrl;
        this.displayName = displayName;
        this.logined = true;
      }
    },
    async logout() {
      await logout();
      localStorage.setItem("userInfo", "");
      localStorage.setItem("photoUrl", "");
      localStorage.setItem("displayName", "");
      this.user = "";
      this.photoUrl = "";
      this.displayName = "";
      this.logined = false;
      this.$router.push("/Logout");
    },
  },
};
</script>

<style lang="scss">
.user-profile-menu-content {
  .v-list-item {
    min-height: 2.5rem !important;
  }
}
</style>
