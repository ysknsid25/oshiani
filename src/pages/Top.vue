<template>
  <v-app class="secondary">
    <v-navigation-drawer app v-model="drawer" class="secondary">
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
            <div class="mt-2" align="center">
              <span class="kagerou thirdColor--text"> 推しアニ！ </span>
            </div>
          </v-list-item-title>
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
                <v-icon x-small class="mx-1 thirdColor--text"
                  >far fa-copyright</v-icon
                >
                <span class="thirdColor--text">
                  {{ new Date().getFullYear() }} —
                </span>
                <span class="kagerou ml-1 thirdColor--text"
                  >ラーメン 食太郎</span
                >
              </v-btn>
            </template>
            <span>開発者のTwitterへ</span>
          </v-tooltip>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      color="white"
      app
      v-if="!loading"
      class="secondary"
      height="70px"
    >
      <v-app-bar-nav-icon
        class="primary--text"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title></v-toolbar-title>
      <v-spacer></v-spacer>
      <app-var-user-menu></app-var-user-menu>
    </v-app-bar>
    <v-main class="pt-0 secondary">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<script>
import { menulist, constMenuLists } from "../constants/menulist";
import AppVarUserMenu from "../components/user-avator-menu/AppVarUserMenu.vue";
import "../assets/scss/style.scss";
import { auth } from "../plugins/firebase";
//import { getUserInfo } from "../firestoreaccess/Users";
import { colorTheme } from "../plugins/vuetify";
export default {
  name: "Top",
  components: {
    AppVarUserMenu,
  },
  data: () => ({
    loading: false,
    drawer: true,
    nav_lists: menulist,
    constLists: constMenuLists,
  }),
  mounted: function () {
    auth.onAuthStateChanged((user) => {
      const currentUser = user;
      //console.log(currentUser);
      if (currentUser) {
        this.changeColor(colorTheme.base);
      } else {
        this.changeColor(colorTheme.dark);
      }
    });
  },
  methods: {
    changeColor(colorThemeObj) {
      this.$vuetify.theme.themes.light.secondary = colorThemeObj.secondary;
      this.$vuetify.theme.themes.light.likelyRed = colorThemeObj.likelyRed;
    },
  },
};
</script>