<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="400">
        <v-card-title>
          <v-icon color="indigo" class="mr-2">fas fa-history</v-icon>
          和了履歴
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div align="center" v-if="loading">
            <v-progress-circular
              v-if="loading"
              :size="50"
              color="secondary"
              dark
              indeterminate
            ></v-progress-circular>
          </div>
          <div v-if="!loading">
            <v-timeline
              align-top
              dense
              class="ml-8 mb-2"
              v-if="histories.length > 0"
            >
              <v-timeline-item
                v-for="history in histories"
                :key="history.docId"
                color="indigo"
                small
              >
                <div>
                  <div class="font-weight-normal">
                    <strong>{{ history.time }}</strong>
                    {{
                      history.from !== "" && history.to !== ""
                        ? "@" + history.from + " -> " + history.to
                        : ""
                    }}
                  </div>
                  <div>
                    {{ history.yaku !== "" ? history.yaku : "記録なし" }}
                  </div>
                  <div>{{ history.score }}</div>
                  <div>
                    <v-btn icon small @click="deleteHoraInfo(history)">
                      <v-icon>far fa-trash-alt</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
            <div align="center" class="mt-4" v-if="!histories.length > 0">
              和了履歴はまだありません。
            </div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text color="indigo" dark @click="backTokutenTop">Back</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { createActionHistory } from "../../firestoreaccess/ActionHistory";
import { deleteHoraInfo } from "../../firestoreaccess/RoomHistory";
export default {
  name: "HoraHistory",
  props: ["histories", "docId"],
  data: () => ({
    loading: false,
  }),

  methods: {
    deleteHoraInfo(historyInfo) {
      if (confirm("和了情報を削除しますか？")) {
        const index = this.histories.indexOf(historyInfo);
        this.histories.splice(index, 1);
        deleteHoraInfo(this.docId, historyInfo.docId);
        createActionHistory("Delete HoraInfo", "和了記録を削除しました。");
      }
    },
    backTokutenTop() {
      this.$emit("close-from-HoraHistory");
    },
  },
};
</script>
