<template>
  <v-dialog v-model="nowPlayingDialog" max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="ml-2" icon v-bind="attrs" v-on="on">
        <v-icon>fas fa-broadcast-tower</v-icon>
      </v-btn>
    </template>
    <v-card class="mx-auto" max-width="400">
      <v-card-text>
        <div class="pt-4" align="right">超!A&G Now Playing...</div>
        <p class="pt-2 text-h5 text--primary">el·ee·mos·y·nar·y</p>
        <p>adjective</p>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="secondary" @click="reveal = true"> previous </v-btn>
        <v-spacer></v-spacer>
        <v-btn text color="secondary" @click="reveal = true"> next </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "AandGBroadCastInfo",

  data: () => ({
    nowPlayingDialog: false,
  }),
  methods: {},
};
</script>