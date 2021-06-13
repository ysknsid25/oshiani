<template>
  <div>
    <v-navigation-drawer app temporary v-model="drawer" clipped>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> What to do? </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item v-for="nav_list in nav_lists" :key="nav_list.name">
          <v-list-item-content>
            <v-list-item-title>
              <v-btn text color="#263238" :href="nav_list.url">
                <v-icon :color="nav_list.iconColor" class="mr-4">{{
                  nav_list.icon
                }}</v-icon>
                {{ nav_list.name }}
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="white" app clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Ma<font color="#B71C1C">hja</font>nager</v-toolbar-title>
      <v-spacer></v-spacer>
      <Subscriber v-if="isAdmin"></Subscriber>
      <Notify></Notify>
    </v-app-bar>
  </div>
</template>
<script>
import { menulist } from "../../constants/menulist";
import Subscriber from "../Subscriber";
import Notify from "../Notify";
import { auth, RAMEN } from "../../plugins/firebase";

export default {
  name: "NavigationDrawer",

  components: {
    Subscriber,
    Notify,
  },

  data: () => ({
    drawer: false,
    nav_lists: menulist,
    isAdmin: false,
  }),

  created: async function () {
    let isAdmin = false;
    await auth.onAuthStateChanged(function (user) {
      if (user) {
        isAdmin = user.uid == RAMEN;
      } else {
        isAdmin = false;
      }
    });
    this.isAdmin = isAdmin;
  },
};
</script>