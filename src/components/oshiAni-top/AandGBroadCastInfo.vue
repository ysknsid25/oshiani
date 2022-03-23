<template>
  <v-card class="mx-auto">
    <v-card-title>
      <v-icon class="mr-4 primary--text">fas fa-broadcast-tower</v-icon>
      <span class="kagerou thirdColor--text">超!A&G Now ON Air</span>
    </v-card-title>
    <v-card-text>
      <div v-if="loading" class="pt-4" align="center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <div v-if="!loading">
        <p class="pt-2 text-subtitle-1">
          {{ nowPlayingProgram.title }}
        </p>
        <p>
          <v-icon class="mr-2" size="15"> far fa-clock</v-icon
          ><span>{{ nowPlayingProgram.time }}</span>
        </p>
        <div>
          <v-icon class="mr-2" size="15"> fas fa-user-friends</v-icon>
          {{ nowPlayingProgram.personality }}
        </div>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn icon color="primary" @click="getNextProgram(-1)">
        <v-icon> fas fa-chevron-left </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="getNowPlayingAandG()"> now </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon color="primary" @click="getNextProgram(1)">
        <v-icon> fas fa-chevron-right </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { getProgramList } from "../../firestoreaccess/agprogramList";
import "../../assets/scss/style.scss";
export default {
  name: "AandGBroadCastInfo",

  data: () => ({
    loading: true,
    nowPlayingDialog: false,
    programList: [],
    nowPlayingProgram: {
      title: "放送休止",
      time: "",
      personality: "",
    },
    nowPlayingProgramIndex: -1,
  }),
  mounted: function () {
    this.getNowPlayingAandG();
  },
  methods: {
    async getNowPlayingAandG() {
      this.loading = true;
      const tmpProgramList = await getProgramList();
      this.programList = tmpProgramList.agprogramList;
      //console.log(this.programList);
      //console.log(this.programList.agprogramList[0]);
      this.findNowPlayingProgram();
      //console.log(this.nowPlayingProgramIndex);
      this.setNowPlayingProgramInfo(this.nowPlayingProgramIndex);
      this.loading = false;
    },
    findNowPlayingProgram() {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const isNowPlaying = (programInfo) => {
        const strHour = this.getZeroUmeStr(hours);
        const strMinute = this.getZeroUmeStr(minutes);
        const now = "" + strHour + strMinute;
        return programInfo.beginTime <= now && now < programInfo.endTime;
      };
      const nowPlayingIndex = this.programList.findIndex(isNowPlaying);
      //console.log(nowPlayingIndex);
      if (nowPlayingIndex !== -1) {
        this.nowPlayingProgramIndex = nowPlayingIndex;
      }
    },
    setNowPlayingProgramInfo(targetIndex) {
      if (this.programList.length > 0 && targetIndex !== -1) {
        const programInfo = this.programList[targetIndex];
        const title = programInfo.title;
        const personality = programInfo.personality;
        const time = this.getTime(programInfo.beginTime, programInfo.endTime);
        this.nowPlayingProgram = {
          title: title,
          time: time,
          personality: personality,
        };
      }
    },
    getTime(beginTime, endTime) {
      let colonBeginTime = beginTime;
      let colonEndTime = endTime;
      if (colonBeginTime !== "" && colonBeginTime.length === 4) {
        colonBeginTime =
          colonBeginTime.slice(0, 2) + ":" + colonBeginTime.slice(2);
      }
      if (colonEndTime !== "" && colonEndTime.length === 4) {
        colonEndTime = colonEndTime.slice(0, 2) + ":" + colonEndTime.slice(2);
      }
      if (colonBeginTime !== "" && colonEndTime !== "") {
        return colonBeginTime + "~" + colonEndTime;
      } else {
        return "";
      }
    },
    getNextProgram(next) {
      const lastIndex = this.programList.length - 1;
      const targetIndex = this.nowPlayingProgramIndex + next;
      if (targetIndex !== lastIndex) {
        this.setNowPlayingProgramInfo(targetIndex);
        this.nowPlayingProgramIndex = targetIndex;
      }
    },
    getZeroUmeStr(time) {
      if (time < 10) {
        return "0" + time;
      }
      return time;
    },
  },
};
</script>