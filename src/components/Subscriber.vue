<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="secondary" dark icon class="mr-2" v-bind="attrs" v-on="on">
        <v-icon>far fa-envelope</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-progress-linear
        indeterminate
        color="secondary"
        dark
        v-if="sending"
      ></v-progress-linear>
      <v-card-title> リリース情報を公開する </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-select
                item-text="label"
                item-value="value"
                :items="notifyType"
                v-model="infoType"
                label="種別"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="title" label="タイトル"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="url" label="URL"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          outlined
          tile
          color="secondary"
          dark
          width="100"
          :disabled="sending"
          @click="doUpdateArticle"
          >送信</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { infoTypeKbn } from "../constants/kbn";
import { createReleaseInfo } from "../firestoreaccess/ReleaseHistory";
import { getTimeStamp } from "../constants/cmnfunc";
export default {
  name: "Subscriber",
  data: () => ({
    dialog: false,
    sending: false,
    notifyType: infoTypeKbn,
    infoType: "",
    title: "",
    url: "",
  }),
  methods: {
    async doUpdateArticle() {
      this.sending = true;
      const releaseInfo = {
        articleUrl: this.url,
        infoType: this.infoType,
        postDate: getTimeStamp(),
        title: this.title,
      };
      await createReleaseInfo(releaseInfo);
      this.clear();
      this.sending = false;
      this.dialog = false;
    },
    clear() {
      this.infoType = "";
      this.title = "";
      this.url = "";
    },
  },
};
</script>