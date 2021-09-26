<template>
  <v-card class="auth-card">
    <v-card-title class="text-no-wrap">
      <v-icon class="mr-4">fas fa-tv</v-icon>放送時期別アニメ
    </v-card-title>
    <v-card-text class="d-flex align-center mt-2 pb-2 ps-2">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="3"
            xs="12"
            v-for="animeCardInfo in animeCardInfoArr"
            :key="animeCardInfo.imageUrl"
          >
            <v-card
              hover
              @click="
                doWorkInfoList(
                  animeCardInfo.targetYear,
                  animeCardInfo.targetSeason
                )
              "
            >
              <v-img height="150px" :src="animeCardInfo.imageUrl">
                <v-card-title class="white--text mt-16">
                  <span class="mt-8">
                    {{ animeCardInfo.subtitle }}
                  </span>
                </v-card-title>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
import { getSeasonInfoArr } from "../../api/Annict";
export default {
  name: "SeasonAnimeCard",
  data: () => ({
    animeCardInfoArr: getSeasonInfoArr(),
  }),
  methods: {
    doWorkInfoList(targetYear, targetSeason) {
      this.$router.push({
        path: "/WorkInfoList/year/:year/season/:season",
        name: "WorkInfoList",
        params: {
          year: targetYear,
          season: targetSeason,
        },
      });
    },
  },
};
</script>
