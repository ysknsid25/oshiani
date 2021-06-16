<template>
  <div>
    <v-container v-if="!loading">
      <v-row dense class="mb-2">
        <v-col xs="12" md="12">
          <v-toolbar>
            <v-switch
              v-model="isWorkName"
              color="secondary"
              hide-details
              class="mr-2"
            ></v-switch>
            <v-select
              v-if="!isWorkName"
              :items="yearList"
              v-model="targetYear"
              label="Year"
              dense
              class="mr-4 mt-5"
            ></v-select>
            <v-select
              v-if="!isWorkName"
              :items="seasons"
              v-model="targetSeason"
              label="Season"
              dense
              class="mr-4 mt-5"
            ></v-select>
            <v-text-field
              v-if="isWorkName"
              dense
              class="mr-4 mt-5"
              label="Work name"
              v-model="workName"
            ></v-text-field>
            <v-btn icon @click="getAnimeInfo(1)">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-toolbar>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col v-for="workInfo in workInfos" :key="workInfo.id" xs="12" md="6">
          <WorkInfoCard
            :key="logined"
            :workInfo="workInfo"
            :isLogined="logined"
          ></WorkInfoCard>
        </v-col>
      </v-row>
      <v-row dense class="mb-2">
        <v-col xs="12" md="12">
          <div class="text-center">
            <v-pagination
              v-model="nowPage"
              :length="totalPage"
              @input="getNumber"
            ></v-pagination>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="loading">
      <v-row justify="center">
        <v-col cols="12">
          <div align="center">
            <v-progress-circular
              indeterminate
              color="indigo"
            ></v-progress-circular>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import WorkInfoCard from "../components/WorkInfoCard";
import {
  getNowYear,
  getNowSeason,
  getWorkInfoUrl,
  getCount,
  getSelectYear,
  season,
} from "../api/Annict";
export default {
  name: "WorkInfoList",
  components: {
    WorkInfoCard,
  },
  data: () => ({
    loading: false,
    logined: false,
    isOpenSnackbar: false,
    snackbarColor: "success",
    snackbarMessage: "",
    timeout: 2000,
    user: "",
    workInfos: [],
    totalPage: 0,
    nowPage: 1,
    yearList: [],
    seasons: [],
    targetYear: "",
    targetSeason: "",
    isWorkName: false,
    workName: "",
  }),
  mounted: function () {
    this.yearList = getSelectYear();
    this.seasons = Object.values(season);
    this.targetYear = getNowYear();
    this.targetSeason = getNowSeason();
    this.getAnimeInfo(this.nowPage);
    this.isLogined();
  },
  methods: {
    openSnackBar(message, type) {
      this.snackbarMessage = message;
      this.snackbarColor = type;
      this.isOpenSnackbar = true;
    },
    isLogined() {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo === null) {
        this.user = "";
        this.logined = false;
        //console.log(this.logined);
      } else {
        this.user = userInfo;
        this.logined = true;
      }
    },
    async getAnimeInfo(targetPage) {
      this.loading = true;
      const targetUrl = getWorkInfoUrl(
        this.isWorkName,
        this.workName,
        this.targetYear,
        this.targetSeason,
        targetPage
      );
      await this.axios
        .get(targetUrl)
        .then((response) => {
          //console.log("@@1");
          //console.log(response.data.works);
          this.workInfos = response.data.works;
          this.isExistPage(response.data.total_count);
        })
        .catch((error) => {
          console.log("@@2");
          console.log(error);
        });
      this.loading = false;
    },
    isExistPage(totalCount) {
      if (totalCount === 0) {
        return false;
      }
      const baseTotalPage = Math.floor(totalCount / getCount);
      const isExistAmari = totalCount % getCount !== 0;
      if (isExistAmari) {
        this.totalPage = baseTotalPage + 1;
      } else {
        this.totalPage = baseTotalPage;
      }
      return true;
    },
    async getNumber(pageNumber) {
      await this.getAnimeInfo(pageNumber);
    },
  },
};
</script>