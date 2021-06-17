<template>
  <v-app>
    <v-container>
      <v-row justify="center">
        <v-col cols="12">
          <v-switch
            v-model="isEnglish"
            color="red darken-3"
            hide-details
            :label="isEnglish ? 'English' : '日本語'"
          ></v-switch>
        </v-col>
      </v-row>
      <div v-if="isEnglish">
        <v-row justify="center">
          <v-col cols="12">
            <div align="center">
              <h1 class="text-h1">About</h1>
            </div>
          </v-col>
        </v-row>
      </div>
      <div v-if="!isEnglish">
        <v-row justify="center">
          <v-col cols="12">
            <div align="center">
              <h1 class="text-h1">アバウト</h1>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-app>
</template>
<script>
export default {
  name: "About",
  data: () => ({
    isEnglish: false,
  }),
};
</script>