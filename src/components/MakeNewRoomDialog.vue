<template>
  <div>
    <v-dialog persistent v-model="newRoomDialog" max-width="500px">
      <template v-slot:activator="{ on }">
        <v-btn fab color="indigo" dark small v-on="on">
          <v-icon>fas fa-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <v-icon color="secondary" dark class="mr-4"
            >fas fa-folder-plus</v-icon
          >
          New Room
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form v-model="valid" ref="newRoomForm">
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="date"
                        label="Date"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      no-title
                      scrollable
                      v-model="date"
                      @input="menu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="6">
                  <v-select
                    :items="initMotiten"
                    label="持ち点"
                    v-model="selectedMotiten"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <v-text-field
                    v-model="firstName"
                    :rules="nameRules"
                    :counter="10"
                    required
                    readonly
                    label="東家"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="secondName"
                    :rules="nameRules"
                    :counter="10"
                    required
                    label="南家"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="thirdName"
                    :rules="nameRules"
                    :counter="10"
                    required
                    label="西家"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="fourthName"
                    :rules="nameRules"
                    :counter="10"
                    required
                    label="北家"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            dark
            text
            @click="save"
            :disabled="!valid"
            class="mr-2"
            >Save</v-btn
          >
          <v-btn class="mr-2" color="secondary" dark text @click="reset()"
            >Reset</v-btn
          >
          <v-btn color="secondary" dark text @click="closeNewRoomDialog()"
            >close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import * as MAHJAN_FUNC from "../constants/mahjong";

export default {
  name: "MakeNewRoomDialog",
  data: () => ({
    newRoomDialog: false,
    valid: false,
    menu: false,
    date: new Date().toISOString().substr(0, 10),
    initMotiten: MAHJAN_FUNC.DEF_MOTITEN,
    selectedMotiten: 25000,
    firstName: "You",
    secondName: "",
    thirdName: "",
    fourthName: "",
    nameRules: [
      (v) => {
        if (typeof v !== "undefined") {
          return !!v || "氏名は必須";
        }
        return "氏名は必須";
      },
      (v) => {
        if (typeof v !== "undefined") {
          return v.length <= 10 || "10文字以下";
        }
        return "10文字以下";
      },
    ],
  }),
  methods: {
    closeNewRoomDialog() {
      if (confirm("保存せず終了しますか？")) {
        this.newRoomDialog = false;
        this.clear();
      }
    },
    reset() {
      if (confirm("入力値を初期化します。よろしいですか？")) {
        this.clear();
      }
    },
    clear() {
      this.$refs.newRoomForm.reset();
      this.valid = false;
      //こいつがいないと値がセットされる前に画面にv-modelの状態が描画されてします
      //v-modelにセット→描画の流れになるように遅延させている
      requestAnimationFrame(() => {
        this.date = new Date().toISOString().substr(0, 10);
        this.selectedMotiten = 25000;
        this.firstName = "You";
        this.secondName = "";
        this.thirdName = "";
        this.fourthName = "";
      });
    },

    save() {
      const retVal = {
        ymd: this.date.replaceAll("-", "/"),
        firstName: this.firstName,
        firstScore: this.selectedMotiten,
        secondName: this.secondName,
        secondScore: this.selectedMotiten,
        thirdName: this.thirdName,
        thirdScore: this.selectedMotiten,
        fourthName: this.fourthName,
        fourthScore: this.selectedMotiten,
      };
      this.newRoomDialog = false;
      this.clear();
      this.$emit("save-from-newroom", retVal);
    },
  },
};
</script>