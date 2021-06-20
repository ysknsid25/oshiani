<template>
  <div class="text-center">
    <v-btn icon @click="confirmDeleteWatchList(workInfo.title)">
      <v-icon>fas fa-trash</v-icon>
    </v-btn>
    <v-snackbar v-model="isOpen" color="info" top :timeout="timeout">
      {{ confirmMessage }}
      <v-btn color="white" text @click="doDeleteWatchList(true)"> Yes </v-btn>
      <v-btn color="white" text @click="doDeleteWatchList(false)"> No </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import { deleteWatchList } from "../firestoreaccess/WatchList";
import { updateWorkInfo } from "../firestoreaccess/WorkInfo";
export default {
  name: "TrashButton",
  props: ["workInfo", "workInfos"],
  data: () => ({
    timeout: 2000,
    isOpen: false,
    isDeleteSuccess: false,
    borderPosition: "left",
    elevation: 9,
    icon: "",
    alertType: "success",
    confirmMessage: "",
    message: "",
  }),

  methods: {
    confirmDeleteWatchList(title) {
      this.confirmMessage = title + "を削除します。よろしいですか？";
      this.isOpen = true;
    },
    async doDeleteWatchList(doDelete) {
      if (doDelete) {
        const uid = localStorage.getItem("userInfo");
        const newWorkInfos = this.workInfos.filter(
          (info) => info.id != this.workInfo.id
        );
        const result = await deleteWatchList(
          uid,
          newWorkInfos,
          this.workInfo.title
        );
        if (result) {
          updateWorkInfo(this.workInfo, -1, 0, 0);
          this.$emit("updated-watchlist", newWorkInfos);
        }
      } else {
        this.isOpen = false;
      }
    },
  },
};
</script>