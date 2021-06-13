<template>
  <div>
    <div align="center">
      <v-progress-circular
        v-if="loading"
        :size="50"
        color="secondary"
        dark
        indeterminate
      ></v-progress-circular>
    </div>
    <v-card height="30em" v-if="!loading">
      <v-card-title class="text-h5">
        <v-icon color="secondary" dark class="mr-2"
          >far fa-caret-square-up</v-icon
        >
        直近10局のスタイル
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <RaderChart
          :labels="tblHeadList"
          :datas="styleList"
          :whatIndicate="hanrei"
        ></RaderChart>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import RaderChart from "./chart/RaderChart";
import { styleLabels } from "../../constants/label";
export default {
  name: "StyleChart",
  props: ["styleList"],
  components: {
    RaderChart,
  },
  data: () => ({
    loading: false,
    title: "直近10局のスタイル",
    hanrei: "能力",
    tblHeadList: styleLabels,
  }),
};
</script>