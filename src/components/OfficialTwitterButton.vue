<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        v-on="on"
        v-if="twitterUserName !== ''"
        :href="getTwitterAccountUrl(twitterUserName)"
      >
        <v-icon color="#1DA1F2">fab fa-twitter</v-icon>
      </v-btn>
    </template>
    <span>公式twitter</span>
  </v-tooltip>
</template>
<script>
import { getTwitterUrl } from "../api/Annict";
export default {
  name: "OfficialTwitterButton",
  props: ["twitterUserName"],

  methods: {
    getTwitterAccountUrl(url) {
      const retUrl = getTwitterUrl(url);
      return retUrl;
    },
  },
};
</script>