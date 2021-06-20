<template>
  <v-container>
    <v-row v-if="loading">
      <v-col cols="12">
        <div align="center">
          <v-progress-circular
            indeterminate
            color="indigo"
          ></v-progress-circular>
        </div>
      </v-col>
    </v-row>
    <v-row dense v-if="!loading && workInfos.length > 0">
      <v-col
        v-for="workInfo in workInfos"
        :key="workInfo.id"
        xs="12"
        sm="4"
        md="3"
      >
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
          <v-divider></v-divider>
          <v-card-actions>
            <TrashButton
              :workInfo="workInfo"
              :workInfos="workInfos"
              @updated-watchlist="refreshWatchList"
            ></TrashButton>
            <v-spacer></v-spacer>
            <WorkDetailDialog
              :workInfo="workInfo"
              :reviewInfo="getFireStoreWorkInfo(workInfo.id)"
              :isLogined="logined"
            >
            </WorkDetailDialog>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense v-if="!loading && workInfos.length === 0">
      <v-col cols="12">
        <div align="center">
          <h1 class="text-h1">No Data</h1>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import WorkDetailDialog from "../components/WorkDetailDialog";
import TrashButton from "../components/TrashButton";
import { getImage, getTitle } from "../api/Annict";
import { getWatchList } from "../firestoreaccess/WatchList";
import { getWorkInfos } from "../firestoreaccess/WorkInfo";
import { reviewInfo } from "../constants/cmnfunc";
export default {
  name: "WatchList",
  components: {
    WorkDetailDialog,
    TrashButton,
  },
  data: () => ({
    loading: false,
    logined: false,
    workInfos: [],
    workInfo: {},
    reviewInfo: {},
    uid: "",
    fireStoreWorkInfos: [],
  }),
  created: async function () {
    this.uid = localStorage.getItem("userInfo");
    this.logined = this.uid !== null && typeof this.uid !== "undefined";
    await this.getWatchList(this.uid);
  },
  methods: {
    trimTitle(title) {
      return getTitle(title);
    },
    async getWatchList(uid) {
      this.loading = true;
      this.workInfos = await getWatchList(uid);
      const workIdArr = this.workInfos.map((workInfo) => workInfo.id);
      this.fireStoreWorkInfos = await getWorkInfos(workIdArr);
      this.loading = false;
    },
    getImageUrl(url) {
      return getImage(url);
    },
    refreshWatchList(newWatchList) {
      this.workInfos = newWatchList;
    },
    getFireStoreWorkInfo(id) {
      return reviewInfo(this.fireStoreWorkInfos, id);
    },
  },
};
</script>