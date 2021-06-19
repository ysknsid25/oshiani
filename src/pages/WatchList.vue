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
    <v-row dense v-if="!loading">
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
            <TrashButton :workId="workInfo.id"></TrashButton>
            <v-spacer></v-spacer>
            <WorkDetailDialog
              :workInfo="workInfo"
              :reviewInfo="reviewInfo"
              :isLogined="false"
            >
            </WorkDetailDialog>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import WorkDetailDialog from "../components/WorkDetailDialog";
import TrashButton from "../components/TrashButton";
import { getWorkInfoUrl, getImage, getTitle } from "../api/Annict";
//import { getUserInfo } from "../firestoreaccess/Users";
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
  }),
  created: async function () {
    await this.getAnimeInfo();
    this.uid = localStorage.getItem("userInfo");
    this.logined = this.uid !== null && typeof this.uid !== "undefined";
  },
  methods: {
    trimTitle(title) {
      return getTitle(title);
    },
    async getAnimeInfo() {
      this.loading = true;
      const targetUrl = getWorkInfoUrl(false, "", "2021", "spring", 1);
      await this.axios
        .get(targetUrl)
        .then((response) => {
          //console.log("@@1");
          //console.log(response.data.works);
          this.workInfos = response.data.works;
        })
        .catch((error) => {
          console.log("@@2");
          console.log(error);
        });
      this.loading = false;
    },
    getImageUrl(url) {
      return getImage(url);
    },
  },
};
</script>