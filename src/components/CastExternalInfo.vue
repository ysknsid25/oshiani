<template>
  <v-menu>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        v-on="on"
        v-if="isExistpages(officialSiteUrl, wikipediaUrl, twitterUrl)"
      >
        <v-icon>fas fa-ellipsis-h</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-if="officialSiteUrl !== ''">
        <v-list-item-title>
          <v-btn text :href="officialSiteUrl"> official page </v-btn>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="wikipediaUrl !== ''">
        <v-list-item-title>
          <v-btn text :href="wikipediaUrl"> wikipedia </v-btn>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="twitterUrl !== ''">
        <v-list-item-title>
          <v-btn text :href="getTwitterAccountUrl(twitterUrl)"> twitter </v-btn>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
import { getTwitterUrl } from "../api/Annict";
export default {
  name: "CastExternalInfo",
  props: ["officialSiteUrl", "wikipediaUrl", "twitterUrl"],
  methods: {
    isExistpages(official, wiki, twitterUrl) {
      return official !== "" || wiki !== "" || twitterUrl !== "";
    },
    getTwitterAccountUrl(url) {
      const retUrl = getTwitterUrl(url);
      return retUrl;
    },
  },
};
</script>