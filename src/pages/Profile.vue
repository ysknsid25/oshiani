<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="400">
        <div height="300px">
          <v-card-title class="secondary white--text">
            <v-avatar size="56">
              <img alt="user" v-bind:src="userInfo.photoURL" />
            </v-avatar>
            <p class="ml-3 mt-3">{{ userInfo.displayName }}</p>
            <v-spacer></v-spacer>
            <!--
            <NameRegistCard :initUserName="userInfo.name"></NameRegistCard>
            -->
          </v-card-title>
        </div>

        <v-card-text>
          <div align="center" v-if="loading">
            <v-progress-circular
              v-if="loading"
              :size="50"
              color="secondary"
              dark
              indeterminate
            ></v-progress-circular>
          </div>
          <div v-if="!loading">
            <div v-if="histories.length">
              <div class="font-weight-bold ml-8 mb-2">History</div>
              <v-timeline align-top dense>
                <v-timeline-item
                  v-for="history in histories"
                  :key="history.id"
                  :color="history.color"
                  small
                >
                  <div>
                    <div class="font-weight-normal">
                      <strong>{{ history.title }}</strong> @{{ history.time }}
                    </div>
                    <div>{{ history.message }}</div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </div>
            <div align="center" class="mt-4" v-if="!histories.length">
              履歴はありません。
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
//import NameRegistCard from "../components/NameRegistCard";
import { getActionHistoryArr } from "../firestoreaccess/ActionHistory";
import { getAuthUserInfo } from "../plugins/firebase";
export default {
  name: "Profile",
  /*
  components: {
    NameRegistCard,
  },
  */
  data: () => ({
    loading: false,
    userInfo: {},
    histories: [],
  }),
  created: async function () {
    this.loading = true;
    this.userInfo = await getAuthUserInfo();
    this.histories = await getActionHistoryArr(this.userInfo.uid);
    this.loading = false;
  },
  /*
  methods: {
    //@@ リアルタイムリスナー。引数をユーザーIDに直す
    async getUserActionHistory(uid) {
      this.loading = true;
      this.histories = await getActionHistoryArr(uid);
      this.loading = false;
    },
  },
  */
};
</script>
