<template>
  <v-card>
    <v-card-title>
      <v-icon color="indigo" class="mr-2">fas fa-calculator</v-icon>
      翻計算
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row justify="center" cols="5">
        <v-col sm="2" md="2">
          <div class="font-weight-thin headline">1翻</div>
          <v-divider></v-divider>
          <div v-for="(itihanyaku, i) in itihans" :key="itihanyaku + i">
            <v-checkbox
              :id="'itihanyaku' + i"
              v-model="itihanSelected"
              color="red"
              :label="itihanyaku"
              :value="itihanyaku"
              hide-details
            ></v-checkbox>
          </div>
        </v-col>
        <v-col sm="2" md="2">
          <div class="font-weight-thin headline">2翻</div>
          <v-divider></v-divider>
          <div v-for="(ryanhanyaku, i) in ryanhans" :key="ryanhanyaku + i">
            <v-checkbox
              :id="'ryanhanyaku' + i"
              v-model="ryanhanSelected"
              color="green"
              :label="ryanhanyaku"
              :value="ryanhanyaku"
              hide-details
            ></v-checkbox>
          </div>
        </v-col>
        <v-col sm="2" md="2">
          <div class="font-weight-thin headline">3翻</div>
          <v-divider></v-divider>
          <div v-for="(sanhanyaku, i) in sanhans" :key="sanhanyaku + i">
            <v-checkbox
              :id="'sanhanyaku' + i"
              v-model="sanhanSelected"
              color="blue"
              :label="sanhanyaku"
              :value="sanhanyaku"
              hide-details
            ></v-checkbox>
          </div>
          <div class="font-weight-thin headline mt-4">5翻</div>
          <v-divider></v-divider>
          <div v-for="(uhanyaku, i) in uhans" :key="uhanyaku + i">
            <v-checkbox
              :id="'uhanyaku' + i"
              v-model="uhanSelected"
              color="indigo"
              :label="uhanyaku"
              :value="uhanyaku"
              hide-details
            ></v-checkbox>
          </div>
          <div class="font-weight-thin headline mt-4">6翻</div>
          <v-divider></v-divider>
          <div v-for="(rohanyaku, i) in rohans" :key="rohanyaku + i">
            <v-checkbox
              :id="'rohanyaku' + i"
              v-model="rohanSelected"
              color="red darken-3"
              :label="rohanyaku"
              :value="rohanyaku"
              hide-details
            ></v-checkbox>
          </div>
        </v-col>
        <v-col sm="2" md="2">
          <div class="font-weight-thin headline">役満</div>
          <v-divider></v-divider>
          <div v-for="(yakumanyaku, i) in yakumans" :key="'yakuman' + i">
            <v-checkbox
              :id="'yakuman' + i"
              v-model="yakumanSelected"
              color="red darken-3"
              :label="yakumanyaku"
              :value="yakumanyaku"
              hide-details
            ></v-checkbox>
          </div>
        </v-col>
        <v-col sm="2" md="2">
          <div class="font-weight-thin headline">ドラ</div>
          <v-divider></v-divider>
          <v-select v-model="dora" :items="howManyDora" label="ドラ" />
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="indigo" text @click="exit">Cancel</v-btn>
      <v-btn color="indigo" text @click="doCount">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "HanKeisan",

  data: () => ({
    hanTotal: 0,
    dora: 0,

    howManyDora: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    itihanSelected: [],
    itihans: [
      "面前自摸",
      "リーチ",
      "一発",
      "タンヤオ",
      "平和",
      "一盃口",
      "役牌",
      "風牌",
      "槍槓",
      "嶺上開花",
      "河底",
      "三色同順(鳴)",
      "一気通貫(鳴)",
      "チャンタ(鳴)",
    ],
    ryanhanSelected: [],
    ryanhans: [
      "ダブルリーチ",
      "七対子",
      "連風牌",
      "対々和",
      "三暗刻",
      "三色同順",
      "三色同刻",
      "一気通貫",
      "混老頭",
      "チャンタ",
      "小三元",
      "三槓子",
      "混一色(鳴)",
      "ジュンチャン(鳴)",
    ],
    sanhanSelected: [],
    sanhans: ["混一色", "ジュンチャン", "二盃口"],
    uhanSelected: [],
    uhans: ["清一色(鳴)", "流し満貫"],
    rohanSelected: [],
    rohans: ["清一色"],
    yakumanSelected: [],
    yakumans: [
      "四暗刻",
      "天和・地和",
      "緑一色",
      "大三元",
      "四喜和",
      "字一色",
      "国士無双",
      "九蓮宝燈",
      "清老頭",
      "四槓子",
    ],
  }),

  methods: {
    doCount() {
      this.hanTotal =
        this.itihanSelected.length +
        this.ryanhanSelected.length * 2 +
        this.sanhanSelected.length * 3 +
        this.uhanSelected.length * 5 +
        this.rohanSelected.length * 6 +
        this.yakumanSelected.length * 13 +
        this.dora;
      const DOAR = this.dora > 0 ? "ドラ" + this.dora : "";
      const selectedYau = [
        ...this.itihanSelected,
        ...this.ryanhanSelected,
        ...this.sanhanSelected,
        ...this.uhanSelected,
        ...this.rohanSelected,
        ...this.yakumanSelected,
        DOAR,
      ];
      const retVal = {
        hanTotal: this.hanTotal,
        selectedYau: selectedYau,
      };
      this.clearScreen(this);
      this.$emit("close-from-HanKeisan", retVal);
    },
    exit() {
      const retVal = {
        hanTotal: 1,
        selectedYau: [],
      };
      this.clearScreen(this);
      this.$emit("close-from-HanKeisan", retVal);
    },
    clearScreen() {
      this.itihanSelected = [];
      this.ryanhanSelected = [];
      this.sanhanSelected = [];
      this.uhanSelected = [];
      this.rohanSelected = [];
      this.yakumanSelected = [];
      this.dora = 0;
    },
  },
};
</script>