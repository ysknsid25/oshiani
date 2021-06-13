<template>
  <v-app>
    <v-container class="mt-10">
      <v-row justify="center">
        <v-col cols="12"></v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12">
          <div align="center">
            <h1 class="text-h1">現在、メンテナンス中です。</h1>
          </div>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="6" xs="12">
          <div align="center">
            復旧に向けて対応しておりますので、しばらくお待ちください。
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
import { noteUrl } from "../constants/links";
export default {
  name: "Error",
  data: () => ({
    noteUrl: noteUrl,
  }),
};
</script>