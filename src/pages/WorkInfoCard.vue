<template>
  <v-card>
    <v-img
      :src="getImageUrl(workInfo.images.recommended_url)"
      max-height="300px"
    >
      <v-app-bar flat color="rgba(0, 0, 0, 0)">
        <v-spacer></v-spacer>
        <ExternalLinkMenu
          :officialSiteUrl="workInfo.official_site_url"
          :wikipediaUrl="workInfo.wikipedia_url"
        ></ExternalLinkMenu>
      </v-app-bar>
    </v-img>
    <v-card-title>
      {{ workInfo.title }}
    </v-card-title>
    <v-card-text>
      <v-row align="center" class="mx-0">
        <v-chip
          v-if="workInfo.media !== ''"
          :color="getMediaTypeColor(workInfo.media)"
          v-text="workInfo.media_text === '' ? 'Othre' : workInfo.media_text"
        >
        </v-chip>
        <v-spacer></v-spacer>
        <v-rating
          :value="4.5"
          color="amber"
          dense
          half-increments
          readonly
          size="14"
        ></v-rating>
        <div class="grey--text ms-4">4.5 (413)</div>
      </v-row>
    </v-card-text>
    <v-divider class="mx-4 mb-2"></v-divider>
    <v-card-actions>
      <v-btn
        icon
        v-if="logined"
        color="yellow"
        @click="addWatchList(workInfo.id)"
      >
        <v-badge color="green" class="ma-0" content="6">
          <v-icon> fas fa-bookmark </v-icon>
        </v-badge>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        icon
        v-if="workInfo.twitter_username !== ''"
        :href="getTwitterAccountUrl(workInfo.twitter_username)"
      >
        <v-icon color="#1DA1F2">fab fa-twitter</v-icon>
      </v-btn>
      <v-btn
        icon
        color="primary"
        :href="
          getTweetUrl(
            workInfo.title,
            workInfo.twitter_hashtag,
            workInfo.official_site_url
          )
        "
      >
        <v-icon>fas fa-share-alt</v-icon>
      </v-btn>
      <v-btn icon @click="dispWorkDetail(workInfo)">
        <v-icon>fas fa-ellipsis-v</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { getTweetUrl } from "../constants/links";
import { getTwitterUrl, mediaType } from "../api/Annict";
import ExternalLinkMenu from "./ExternalLinkMenu.vue";
export default {
  name: "WorkInfoCard",
  components: {
    ExternalLinkMenu,
  },
  props: ["workInfo", "logined"],

  data: () => ({}),

  methods: {
    getImageUrl(url) {
      if (url !== "") {
        return url;
      }
      return "https://placehold.jp/600x300.png";
    },
    getTwitterAccountUrl(url) {
      const retUrl = getTwitterUrl(url);
      //console.log(retUrl);
      return retUrl;
    },
    getTweetUrl(title, hashTag, officialSite) {
      return getTweetUrl(title, hashTag, officialSite);
    },
    getMediaTypeColor(media) {
      if (media === "") {
        return media;
      }
      return mediaType[media];
    },
    dispWorkDetail(workInfo) {
      alert(workInfo.id + "の作品情報を表示します。");
    },
    addWatchList(id) {
      alert(id + "ウォッチリストに追加しました。");
    },
  },
};
</script>