<template>
  <v-dialog v-model="detailDialog" max-width="800">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>fas fa-ellipsis-v</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-app-bar flat color="rgba(0, 0, 0, 0)">
        <ShareButton
          :title="workInfo.title"
          :hashTag="workInfo.twitter_hashtag"
          :officialSite="workInfo.official_site_url"
        ></ShareButton>
        <OfficialTwitterButton
          :twitterUserName="workInfo.twitter_username"
        ></OfficialTwitterButton>
        <v-spacer></v-spacer>
        <ExternalLinkMenu
          :officialSiteUrl="workInfo.official_site_url"
          :wikipediaUrl="workInfo.wikipedia_url"
        ></ExternalLinkMenu>
      </v-app-bar>
      <v-img
        :src="getImageUrl(workInfo.images.recommended_url)"
        max-height="300px"
      >
      </v-img>
      <v-card-title>
        {{ workInfo.title }}
      </v-card-title>
      <v-card-text>
        <v-row align="center" class="mx-0">
          <MediaChip
            :media="workInfo.media"
            :mediaText="workInfo.media_text"
          ></MediaChip>
          <v-spacer></v-spacer>
          <DispRating :reviewInfo="reviewInfo"></DispRating>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import ExternalLinkMenu from "./ExternalLinkMenu";
import MediaChip from "./MediaChip";
//import { getImage } from "../api/Annict";
import ShareButton from "./ShareButton";
import OfficialTwitterButton from "./OfficialTwitterButton";
export default {
  name: "WorkDetailDialog",
  components: {
    ExternalLinkMenu,
    MediaChip,
    ShareButton,
    OfficialTwitterButton,
  },
  props: ["workInfo"],

  data: () => ({
    detailDialog: false,
  }),

  methods: {
    getImageUrl(url) {
      if (url !== "") {
        return url;
      }
      return "https://placehold.jp/600x300.png";
    },
  },
};
</script>