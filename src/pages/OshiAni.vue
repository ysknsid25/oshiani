<template>
  <div>
    <v-container v-if="!loading">
      <v-row dense class="mb-2">
        <v-col xs="12" md="12">
          <v-toolbar>
            <v-switch
              v-model="isNextSeason"
              :label="isNextSeason ? '来期' : '今期'"
              color="primary"
              hide-details
              class="mr-2"
              @change="getAnimeInfo()"
            ></v-switch>
            <v-switch
              v-model="isBookMark"
              :label="isBookMark ? 'ブックマーク数' : 'レビュー'"
              color="red darken-3"
              hide-details
              class="mr-2"
              @change="getAnimeInfo()"
            ></v-switch>
          </v-toolbar>
        </v-col>
      </v-row>
      <v-row dense v-if="workInfos.length > 0">
        <v-col
          v-for="(workInfo, index) in workInfos"
          :key="workInfo.id"
          xs="12"
          sm="4"
          md="3"
        >
          <v-badge
            :color="index + 1 > 3 ? 'green' : 'red'"
            class="ma-0"
            :content="index + 1"
          ></v-badge>
          <WorkInfoCard
            :key="logined"
            :workInfo="workInfo"
            :isLogined="logined"
            :reviewInfo="workInfo"
          ></WorkInfoCard>
        </v-col>
      </v-row>
      <v-row dense v-if="workInfos.length === 0">
        <v-col>
          <div align="center">No Data</div>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="loading">
      <v-row justify="center">
        <v-col cols="12">
          <div align="center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import WorkInfoCard from "../components/WorkInfoCard";
import { getPopularWorks } from "../firestoreaccess/WorkInfo";
export default {
  name: "WorkInfoList",
  components: {
    WorkInfoCard,
  },
  data: () => ({
    loading: false,
    logined: false,
    isNextSeason: false,
    isBookMark: false,
    user: "",
    workInfos: [],
  }),
  mounted: async function () {
    await this.getAnimeInfo();
    this.isLogined();
  },
  methods: {
    isLogined() {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo === null) {
        this.user = "";
        this.logined = false;
      } else {
        this.user = userInfo;
        this.logined = true;
      }
    },
    async getAnimeInfo() {
      this.loading = true;
      this.workInfos = await getPopularWorks(
        this.isNextSeason,
        this.isBookMark
      );
      this.loading = false;
    },
  },
};
</script>