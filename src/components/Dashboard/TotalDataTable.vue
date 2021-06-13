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
    <v-card height="13em" v-if="!loading">
      <v-card-title class="text-h5">
        <v-icon color="secondary" dark class="mr-2">fas fa-th</v-icon>
        {{ title }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-simple-table fixed-header>
          <thead>
            <tr>
              <th
                class="text-center"
                v-for="tblHead in tblHeadList"
                :key="tblHead"
              >
                {{ tblHead }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                class="text-center"
                v-for="score in totalDataList"
                :key="score.key"
              >
                {{ score.val }}
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { recentlyScoreTblHeadList } from "../../constants/label";
export default {
  name: "TotalDataTable",
  props: ["totalDataList"],
  data: () => ({
    loading: false,
    title: "直近10局の成績",
    tblHeadList: recentlyScoreTblHeadList,
  }),
};
</script>