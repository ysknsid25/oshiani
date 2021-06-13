<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn :color="bellColor" dark icon v-bind="attrs" v-on="on" class="mr-2">
        <v-icon>fas fa-bell</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <v-icon color="secondary" dark class="mr-4">fas fa-bell</v-icon>
        お知らせ
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div v-if="loading" class="mt-4" align="center">
          <v-progress-circular
            v-if="loading"
            :size="30"
            color="secondary"
            dark
            indeterminate
          ></v-progress-circular>
        </div>
        <div v-if="!loading">
          <v-timeline align-top dense class="mt-4" v-if="isExistNotify">
            <v-timeline-item
              v-for="notify in notifies"
              :key="notify.id"
              :color="notify.color"
              small
            >
              <div>
                <div class="font-weight-normal">
                  <strong>{{ notify.infoType }}</strong> @{{ notify.postDate }}
                </div>
                <div>
                  <v-btn text :href="notify.articleUrl"
                    ><font size="2">{{ notify.title }}</font></v-btn
                  >
                </div>
              </div>
            </v-timeline-item>
          </v-timeline>
          <div align="center" class="mt-4" v-if="!isExistNotify">
            お知らせはありません。
          </div>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="secondary" :href="noteUrl" target="blank"
          >お知らせ一覧を表示</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { noteUrl } from "../constants/links.js";
import { getReleaseInfoArr } from "../firestoreaccess/ReleaseHistory";
export default {
  name: "Subscriber",
  data: () => ({
    noteUrl: noteUrl,
    isExistYetNotify: false,
    bellColor: "secondary",
    loading: false,
    dialog: false,
    isExistNotify: false,
    notifies: [],
  }),
  created: function () {
    this.getNotifies();
  },
  mounted: function () {
    if (this.isExistYetNotify) {
      this.bellColor = "red";
    }
  },
  methods: {
    async getNotifies() {
      this.loading = true;
      this.notifies = this.$store.getters.getNotifyInfo;
      if (this.notifies.length === 0) {
        this.notifies = await getReleaseInfoArr();
        this.$store.commit("setNotifyInfo", this.notifies);
      }
      this.isExistNotify = this.notifies.length > 0;
      this.loading = false;
    },
  },
};
</script>