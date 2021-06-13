<template>
  <v-card>
    <v-card-title>
      <v-icon color="indigo" class="mr-2">fas fa-calculator</v-icon>
      符計算
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row justify="center">
        <v-col sm="2" md="4">
          <v-checkbox
            v-model="matinoKatati"
            color="red"
            label="両面・シャポ待ちでない"
            hide-details
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col sm="2" md="4">
          <v-checkbox
            v-model="jantou"
            color="green"
            label="頭が役牌"
            hide-details
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col sm="2" md="4">
          <v-select
            v-model="hora"
            :items="horaKei"
            item-text="label"
            item-value="value"
            label="和了の形"
          />
        </v-col>
      </v-row>
      <v-row justify="center" cols="3">
        <v-col sm="2" md="2">
          <v-select
            v-model="kotuTyuutyanMin"
            :items="maisuu"
            label="刻子 中張・明"
          />
        </v-col>
        <v-col sm="4" md="4">
          <v-select
            v-model="kotuOther"
            :items="maisuu"
            label="刻子 中張・暗 幺九・明"
          />
        </v-col>
        <v-col sm="2" md="2">
          <v-select
            v-model="kotuYaotyuAn"
            :items="maisuu"
            label="刻子 幺九・暗"
          />
        </v-col>
      </v-row>
      <v-row justify="center" cols="3">
        <v-col sm="2" md="2">
          <v-select
            v-model="kantuTyuutyanMin"
            :items="maisuu"
            label="槓子 中張・明"
          />
        </v-col>
        <v-col sm="4" md="4">
          <v-select
            v-model="kantuOther"
            :items="maisuu"
            label="槓子 中張・暗 幺九・明"
          />
        </v-col>
        <v-col sm="2" md="2">
          <v-select
            v-model="kantuYaotyuAn"
            :items="maisuu"
            label="槓子 幺九・暗"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="indigo" text @click="$emit('close-from-Hukeisan', 20)"
        >Cancel</v-btn
      >
      <v-btn color="indigo" text @click="doCount">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "HuKeisan",

  data: () => ({
    horaKei: [
      { label: "", value: 0 },
      { label: "ツモ", value: 2 },
      { label: "面前でロン", value: 10 },
    ],
    hora: 0,
    maisuu: [0, 1, 2, 3, 4],
    kotuTyuutyanMin: 0,
    kotuOther: 0,
    kotuYaotyuAn: 0,
    kantuTyuutyanMin: 0,
    kantuOther: 0,
    kantuYaotyuAn: 0,
    matinoKatati: false,
    jantou: false,
    hu: 0,
  }),

  methods: {
    doCount() {
      const kihonHu = 20;
      var hu = kihonHu;

      if (this.matinoKatati) {
        hu += 2;
      }

      if (this.jantou) {
        hu += 2;
      }

      hu += this.hora;

      hu += this.kotuTyuutyanMin * 2;
      hu += this.kotuOther * 4;
      hu += this.kotuYaotyuAn * 8;
      hu += this.kantuTyuutyanMin * 8;
      hu += this.kantuOther * 16;
      hu += this.kantuYaotyuAn * 32;

      if (hu % 10 != 0) {
        hu += 10;
      }

      this.hu = Math.floor(hu / 10) * 10;
      this.clearScreen();
      this.$emit("close-from-Hukeisan", this.hu);
    },

    clearScreen() {
      this.hora = 0;
      this.matinoKatati = false;
      this.jantou = false;
      this.kotuTyuutyanMin = 0;
      this.kotuOther = 0;
      this.kotuYaotyuAn = 0;
      this.kantuTyuutyanMin = 0;
      this.kantuOther = 0;
      this.kantuYaotyuAn = 0;
    },
  },
};
</script>