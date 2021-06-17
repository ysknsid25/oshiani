<template>
  <div>
    <v-container v-if="logined">
      <v-row justify="space-around">
        <v-card width="400">
          <div height="300px">
            <v-card-title class="secondary white--text">
              <v-avatar size="56">
                <img alt="user" v-bind:src="userInfo.photoUrl" />
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
    <v-container v-if="!logined">
      <v-row justify="center">
        <v-col cols="12">
          <div align="center">
            <h1 class="text-h1">You need login to watch Action History</h1>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
//import NameRegistCard from "../components/NameRegistCard";
import { getUserInfo } from "../firestoreaccess/Users";
import { getActionHistoryArr } from "../firestoreaccess/ActionHistory";
export default {
  name: "Profile",
  /*
  components: {
    NameRegistCard,
  },
  */
  data: () => ({
    loading: false,
    uid: "",
    userInfo: {},
    histories: [],
    logined: false,
  }),
  created: async function () {
    this.loading = true;
    this.uid = localStorage.getItem("userInfo");
    this.logined = this.uid !== null && typeof this.uid !== "undefined";
    if (this.logined) {
      this.userInfo = await getUserInfo(this.uid);
      this.histories = await getActionHistoryArr(this.uid);
    }
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
