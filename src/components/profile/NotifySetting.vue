<template>
  <v-container>
    <div v-if="loading">
      <v-progress-circular
        :size="50"
        color="secondary"
        dark
        indeterminate
      ></v-progress-circular>
    </div>
    <div v-if="!loading">
      <v-row justify="space-around" no-gutters>
        <v-col
          xs="5"
          md="5"
          offset-xs="3"
          offset-md="3"
          align-self="center"
          justify="center"
        >
          A&G番組情報を配信希望
        </v-col>
        <v-col xs="4" md="4" align-self="center" justify="center">
          <v-switch
            v-model="isNotify"
            color="secondary"
            class="ml-8"
          ></v-switch>
        </v-col>
      </v-row>
      <v-row justify="space-around" no-gutters v-if="isNotify">
        <!-- 頻度 一日一回 月一回  -->
        <v-col
          xs="5"
          md="5"
          offset-xs="3"
          offset-md="3"
          align-self="center"
          justify="center"
        >
          配信頻度
        </v-col>
        <v-col xs="4" md="4" align-self="center" justify="center">
          <v-radio-group v-model="howmanynotify" row class="ml-8">
            <v-radio
              label="毎日"
              value="everyday"
              checked="isEverydayChecked"
            ></v-radio>
            <v-radio
              label="毎週月曜"
              value="everymonday"
              checked="isEveryMondayChecked"
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "NotifySetting",
  props: ["loading", "pgCastList", "pgTitleList"],
  data: () => ({
    isNotify: false,
    howmanynotify: "everyday",
  }),
  computed: {
    isEverydayChecked: function () {
      return this.howmanynotify === "everyday";
    },
    isEveryMondayChecked: function () {
      return this.howmanynotify === "everymonday";
    },
  },
};
</script>
