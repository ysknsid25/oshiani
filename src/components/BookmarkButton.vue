<template>
  <div class="text-center">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-if="isLogined"
          v-bind="attrs"
          v-on="on"
          color="yellow"
          @click="addWatchList()"
        >
          <v-badge color="green" class="ma-0" content="6">
            <v-icon> fas fa-bookmark </v-icon>
          </v-badge>
        </v-btn>
      </template>
      <span>ウォッチリストに追加する</span>
    </v-tooltip>
    <v-snackbar v-model="isOpen" :color="alertType" top :timeout="timeout">
      {{ message }}
    </v-snackbar>
  </div>
</template>
<script>
import { updateWorkInfo } from "../firestoreaccess/WorkInfo";
import { addWatchList } from "../firestoreaccess/WatchList";
export default {
  name: "BookmarkButton",
  props: ["workInfo", "isLogined"],
  data: () => ({
    timeout: 2000,
    isOpen: false,
    borderPosition: "left",
    elevation: 9,
    icon: "",
    alertType: "success",
    message: "ウォッチリストに追加しました。",
  }),

  methods: {
    async addWatchList() {
      const uid = localStorage.getItem("userInfo");
      const resultMessage = await addWatchList(uid, this.workInfo);
      if (resultMessage !== "") {
        this.alertType = "error";
        this.message = resultMessage;
      } else {
        updateWorkInfo(this.workInfo, 1, 0, 0);
        this.alertType = "success";
        this.message = "ウォッチリストに追加しました。";
      }
      this.isOpen = true;
    },
  },
};
</script>