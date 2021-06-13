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
    <v-app-bar color="white" outlined flat app v-if="!loading">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>title</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon color="green darken-4" dark :href="noteUrl">
        <v-icon>fas fa-sticky-note</v-icon></v-btn
      >
    </v-app-bar>
    <v-main>
      <v-container v-if="!loading">
        <v-row justify="center">
          <v-col cols="12"></v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12">
            <div align="center">
              <v-img
                src="../../public/images/icons/icon-256x256.png"
                max-height="256"
                max-width="256"
              ></v-img>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="mt-12" v-if="loading">
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
    </v-main>
  </v-app>
</template>
<script>
import { noteUrl } from "../constants/links";
import { login } from "../plugins/firebase";
import { authorizeUser } from "../firestoreaccess/Users";
import { season, getWorkInfoUrl } from "../api/Annict";
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
  }),
  mounted: async function () {
    const targetUrl = getWorkInfoUrl("2021", season.spring);
    await this.axios
      .get(targetUrl)
      .then((response) => {
        console.log("@@1");
        console.log(response.data.works);
      })
      .catch((error) => {
        console.log("@@2");
        console.log(error);
      });
  },
  methods: {
    async login() {
      this.loading = true;
      this.user = await login();
      if (this.user.isLoginSuccess) {
        await authorizeUser(this.user);
        this.$router.push("/Main");
      } else {
        this.loading = true;
        alert("ログイン処理に失敗しました。");
        this.loading = false;
        this.$router.push("/");
      }
    },
  },
};
</script>