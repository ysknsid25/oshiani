<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <season-anime-card></season-anime-card>
      </v-col>
      <v-col cols="12" md="4" xs="12">
        <AandGBroadCastInfo></AandGBroadCastInfo>
      </v-col>
      <v-col cols="12" md="8" xs="12">
        <AdminBlogCard></AdminBlogCard>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AandGBroadCastInfo from "../components/oshiAni-top/AandGBroadCastInfo.vue";
import AdminBlogCard from "../components/oshiAni-top/AdminBlogCard.vue";
import SeasonAnimeCard from "../components/oshiAni-top/SeasonAnimeCard.vue";

export default {
  name: "OshiAniTop",
  components: {
    AandGBroadCastInfo,
    SeasonAnimeCard,
    AdminBlogCard,
  },

  methods: {},
};
</script>