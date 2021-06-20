<template>
  <v-card hover tile>
    <v-img
      :src="getImageUrl(workInfo.images.recommended_url)"
      :max-height="$vuetify.breakpoint.xs ? '300px' : '140px'"
    >
    </v-img>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-card-title
          v-bind="attrs"
          v-on="on"
          class="subtitle-1"
          v-text="trimTitle(workInfo.title)"
        ></v-card-title>
      </template>
      <span>{{ workInfo.title }}</span>
    </v-tooltip>
    <v-card-subtitle v-text="workInfo.season_name"></v-card-subtitle>
    <v-card-text>
      <v-row align="center" class="mx-0">
        <MediaChip
          :media="workInfo.media"
          :mediaText="workInfo.media_text"
        ></MediaChip>
        <v-spacer></v-spacer>
        <DispRating :avgStar="reviewInfo.ratingavg"></DispRating>
      </v-row>
    </v-card-text>
    <v-divider class="mx-4 mb-2"></v-divider>
    <v-card-actions>
      <BookmarkButton
        v-if="isLogined"
        :isLogined="isLogined"
        :workInfo="workInfo"
        :reviewInfo="reviewInfo"
      ></BookmarkButton>
      <v-spacer></v-spacer>
      <OfficialTwitterButton
        :twitterUserName="workInfo.twitter_username"
      ></OfficialTwitterButton>
      <ShareButton
        :title="workInfo.title"
        :hashTag="workInfo.twitter_hashtag"
        :officialSite="workInfo.official_site_url"
      ></ShareButton>
      <WorkDetailDialog
        :workInfo="workInfo"
        :reviewInfo="reviewInfo"
        :isLogined="isLogined"
      >
      </WorkDetailDialog>
    </v-card-actions>
  </v-card>
</template>
<script>
import WorkDetailDialog from "./WorkDetailDialog";
import MediaChip from "./MediaChip";
import ShareButton from "./ShareButton";
import OfficialTwitterButton from "./OfficialTwitterButton";
import BookmarkButton from "./BookmarkButton";
import DispRating from "./DispRating";
import { getImage, getTitle } from "../api/Annict";
export default {
  name: "WorkInfoCard",
  components: {
    WorkDetailDialog,
    MediaChip,
    ShareButton,
    OfficialTwitterButton,
    BookmarkButton,
    DispRating,
  },
  props: ["workInfo", "isLogined", "reviewInfo"],

  data: () => ({}),

  methods: {
    trimTitle(title) {
      return getTitle(title);
    },
    getImageUrl(url) {
      return getImage(url);
    },
  },
};
</script>