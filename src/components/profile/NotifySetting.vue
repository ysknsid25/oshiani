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
        <v-col xs="2" md="2" align-self="center" justify="center"> </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
const pattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const maxSize = 50;
export default {
  name: "NotifySetting",
  props: ["loading", "pgCastList", "pgTitleList"],
  data: () => ({
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
};
</script>
