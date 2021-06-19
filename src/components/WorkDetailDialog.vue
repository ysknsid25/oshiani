<template>
  <v-dialog v-model="detailDialog" max-width="800">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on" @click="getDetailInfo()">
        <v-icon>fas fa-ellipsis-v</v-icon>
      </v-btn>
    </template>
    <v-card class="mx-auto">
      <v-img
        :src="getImageUrl(workInfo.images.recommended_url)"
        max-height="600px"
      >
      </v-img>
      <v-card-title>
        {{ workInfo.title }}
        <v-spacer></v-spacer>
        <ShareButton
          :title="workInfo.title"
          :hashTag="workInfo.twitter_hashtag"
          :officialSite="workInfo.official_site_url"
        ></ShareButton>
        <OfficialTwitterButton
          :twitterUserName="workInfo.twitter_username"
        ></OfficialTwitterButton>
        <BookmarkButton
          :isLogined="isLogined"
          :workId="workInfo.id"
          class="mr-2"
        ></BookmarkButton>
      </v-card-title>
      <v-card-text>
        <v-container class="my-2">
          <v-row>
            <MediaChip
              :media="workInfo.media"
              :mediaText="workInfo.media_text"
            ></MediaChip>
            <v-spacer></v-spacer>
            <DispRating :reviewInfo="reviewInfo"></DispRating>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <ExternalLinkMenu
              :officialSiteUrl="workInfo.official_site_url"
              :wikipediaUrl="workInfo.wikipedia_url"
            ></ExternalLinkMenu>
          </v-row>
        </v-container>

        <v-expansion-panels class="mt-2">
          <v-expansion-panel>
            <v-expansion-panel-header>キャスト</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-simple-table :v-if="!castLoading && isExistsCastInfo">
                <thead>
                  <tr>
                    <th class="text-left">登場人物</th>
                    <th class="text-left">声優</th>
                    <th class="text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="cast in casts" :key="cast.id">
                    <td>{{ cast.character.name }}</td>
                    <td>{{ cast.name }}</td>
                    <td>
                      <CastExternalInfo
                        :officialSiteUrl="cast.person.url"
                        :wikipediaUrl="cast.person.wikipedia_url"
                        :twitterUrl="cast.person.twitter_username"
                      ></CastExternalInfo>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
              <div align="center" v-if="!castLoading && !isExistsCastInfo">
                No Data
              </div>
              <div align="center" v-if="castLoading">
                <v-progress-circular
                  indeterminate
                  color="indigo"
                ></v-progress-circular>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header> スタッフ</v-expansion-panel-header>
            <v-expansion-panel-content>
              <div :v-if="!staffLoading && isExistsStaffInfo">
                <v-simple-table>
                  <thead>
                    <tr>
                      <th class="text-left">ロール</th>
                      <th class="text-left">氏名</th>
                      <th class="text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="staff in staffs" :key="staff.id">
                      <td>{{ staff.role_text }}</td>
                      <td>{{ staff.name }}</td>
                      <td>
                        <CastExternalInfo
                          v-if="typeof staff.person !== 'undefined'"
                          :officialSiteUrl="staff.person.url"
                          :wikipediaUrl="staff.person.wikipedia_url"
                          :twitterUrl="staff.person.twitter_username"
                        ></CastExternalInfo>
                        <CastExternalInfo
                          v-if="typeof staff.organization !== 'undefined'"
                          :officialSiteUrl="staff.organization.url"
                          :wikipediaUrl="staff.organization.wikipedia_url"
                          :twitterUrl="staff.organization.twitter_username"
                        ></CastExternalInfo>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </div>
              <div align="center" v-if="!staffLoading && !isExistsStaffInfo">
                No Data
              </div>
              <div align="center" v-if="staffLoading">
                <v-progress-circular
                  indeterminate
                  color="indigo"
                ></v-progress-circular>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>レビュー</v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-if="isLogined">
                <v-row>
                  <v-rating
                    color="yellow"
                    background-color="grey darken-1"
                    half-increments
                    hover
                    length="5"
                    size="20"
                    v-model="rate"
                  ></v-rating>
                  ({{ rate }})
                </v-row>
                <v-row class="mt-4">
                  <v-textarea
                    outlined
                    counter="1000"
                    name="comment"
                    label="コメントする"
                    :value="comment"
                    :rules="rules"
                  ></v-textarea>
                </v-row>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-btn
                    outlined
                    tile
                    color="secondary"
                    dark
                    width="100"
                    @click="hoge"
                    >投稿する</v-btn
                  >
                </v-row>
              </div>
              <div align="center" v-if="!isLogined">
                レビューするためにはログインが必要です。
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="show = !show">
              <v-icon>{{
                show ? "mdi-chevron-up" : "mdi-chevron-down"
              }}</v-icon>
            </v-btn>
          </template>
          <span>コメント一覧</span>
        </v-tooltip>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="show">
          <CommentCard></CommentCard>
        </div>
      </v-expand-transition>
    </v-card>
  </v-dialog>
</template>
<script>
import ExternalLinkMenu from "./ExternalLinkMenu";
import CastExternalInfo from "./CastExternalInfo";
import MediaChip from "./MediaChip";
import { getCastsInfoUrl, getStaffsInfoUrl, getImage } from "../api/Annict";
import ShareButton from "./ShareButton";
import OfficialTwitterButton from "./OfficialTwitterButton";
import DispRating from "./DispRating";
import BookmarkButton from "./BookmarkButton";
import CommentCard from "./CommentCard";
export default {
  name: "WorkDetailDialog",
  components: {
    ExternalLinkMenu,
    CastExternalInfo,
    MediaChip,
    ShareButton,
    OfficialTwitterButton,
    DispRating,
    BookmarkButton,
    CommentCard,
  },
  props: ["workInfo", "reviewInfo", "isLogined"],

  data: () => ({
    detailDialog: false,
    castLoading: false,
    staffLoading: false,
    show: false,
    casts: [],
    staffs: [],
    isExistsCastInfo: false,
    isExistsStaffInfo: false,
    rules: [(v) => v.length <= 1000 || "Max 1000 characters"],
    comment: "",
    rate: 3,
  }),

  methods: {
    getImageUrl(url) {
      return getImage(url);
    },
    async getDetailInfo() {
      await this.getCastsInfo();
      await this.getStaffsInfo();
    },
    async getCastsInfo() {
      this.castLoading = true;
      const targetUrl = getCastsInfoUrl(this.workInfo.id);
      await this.axios
        .get(targetUrl)
        .then((response) => {
          //console.log("@@1");
          //console.log(response.data.casts);
          this.casts = response.data.casts;
          this.isExistCastInfo(response.data.total_count);
        })
        .catch((error) => {
          console.log(error);
        });
      this.castLoading = false;
    },
    async getStaffsInfo() {
      this.staffLoading = true;
      const targetUrl = getStaffsInfoUrl(this.workInfo.id);
      await this.axios
        .get(targetUrl)
        .then((response) => {
          //console.log("@@1");
          //console.log(response.data.staffs);
          this.staffs = response.data.staffs;
          this.isExistStaffInfo(response.data.total_count);
        })
        .catch((error) => {
          console.log(error);
        });
      this.staffLoading = false;
    },
    isExistCastInfo(count) {
      this.isExistsCastInfo = count !== 0;
    },
    isExistStaffInfo(count) {
      this.isExistsStaffInfo = count !== 0;
    },
    hoge() {
      alert(this.rate);
    },
  },
};
</script>