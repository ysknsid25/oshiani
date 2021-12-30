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
          <v-switch v-model="isNotify" color="secondary"></v-switch>
        </v-col>
        <v-col xs="4" md="4" align-self="center" justify="center">
          通知を許可: {{ isNotify ? "する" : "しない" }}
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
  }),
};
</script>
