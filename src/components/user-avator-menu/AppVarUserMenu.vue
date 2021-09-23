<template>
  <v-menu
    offset-y
    left
    nudge-bottom="14"
    min-width="230"
    content-class="user-profile-menu-content"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-avatar v-if="!isLogined" size="40px" v-bind="attrs" v-on="on">
        <v-img :src="require('@/assets/upper_body-2.png')"></v-img>
      </v-avatar>
      <v-avatar
        v-if="isLogined && userInfo.photoUrl !== ''"
        size="40px"
        v-bind="attrs"
        v-on="on"
      >
        <v-img :src="userInfo.photoUrl"></v-img>
      </v-avatar>
      <v-avatar
        v-if="isLogined && userInfo.photoUrl === ''"
        color="brown"
        size="40px"
        v-bind="attrs"
        v-on="on"
      >
        <span class="white--text text-h5">{{
          userInfo.displayName.substring(0, 1)
        }}</span>
      </v-avatar>
    </template>
    <v-list v-if="isLogined">
      <div class="pb-3 pt-2">
        <div
          class="d-inline-flex flex-column justify-center ms-3"
          style="vertical-align: middle"
        >
          <span class="text--primary font-weight-semibold mb-n1">
            {{ userInfo.displayName }}
          </span>
        </div>
      </div>

      <v-divider></v-divider>

      <!-- Profile -->
      <v-list-item link>
        <v-list-item-icon class="me-2">
          <v-icon size="22"> fas fa-users-cog </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Profile</v-list-item-title>
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
    <v-list v-if="!isLogined">
      <v-list-item link>
        <v-list-item-icon class="me-2">
          <v-icon size="22"> fas fa-sign-in-alt </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Sign in</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link>
        <v-list-item-icon class="me-2">
          <v-icon size="22"> fas fa-user-plus </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Sign up</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { logout } from "../../plugins/firebase";
export default {
  props: ["isLogined", "userInfo"],
  methods: {
    async logout() {
      localStorage.removeItem("userInfo");
      this.openSnackBar("ログアウトしました。", "info");
      this.isLogined();
      await logout();
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
