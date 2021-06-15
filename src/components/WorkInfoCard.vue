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
        <MediaChip
          :media="workInfo.media"
          :mediaText="workInfo.media_text"
        ></MediaChip>
        <v-spacer></v-spacer>
        <DispRating :reviewInfo="reviewInfo"></DispRating>
      </v-row>
    </v-card-text>
    <v-divider class="mx-4 mb-2"></v-divider>
    <v-card-actions>
      <BookmarkButton
        :isLogined="isLogined"
        :workId="workInfo.id"
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
      <WorkDetailDialog :workInfo="workInfo"> </WorkDetailDialog>
    </v-card-actions>
  </v-card>
</template>
<script>
import ExternalLinkMenu from "./ExternalLinkMenu";
import WorkDetailDialog from "./WorkDetailDialog";
import MediaChip from "./MediaChip";
import ShareButton from "./ShareButton";
import OfficialTwitterButton from "./OfficialTwitterButton";
import BookmarkButton from "./BookmarkButton";
import DispRating from "./DispRating";
export default {
  name: "WorkInfoCard",
  components: {
    ExternalLinkMenu,
    WorkDetailDialog,
    MediaChip,
    ShareButton,
    OfficialTwitterButton,
    BookmarkButton,
    DispRating,
  },
  props: ["workInfo", "isLogined"],

  data: () => ({
    reviewInfo: {
      avgStar: 4.5,
      starColor: "amber",
      starSize: 14,
    },
  }),

  methods: {
    getImageUrl(url) {
      if (url !== "") {
        return url;
      }
      return "https://placehold.jp/600x300.png";
    },
    dispWorkDetail(workInfo) {
      alert(workInfo.id + "の作品情報を表示します。");
    },
  },
};
</script>