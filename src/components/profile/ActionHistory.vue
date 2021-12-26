<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="400" class="my-4">
        <v-card-text>
          <div align="center" v-if="loading">
            <v-progress-circular
              v-if="loading"
              :size="50"
              color="primary"
              dark
              indeterminate
            ></v-progress-circular>
          </div>
          <div v-if="!loading">
            <div v-if="histories.length">
              <v-timeline align-top dense>
                <v-timeline-item
                  v-for="history in histories"
                  :key="history.id"
                  :color="history.color"
                  small
                >
                  <div>
                    <div class="font-weight-normal">
                      <strong>{{ history.title }}</strong> @{{ history.time }}
                    </div>
                    <div>{{ history.message }}</div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </div>
            <div align="center" class="mt-4" v-if="!histories.length">
              履歴はありません。
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ActionHistory",
  props: ["loading", "histories"],
};
</script>
