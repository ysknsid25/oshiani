<template>
  <v-dialog v-model="nowPlayingDialog" max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="ml-2"
        icon
        v-bind="attrs"
        v-on="on"
        @click="getNowPlayingAandG"
      >
        <v-icon>fas fa-broadcast-tower</v-icon>
      </v-btn>
    </template>
    <v-card class="mx-auto" max-width="400">
      <v-card-text>
        <div v-if="loading" class="pt-4" align="center">
          <v-progress-circular
            indeterminate
            color="indigo"
          ></v-progress-circular>
        </div>
        <div v-if="!loading">
          <div class="pt-4" align="right">超!A&G Now ON Air</div>
          <p class="pt-2 text-h5 text--primary">
            {{ nowPlayingProgram.title }}
          </p>
          <p>{{ nowPlayingProgram.time }}</p>
          <div class="text--primary">
            {{ nowPlayingProgram.personality }}
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="secondary" @click="getNextProgram(-1)">
          previous
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn text color="secondary" @click="getNextProgram(1)"> next </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { getProgramList } from "../firestoreaccess/agprogramList";
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
  methods: {
    async getNowPlayingAandG() {
      const tmpProgramList = await getProgramList();
      this.programList = tmpProgramList.agprogramList;
      console.log(this.programList);
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
        let endMinute = programInfo.endMinute;
        if (endMinute === 0) {
          endMinute = 60;
        }
        return (
          programInfo.beginHour >= hours &&
          hours < programInfo.endHour &&
          programInfo.beginMinute >= minutes &&
          minutes < endMinute
        );
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
  },
};
</script>