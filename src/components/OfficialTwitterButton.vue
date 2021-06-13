<template>
  <v-btn
    icon
    v-if="twitterUserName !== ''"
    :href="getTwitterAccountUrl(twitterUserName)"
  >
    <v-icon color="#1DA1F2">fab fa-twitter</v-icon>
  </v-btn>
</template>
<script>
import { getTwitterUrl } from "../api/Annict";
export default {
  name: "OfficialTwitterButton",
  props: ["twitterUserName"],

  methods: {
    getTwitterAccountUrl(url) {
      const retUrl = getTwitterUrl(url);
      //console.log(retUrl);
      return retUrl;
    },
  },
};
</script>