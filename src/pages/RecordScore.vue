<template>
  <div>
    <v-row justify="center">
      <v-col cols="12">
        <div v-if="!loading">
          <v-data-table
            v-show="roomTable"
            :headers="headers"
            :items="scores"
            :items-per-page="5"
            class="elevation-2"
            item-key="docId"
            :sort-by="['battleNo']"
            :sort-desc="[true]"
            v-if="scores.length > 0"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>対局履歴</v-toolbar-title>
                <v-spacer></v-spacer>
                <MakeNewRoomDialog
                  @save-from-newroom="saveNewRoom"
                ></MakeNewRoomDialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>
          </v-data-table>
          <div align="center" v-if="!scores.length > 0">
            <MakeNewRoomDialog
              @save-from-newroom="saveNewRoom"
              class="ml-2"
            ></MakeNewRoomDialog>
          </div>
          <div v-show="!roomTable">
            <v-container>
              <v-row justify="center">
                <v-col cols="12">
                  <div align="center">
                    <v-card
                      v-show="!doCalcurate && !doDispHistory"
                      max-width="500"
                    >
                      <v-card-title>
                        <v-icon color="indigo" class="mr-2"
                          >fas fa-table</v-icon
                        >
                        得点状況
                        <v-spacer></v-spacer>
                        <v-btn
                          icon
                          color="indigo"
                          v-if="!saving"
                          @click="exitRoom"
                          ><v-icon>fas fa-sign-out-alt</v-icon></v-btn
                        >
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text>
                        <v-form v-model="valid" ref="form">
                          <v-container>
                            <v-row justify="center" dense>
                              <v-col cols="12"> </v-col>
                            </v-row>
                            <v-row justify="center" dense>
                              <v-col>
                                <v-select
                                  v-model="ba"
                                  item-text="label"
                                  item-value="value"
                                  :items="baItems"
                                  label="場"
                                />
                              </v-col>
                              <v-col>
                                <v-select
                                  v-model="kyoku"
                                  :items="kyokuItems"
                                  label="局"
                                />
                              </v-col>
                              <v-col>
                                <v-select
                                  v-model="honba"
                                  :items="honbaItems"
                                  label="本場"
                                />
                              </v-col>
                              <v-col>
                                <div align="center">
                                  <v-avatar size="40" class="indigo ml-4 mt-1">
                                    <span class="white--text">{{
                                      reachBou
                                    }}</span>
                                  </v-avatar>
                                </div>
                              </v-col>
                            </v-row>
                            <v-row justify="center" dense>
                              <v-col>
                                <v-select
                                  v-model="oya"
                                  :items="horashaList"
                                  label="親"
                                />
                              </v-col>
                              <v-col>
                                <v-select
                                  v-model="horasha"
                                  :items="horashaList"
                                  label="和了者"
                                />
                              </v-col>
                              <v-col>
                                <v-select
                                  v-model="shiharaiNin"
                                  :items="shiharaiNinList"
                                  label="支払人"
                                />
                              </v-col>
                            </v-row>
                            <v-divider class="mt-6 mb-8"></v-divider>
                            <v-row
                              justify="center"
                              dense
                              v-for="label in calcVarLbArr"
                              :key="label"
                            >
                              <v-col>
                                <v-text-field
                                  v-model="calcuVar[label]['score']"
                                  :label="calcuVar[label]['name']"
                                  :rules="totalScoreRules"
                                  required
                                ></v-text-field>
                              </v-col>
                              <v-col>
                                <div align="center">
                                  <v-btn
                                    rounded
                                    small
                                    color="indigo"
                                    dark
                                    class="mt-4"
                                    @click="reach(label)"
                                    >立直</v-btn
                                  >
                                </div>
                              </v-col>
                              <v-col>
                                <v-text-field
                                  v-model="calcuVar[label]['plus']"
                                  label="＋"
                                  :rules="scoreRules"
                                  required
                                ></v-text-field>
                              </v-col>
                              <v-col>
                                <v-text-field
                                  v-model="calcuVar[label]['minus']"
                                  label="-"
                                  :rules="scoreRules"
                                  required
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-form>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-btn
                          icon
                          color="indigo"
                          v-if="!saving"
                          @click="reverseDoCalcurate"
                        >
                          <v-icon>fas fa-calculator</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          color="indigo"
                          v-if="!saving"
                          @click="reverseDoDispHistory"
                        >
                          <v-icon>fas fa-history</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          icon
                          color="indigo"
                          dark
                          v-if="!saving"
                          @click="liquidation"
                        >
                          <v-icon>fas fa-save</v-icon>
                        </v-btn>
                        <v-progress-circular
                          v-if="saving"
                          :size="20"
                          color="indigo"
                          dark
                          indeterminate
                        ></v-progress-circular>
                      </v-card-actions>
                    </v-card>
                  </div>
                  <TokutenKeisan
                    :editItem="calcuVar"
                    v-if="doCalcurate && !doDispHistory"
                    @back-tokuten-top-seisan="deployTokutenResult"
                    @back-tokuten-top-tenpai="deployTokutenTenpai"
                    @back-tokuten-top="reverseDoCalcurate"
                  ></TokutenKeisan>
                  <HoraHistoy
                    :histories="horaHistories"
                    :docId="docId"
                    v-if="!doCalcurate && doDispHistory"
                    @close-from-HoraHistory="reverseDoDispHistory"
                  ></HoraHistoy>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
        <div v-if="loading" align="center">
          <v-progress-circular
            v-if="loading"
            :size="50"
            color="secondary"
            dark
            indeterminate
          ></v-progress-circular>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import MakeNewRoomDialog from "../components/MakeNewRoomDialog";
import * as MAHJAN_FUNC from "../constants/mahjong";
import TokutenKeisan from "../components/taikyokuroom/TokutenKeisan";
import HoraHistoy from "../components/taikyokuroom/HoraHistory";
import { createActionHistory } from "../firestoreaccess/ActionHistory";
import {
  createRoomHistory,
  getMaxBattleNo,
  getRoomHistoryArr,
  deleteRoomHistory,
  updateRoomHistory,
  getHoraHistory,
  setHoraInfo,
} from "../firestoreaccess/RoomHistory";

export default {
  name: "RecordScore",
  components: {
    MakeNewRoomDialog,
    TokutenKeisan,
    HoraHistoy,
  },
  data: () => ({
    docId: "",
    roomTable: true,
    loading: true,
    valid: false,
    headers: [
      {
        text: "No",
        align: "center",
        value: "battleNo",
        sortable: false,
      },
      { text: "Actions", align: "center", value: "actions", sortable: false },
      { text: "YMD", align: "center", value: "ymd", sortable: false },
      {
        text: "東家(Your)",
        align: "center",
        value: "firstScore",
        sortable: false,
      },
      { text: "南家", align: "center", value: "secondScore", sortable: false },
      { text: "西家", align: "center", value: "thirdScore", sortable: false },
      { text: "北家", align: "center", value: "fourthScore", sortable: false },
    ],
    scores: [],
    saving: false,
    doCalcurate: false,
    doDispHistory: false,
    tokuten: 0,
    reachBou: 0,
    ba: "東",
    baItems: MAHJAN_FUNC.BA_VALUES,
    kyoku: "1",
    kyokuItems: MAHJAN_FUNC.KYOKU_VALUES,
    honba: "",
    honbaItems: MAHJAN_FUNC.HONBA_VALUES,
    oya: "",
    horasha: "",
    shiharaiNin: "",
    horashaList: [],
    shiharaiNinList: [],
    calcVarLbArr: ["first", "second", "third", "fourth"],
    calcuVar: {
      first: { name: "", score: 0, plus: 0, minus: 0 },
      second: { name: "", score: 0, plus: 0, minus: 0 },
      third: { name: "", score: 0, plus: 0, minus: 0 },
      fourth: { name: "", score: 0, plus: 0, minus: 0 },
    },
    tokutenInfoList: [],
    horaHistories: [],
    kyokuKekkaInfo: "",
    scoreRules: [
      (v) => {
        if (typeof v !== "undefined") {
          return /^[0-9]+$/.test(v) || "必須かつ数字のみ";
        }
        return "必須かつ数字のみ";
      },
      (v) => {
        if (typeof v !== "undefined") {
          return (0 <= v && v <= 200000) || "0以上200000以下";
        }
        return "0以上200000以下";
      },
    ],
    totalScoreRules: [
      (v) => {
        if (typeof v !== "undefined") {
          return /^[-]?([1-9]\d*|0)$/.test(v) || "必須かつ整数のみ";
        }
        return "必須かつ整数のみ";
      },
      (v) => {
        if (typeof v !== "undefined") {
          return (-200000 <= v && v <= 200000) || "-200000以上200000以下";
        }
        return "-200000以上200000以下";
      },
    ],
  }),

  created: async function () {
    this.loading = true;
    this.scores = await getRoomHistoryArr(20);
    this.loading = false;
  },

  methods: {
    async saveNewRoom(val) {
      this.loading = true;
      const maxBattleNo = await getMaxBattleNo(this.scores.length);
      val.battleNo = maxBattleNo;
      const docId = await createRoomHistory(val);
      createActionHistory("Make New Room", "新規対局記録を作成しました。");
      if (docId === "") {
        alert("エラーが発生しました。");
        this.roomTable = true;
      } else {
        val.docId = docId;
        this.scores.push(val);
        this.editItem(val);
      }
      this.loading = false;
    },
    editItem(item) {
      this.roomTable = false;
      this.initTaikyoku(item);
      this.playingRoom = true;
    },
    async initTaikyoku(item) {
      this.docId = item.docId;
      this.ba = "東";
      this.kyoku = "1";
      this.honba = "";
      const menber = [
        item.firstName,
        item.secondName,
        item.thirdName,
        item.fourthName,
      ];
      this.oya = item.firstName;
      this.horasha = item.firstName;
      this.shiharaiNin = "All";
      this.horashaList = menber;
      this.shiharaiNinList = ["All", ...menber];
      this.calcuVar.first.name = item.firstName;
      this.calcuVar.first.score = item.firstScore;
      this.calcuVar.first.plus = 0;
      this.calcuVar.first.minus = 0;
      this.calcuVar.second.name = item.secondName;
      this.calcuVar.second.score = item.secondScore;
      this.calcuVar.second.plus = 0;
      this.calcuVar.second.minus = 0;
      this.calcuVar.third.name = item.thirdName;
      this.calcuVar.third.score = item.thirdScore;
      this.calcuVar.third.plus = 0;
      this.calcuVar.third.minus = 0;
      this.calcuVar.fourth.name = item.fourthName;
      this.calcuVar.fourth.score = item.fourthScore;
      this.calcuVar.fourth.plus = 0;
      this.calcuVar.fourth.minus = 0;
      this.horaHistories = await getHoraHistory(item.docId);
    },

    deleteItem(item) {
      if (confirm("対局情報を削除しますか？")) {
        const index = this.scores.indexOf(item);
        this.scores.splice(index, 1);
        deleteRoomHistory(item.docId);
        createActionHistory("Delete Room", "対局記録を削除しました。");
      }
    },
    reach(who) {
      const reachRyou = 1000;
      this.reachBou += 1;
      this.calcuVar[who].score -= reachRyou;
    },
    async liquidation() {
      this.saving = true;
      const isValid = await this.$refs.form.validate();
      if (isValid) {
        if (this.isSamePerson()) {
          alert("和了者と支払人が同一人物です。");
        } else if (confirm(this.getConfirmMessage())) {
          const totalTokuten = this.subtraction();
          this.reachBou = 0;
          //直接得点を入力された場合は和了情報が作成されてないから、このタイミングで作る
          if (
            Object.keys(this.kyokuKekkaInfo).length === 0 ||
            this.kyokuKekkaInfo === ""
          ) {
            this.makeHoraHistoryInfo([], totalTokuten);
          }
          if (this.kyokuKekkaInfo) {
            const sucDocId = await setHoraInfo(this.docId, this.kyokuKekkaInfo);
            this.kyokuKekkaInfo.docId = sucDocId;
            this.horaHistories.push(this.kyokuKekkaInfo);
            this.horaHistories = this.horaHistories.sort((a, b) =>
              a.no > b.no ? -1 : 1
            );
            //console.log(this.horaHistories);
          }
          this.kyokuKekkaInfo = {};
          await updateRoomHistory(this.docId, this.calcuVar);
          createActionHistory("Saved Room", "対局記録を保存しました。");
        }
      } else {
        alert("入力値にエラーがあります。");
      }
      this.saving = false;
    },
    getConfirmMessage() {
      const isInputYakuInfo =
        typeof this.kyokuKekkaInfo.yaku !== "undefined" &&
        this.kyokuKekkaInfo.yaku !== "";
      const baseMsg =
        "現在の入力値でこの局の結果を保存します。\r\nよろしいですか？\r\n";
      if (isInputYakuInfo) {
        return baseMsg + "結果 = " + this.kyokuKekkaInfo.yaku;
      } else {
        return baseMsg;
      }
    },
    subtraction() {
      let totalTokuten = 0;
      let plusFound = false;
      this.calcVarLbArr.map((label) => {
        this.calcuVar[label]["score"] =
          Number(this.calcuVar[label]["score"]) +
          Number(
            MAHJAN_FUNC.liquidationMain(
              this.calcuVar[label]["plus"],
              this.calcuVar[label]["minus"]
            )
          );
        //麻雀は基本的に一局のなかで和了できるのは一人だけど、
        //聴牌の場合は複数人がプラスになることがありえる
        //聴牌の場合は一人あたりの獲得素点を和了履歴に記録する
        if (!plusFound && this.calcuVar[label]["plus"] > 0) {
          plusFound = true;
          totalTokuten = this.calcuVar[label]["plus"];
        }
        this.calcuVar[label]["plus"] = 0;
        this.calcuVar[label]["minus"] = 0;
      });
      return totalTokuten;
    },

    async exitRoom() {
      this.playingRoom = false;
      const newScores = this.scores.map((score) => {
        let newScore = score;
        if (this.docId === score.docId) {
          newScore.firstScore = this.calcuVar.first.score;
          newScore.secondScore = this.calcuVar.second.score;
          newScore.thirdScore = this.calcuVar.third.score;
          newScore.fourthScore = this.calcuVar.fourth.score;
        }
        return newScore;
      });
      this.scores = newScores;
      await updateRoomHistory(this.docId, this.calcuVar);
      createActionHistory("Saved Room", "対局記録を更新しました。");
      this.roomTable = true;
    },
    reverseDoCalcurate() {
      if (this.isSamePerson()) {
        alert("和了者と支払人が同一人物です。");
      } else {
        this.doCalcurate = !this.doCalcurate;
      }
    },
    reverseDoDispHistory() {
      this.doDispHistory = !this.doDispHistory;
    },
    //ノーテン罰符の計算と記録
    deployTokutenTenpai(retTenpaiArr) {
      retTenpaiArr.map((tenpaiInfo) => {
        this.calcuVar[tenpaiInfo.name].plus = tenpaiInfo["plusVal"];
        this.calcuVar[tenpaiInfo.name].minus = tenpaiInfo["minusVal"];
      });
      const bappuUketori = retTenpaiArr.filter(
        (tenpaiInfo) => tenpaiInfo["plusVal"] > 0
      );
      const bappuShiharai = retTenpaiArr.filter(
        (tenpaiInfo) => tenpaiInfo["minusVal"] > 0
      );
      const honba = this.honba === "" ? this.honba : this.honba + "本場";
      const time = this.ba + this.kyoku + "局" + honba;
      let tokuten = 0;
      if (0 < bappuUketori.length && bappuUketori.length < 4) {
        tokuten = 3000 / bappuUketori.length;
      }
      let from = "";
      let to = "";
      let yaku = "流局";
      if (bappuUketori.length > 0) {
        from = bappuShiharai
          .map((tenpaiInfo) => this.calcuVar[tenpaiInfo.name].name)
          .join(",");
        to = bappuUketori
          .map((tenpaiInfo) => this.calcuVar[tenpaiInfo.name].name)
          .join(",");
        yaku = "ノーテン罰符";
      }
      this.kyokuKekkaInfo = {
        time: time,
        from: from,
        to: to,
        yaku: yaku,
        score: tokuten,
      };
      this.reverseDoCalcurate();
    },
    isSamePerson() {
      return this.shiharaiNin === this.horasha;
    },
    makeHoraHistoryInfo(yakuInfo, tokuten) {
      const honba = this.honba === "" ? this.honba : this.honba + "本場";
      const time = this.ba + this.kyoku + "局" + honba;
      let to = this.horasha;
      let from = this.shiharaiNin;
      let yaku = "";
      if (yakuInfo.length > 0) {
        yaku = yakuInfo.join(",");
        if (yaku.indexOf("ドラ") === -1) {
          yaku = yaku.slice(0, -1);
        }
      } else if (tokuten === 0) {
        yaku = "流局";
        to = "";
        from = "";
      }
      this.kyokuKekkaInfo = {
        time: time,
        from: from,
        to: to,
        yaku: yaku,
        score: tokuten,
      };
    },
    async deployTokutenResult(horaInfo) {
      const agari =
        this.shiharaiNin === "All" ? MAHJAN_FUNC.TUMO : MAHJAN_FUNC.RON;
      const basuu = this.honba === "" ? 0 : Number(this.honba);
      const oyako =
        this.oya === this.horasha ? MAHJAN_FUNC.OYA : MAHJAN_FUNC.KO;
      const isInvalidHuHan = MAHJAN_FUNC.isInvalidHuHan(
        horaInfo["hu"],
        horaInfo["han"],
        agari
      );
      if (typeof isInvalidHuHan !== "undefined") {
        alert(isInvalidHuHan);
        return;
      }
      const tokuten = MAHJAN_FUNC.getTokuten(
        basuu,
        this.reachBou,
        horaInfo["hu"] + horaInfo["han"],
        horaInfo["han"],
        oyako,
        agari
      );
      let totalTokuten = 0;
      this.calcVarLbArr.map((label) => {
        this.calcuVar[label].plus = 0;
        this.calcuVar[label].minus = 0;
        const isHorasha = this.horasha === this.calcuVar[label].name;
        const isTumo = this.shiharaiNin === "All";
        const isOya = this.calcuVar[label].name === this.oya; //主語は自分
        const isOyaHorasha = this.horasha === this.oya;
        const isHojusya = this.shiharaiNin === this.calcuVar[label].name;
        //自摸は上がった人以外全員が支払人だけど、ロンは特定の１人だけが支払人
        if (isHorasha && isTumo && isOya) {
          this.calcuVar[label].plus =
            tokuten.tumoKoShiharai * 3 + tokuten.kyotaku;
          totalTokuten = this.calcuVar[label].plus;
        } else if (isHorasha && isTumo && !isOya) {
          this.calcuVar[label].plus =
            tokuten.tumoOyaShiharai +
            tokuten.tumoKoShiharai * 2 +
            tokuten.kyotaku;
          totalTokuten = this.calcuVar[label].plus;
        } else if (isHorasha && !isTumo && isOya) {
          this.calcuVar[label].plus = tokuten.koShiharai + tokuten.kyotaku;
          totalTokuten = this.calcuVar[label].plus;
        } else if (isHorasha && !isTumo && !isOya) {
          this.calcuVar[label].plus = tokuten.oyaShiharai + tokuten.kyotaku;
          totalTokuten = this.calcuVar[label].plus;
        } else if (!isHorasha && isTumo && isOya) {
          this.calcuVar[label].minus = tokuten.tumoOyaShiharai;
        } else if (!isHorasha && isTumo && !isOya) {
          this.calcuVar[label].minus = tokuten.tumoKoShiharai;
        } else if (!isHorasha && !isTumo && isOya && isHojusya) {
          this.calcuVar[label].minus = tokuten.oyaShiharai;
        } else if (!isHorasha && !isTumo && !isOya && isHojusya) {
          //ロンの時、和了者も支払人も子という状況があるが、その場合は親の得点に精算額が入ってる
          if (isOyaHorasha) {
            this.calcuVar[label].minus = tokuten.koShiharai;
          } else {
            this.calcuVar[label].minus = tokuten.oyaShiharai;
          }
        }
      });
      this.makeHoraHistoryInfo(horaInfo.yakuInfo, totalTokuten);
      this.doCalcurate = !this.doCalcurate;
    },
  },
};
</script>