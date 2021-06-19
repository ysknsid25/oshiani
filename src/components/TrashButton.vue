<template>
  <div class="text-center">
    <v-btn icon @click="confirmDeleteWatchList(workId)">
      <v-icon>fas fa-trash</v-icon>
    </v-btn>
    <v-snackbar v-model="isOpen" color="info" top :timeout="timeout">
      {{ message }}
      <v-btn color="white" text @click="doDeleteWatchList(workId, true)">
        Yes
      </v-btn>
      <v-btn color="white" text @click="doDeleteWatchList(workId, false)">
        No
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="isDeleteSuccess"
      color="success"
      top
      :timeout="timeout"
    >
      ウォッチリストから削除しました。
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: "TrashButton",
  props: ["workId"],
  data: () => ({
    timeout: 2000,
    isOpen: false,
    isDeleteSuccess: false,
    borderPosition: "left",
    elevation: 9,
    icon: "",
    alertType: "success",
    message: "削除します。よろしいですか？",
  }),

  methods: {
    confirmDeleteWatchList(id) {
      this.message = id + this.message;
      this.isOpen = true;
    },
    doDeleteWatchList(id, doDelete) {
      if (doDelete) {
        console.log(id);
        this.isOpen = false;
        this.isDeleteSuccess = true;
      } else {
        this.isOpen = false;
      }
    },
  },
};
</script>