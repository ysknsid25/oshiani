<template>
  <div align="center">
    <v-card max-width="400">
      <v-card-title>
        <v-icon color="indigo" class="mr-2">fas fa-calculator</v-icon>
        得点計算
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-dialog v-model="huKeisanDialog" max-width="800">
            <HuKeisan @close-from-Hukeisan="refreshHuCalcResult"></HuKeisan>
          </v-dialog>
          <v-dialog persistent v-model="hanKeisanDialog" max-width="800">
            <HanKeisan @close-from-HanKeisan="refreshHanCalcResult"></HanKeisan>
          </v-dialog>
          <v-dialog v-model="tenpaiDialog" max-width="800">
            <Tenpai
              @close-from-Tenpai="refreshTenpaiCalcResult"
              :tontyaWho="editItem.first.name"
              :nantyaWho="editItem.second.name"
              :syatyaWho="editItem.third.name"
              :petyaWho="editItem.fourth.name"
            >
            </Tenpai>
          </v-dialog>
          <v-row justify="center">
            <v-col>
              <v-select
                v-model="hu"
                :items="huItems"
                label="符"
                @change="changeHu"
              />
            </v-col>
            <v-col>
              <v-btn tile outlined color="indigo" dark @click="calcuHu()"
                >符計算</v-btn
              >
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col>
              <v-select
                v-model="han"
                item-text="label"
                item-value="value"
                :items="hanItems"
                label="翻"
                @change="changeHan"
              />
            </v-col>
            <v-col>
              <v-btn tile outlined color="indigo" dark @click="calcuHan()"
                >役選択</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn text color="indigo" dark @click="backTokutenTop">Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn text color="indigo" dark class="mr-2" @click="ryukyoku"
          >流局</v-btn
        >
        <v-btn text color="indigo" dark @click="calculateTokuten"
          >得点計算</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import HanKeisan from "./HanKeisan";
import HuKeisan from "./HuKeisan";
import Tenpai from "./Tenpai";
import * as MAHJAN_FUNC from "../../constants/mahjong";
export default {
  name: "TokutenKeisan",
  props: ["editItem"],
  components: {
    HanKeisan,
    HuKeisan,
    Tenpai,
  },
  data: () => ({
    huKeisanDialog: false,
    hanKeisanDialog: false,
    tenpaiDialog: false,
    hu: 20,
    han: "1",
    huItems: MAHJAN_FUNC.HU_VALUES,
    hanItems: MAHJAN_FUNC.HAN_VALUES,
    horaYaku: "",
  }),
  methods: {
    refreshHuCalcResult(huVal) {
      this.hu = huVal;
      this.huKeisanDialog = false;
    },

    refreshHanCalcResult(hanInfo) {
      const hanVal =
        typeof hanInfo["hanTotal"] == "undefined" ? "1" : hanInfo["hanTotal"];
      this.horaYaku =
        typeof hanInfo["selectedYau"] == "undefined"
          ? ""
          : hanInfo["selectedYau"];
      this.setHanVal(hanVal);
      if (this.horaYaku !== "") {
        const isPinfu =
          typeof this.horaYaku.find((yaku) => yaku === "平和") !== "undefined";
        const isTitoi =
          typeof this.horaYaku.find((yaku) => yaku === "七対子") !==
          "undefined";
        if (isPinfu) {
          this.hu = 20;
        }
        if (isTitoi) {
          this.hu = 25;
        }
      }
      this.hanKeisanDialog = false;
    },

    //子コンポーネントから返ってきた翻の値をコンボにセットする
    setHanVal(hanVal) {
      if (hanVal < 5) {
        this.han = String(hanVal);
      } else if (hanVal == 5) {
        this.han = "5";
      } else if (hanVal == 6 || hanVal == 7) {
        this.han = "6";
      } else if (hanVal == 8 || hanVal == 9 || hanVal == 10) {
        this.han = "7";
      } else if (hanVal == 11 || hanVal == 12) {
        this.han = "8";
      } else if (hanVal >= 13) {
        this.han = "9";
      }
    },
    refreshTenpaiCalcResult(tenpaiValArr) {
      this.tenpaiDialog = false;
      this.$emit("back-tokuten-top-tenpai", tenpaiValArr);
    },

    changeHu(hu) {
      this.hu = hu;
    },

    changeHan(han) {
      this.setHanVal(Number(han.value));
    },

    ryukyoku() {
      this.tenpaiDialog = true;
    },

    calcuHan() {
      this.hanKeisanDialog = true;
    },

    calcuHu() {
      this.huKeisanDialog = true;
    },

    calculateTokuten() {
      const retVal = {
        han: this.han,
        hu: new String(this.hu),
        yakuInfo: this.horaYaku,
      };
      //this.horaYaku = "";
      this.$emit("back-tokuten-top-seisan", retVal);
    },
    backTokutenTop() {
      this.$emit("back-tokuten-top");
    },
  },
};
</script>