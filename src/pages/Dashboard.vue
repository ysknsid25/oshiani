<template>
  <v-container>
    <div align="center" v-if="!loading">
      <v-row dense justify="center">
        <v-col xs="12" md="12">
          <TotalDataTable :totalDataList="totalDataList"></TotalDataTable>
        </v-col>
        <!--
      <v-col xs="12" md="6">
        <div align="center" v-if="loading">
          <v-progress-circular
            :size="50"
            color="secondary"
            dark
            indeterminate
          ></v-progress-circular>
        </div>
        <StyleChart :styleList="styleList" v-if="!loading"></StyleChart>
      </v-col>
      -->
        <v-col xs="12" md="12">
          <RankingChart :scoreList="scoreList"></RankingChart>
        </v-col>
      </v-row>
    </div>
    <div align="center" v-if="loading">
      <v-progress-circular
        :size="50"
        color="secondary"
        dark
        indeterminate
      ></v-progress-circular>
    </div>
  </v-container>
</template>
<script>
import TotalDataTable from "../components/Dashboard/TotalDataTable";
//import StyleChart from "../components/Dashboard/StyleChart";
import RankingChart from "../components/Dashboard/RankingChart";
import { getRecentlyRank, getData } from "../firestoreaccess/RoomHistory";
export default {
  name: "Feedback",
  components: {
    TotalDataTable,
    //StyleChart,
    RankingChart,
  },
  data: () => ({
    loading: false,
    scoreList: [],
    totalDataList: [],
  }),
  created: async function () {
    this.loading = true;
    const retObj = await getRecentlyRank(10);
    this.scoreList = retObj.rankArr;
    this.totalDataList = await getData(retObj.docIdArr);
    this.loading = false;
  },
};
</script>