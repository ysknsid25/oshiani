<template>
  <div class="text-center">
    <v-btn icon v-if="isLogined" color="yellow" @click="addWatchList(workId)">
      <v-badge color="green" class="ma-0" content="6">
        <v-icon> fas fa-bookmark </v-icon>
      </v-badge>
    </v-btn>
    <v-snackbar v-model="isOpen" color="success" top :timeout="timeout">
      {{ message }}
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: "BookmarkButton",
  props: ["workId", "isLogined"],
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
    addWatchList(id) {
      console.log(id);
      this.message = id + this.message;
      this.isOpen = true;
    },
  },
};
</script>