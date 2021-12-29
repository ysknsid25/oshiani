<template>
  <v-container>
    <v-card id="account-setting-card">
      <!-- tabs -->
      <v-tabs v-model="tab" show-arrows>
        <v-tab v-for="tab in tabs" :key="tab.icon">
          <v-icon size="20" class="me-3">
            {{ tab.icon }}
          </v-icon>
          <span>{{ tab.title }}</span>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <account-info :userInfo="userInfo"></account-info>
        </v-tab-item>
        <v-tab-item>
          <action-history
            :loading="loading"
            :histories="histories"
          ></action-history>
        </v-tab-item>
        <v-tab-item> </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import ActionHistory from "../components/profile/ActionHistory";
import AccountInfo from "../components/profile/AccountInfo.vue";
import { getUserInfo } from "../firestoreaccess/Users";
import { getActionHistoryArr } from "../firestoreaccess/ActionHistory";
export default {
  name: "Profile",
  components: {
    ActionHistory,
    AccountInfo,
  },
  data: () => ({
    loading: false,
    uid: "",
    userInfo: {},
    histories: [],
    tab: "",
    tabs: [
      { title: "Account", icon: "fas fa-user-circle" },
      { title: "History", icon: "fas fa-clock" },
      { title: "Notify", icon: "fas fa-bell" },
    ],
  }),
  created: async function () {
    this.loading = true;
    this.uid = localStorage.getItem("userInfo");
    this.userInfo = await getUserInfo(this.uid);
    this.histories = await getActionHistoryArr(this.uid);
    this.loading = false;
  },
};
</script>
