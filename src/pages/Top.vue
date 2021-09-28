<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" class="grey lighten-5">
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
              <span class="kagerou"> 推しアニ！ </span>
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
                <v-icon x-small class="mx-1">far fa-copyright</v-icon>
                {{ new Date().getFullYear() }} —
                <span class="kagerou ml-1">ラーメン 食太郎</span>
              </v-btn>
            </template>
            <span>開発者のTwitterへ</span>
          </v-tooltip>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar color="white" app v-if="!loading" class="grey lighten-5">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title></v-toolbar-title>
      <v-spacer></v-spacer>
      <app-var-user-menu></app-var-user-menu>
    </v-app-bar>
    <v-main class="pt-0 grey lighten-5">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<script>
import { menulist, constMenuLists } from "../constants/menulist";
import AppVarUserMenu from "../components/user-avator-menu/AppVarUserMenu.vue";
import "../assets/scss/style.scss";
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
};
</script>