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
          xs="3"
          md="3"
          offset-xs="3"
          offset-md="3"
          align-self="center"
          justify="center"
        >
          A&G番組情報を配信希望
        </v-col>
        <v-col xs="6" md="6" align-self="center" justify="center">
          <v-switch
            v-model="isNotify"
            color="secondary"
            class="ml-8"
          ></v-switch>
        </v-col>
      </v-row>
      <v-row justify="space-around" no-gutters v-if="isNotify">
        <v-col
          xs="3"
          md="3"
          offset-xs="3"
          offset-md="3"
          align-self="center"
          justify="center"
        >
          配信頻度
        </v-col>
        <v-col xs="6" md="6" align-self="center" justify="center">
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
      <v-row justify="space-around" no-gutters v-if="isNotify">
        <!-- 頻度 一日一回 月一回  -->
        <v-col
          xs="3"
          md="3"
          offset-xs="3"
          offset-md="3"
          align-self="center"
          justify="center"
        >
          配信先
        </v-col>
        <v-col xs="4" md="4" align-self="center" justify="center">
          <v-text-field
            outlined
            dense
            v-model="email"
            :rules="[rules.required, rules.email, rules.counter]"
            label="E-mail"
            class="ml-8 pt-6"
          ></v-text-field>
        </v-col>
        <v-col
          v-if="!$vuetify.breakpoint.xs"
          md="2"
          align-self="center"
          justify="center"
        >
        </v-col>
      </v-row>
      <v-row justify="space-around" v-if="isNotify">
        <!-- 頻度 一日一回 月一回  -->
        <v-col
          xs="12"
          md="7"
          offset-md="3"
          align-self="center"
          justify="center"
        >
          <v-card>
            <v-card-title>
              配信希望パーソナリティ
              <v-spacer></v-spacer>
              <v-text-field
                v-model="searchCastName"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              v-model="selectedCastList"
              :headers="headers"
              :items="castList"
              item-key="name"
              show-select
              :search="searchCastName"
              class="elevation-1"
            >
            </v-data-table>
          </v-card>
        </v-col>
        <v-col v-if="!$vuetify.breakpoint.xs" md="2" align-self="center">
        </v-col>
      </v-row>
      <v-row justify="space-around" v-if="isNotify">
        <!-- 頻度 一日一回 月一回  -->
        <v-col
          xs="4"
          md="4"
          offset-xs="8"
          offset-md="8"
          align-self="center"
          justify="end"
        >
          <v-btn
            tile
            color="secondary"
            width="100"
            class="ml-12"
            @click="saveNotifySetting"
            >保存する</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <v-snackbar v-model="isSnackOpen" :color="snackColor" top timeout="1000">
      {{ snackMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { getCastList } from "../../firestoreaccess/agCastList";
import {
  getUserNotifySetting,
  setUserNotifyInfo,
} from "../../firestoreaccess/UserNofitySetting";
const pattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const maxSize = 50;
export default {
  name: "NotifySetting",
  props: ["loading", "pgCastList", "pgTitleList"],
  data: () => ({
    headers: [{ text: "Name", value: "name" }],
    castList: [],
    selectedCastList: [],
    searchCastName: "",
    isNotify: false,
    howmanynotify: "everyday",
    email: "",
    isEmailValid: false,
    rules: {
      required: (value) => !!value || "Required.",
      counter: (value) =>
        value.length <= maxSize || "Max " + maxSize + " characters",
      email: (value) => {
        return pattern.test(value) || "Invalid e-mail.";
      },
    },
    isSnackOpen: false,
    snackColor: "",
    snackMessage: "",
  }),
  computed: {
    isEverydayChecked: function () {
      return this.howmanynotify === "everyday";
    },
    isEveryMondayChecked: function () {
      return this.howmanynotify === "everymonday";
    },
    isValidEmail: function () {
      return (
        this.email != "" &&
        this.email.length <= maxSize &&
        pattern.test(this.email)
      );
    },
  },
  created: async function () {
    const uid = localStorage.getItem("userInfo");
    const userNotifyInfo = await getUserNotifySetting(uid);
    this.isNotify = userNotifyInfo.doNotify;
    this.howmanynotify = userNotifyInfo.frequency;
    this.email = userNotifyInfo.targetEmail;
    this.selectedCastList = userNotifyInfo.castList;
    const tmpCastList = await getCastList();
    this.castList = tmpCastList.map((value) => ({
      name: value,
    }));
    //console.log(this.castList);
  },
  methods: {
    saveNotifySetting() {
      const uid = localStorage.getItem("userInfo");
      const castList = this.selectedCastList.map((obj) => obj.name);
      const userNotifyInfo = {
        doNotify: this.isNotify,
        frequency: this.howmanynotify,
        targetEmail: this.email,
        castList: castList,
      };
      const isSuccess = setUserNotifyInfo(uid, userNotifyInfo);
      if (this.isValidEmail && isSuccess) {
        //保存
        this.snackColor = "info";
        this.snackMessage = "保存しました";
      } else {
        this.snackColor = "red darken-2";
        this.snackMessage = "メールアドレスが未入力、またはエラーがあります";
      }
      this.isSnackOpen = true;
    },
  },
};
</script>
