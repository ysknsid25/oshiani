<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="white" dark icon v-bind="attrs" v-on="on">
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-progress-linear
        indeterminate
        color="secondary"
        dark
        v-if="sending"
      ></v-progress-linear>
      <v-card-title>
        <v-icon color="indigo" class="mr-2">fas fa-edit</v-icon>
        ユーザー名を変更する
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="userName"
                label="ユーザー名"
              ></v-text-field>
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
          @click="doUpdateUserName"
          >送信</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { createActionHistory } from "../firestoreaccess/ActionHistory";
export default {
  name: "NameRegistCard",
  props: ["initUserName"],
  data: () => ({
    dialog: false,
    sending: false,
    userName: "",
  }),
  mounted: function () {
    this.userName = this.initUserName;
  },
  methods: {
    doUpdateUserName() {
      this.sending = true;
      //@@ユーザー名を更新
      createActionHistory("Update User Name", "ユーザー名を更新しました。");
      this.clear();
      this.sending = false;
      this.dialog = false;
    },
    clear() {
      this.userName = "";
    },
  },
};
</script>