<template>
  <v-dialog v-model="detailDialog" max-width="800">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>fas fa-ellipsis-v</v-icon>
      </v-btn>
    </template>
    <v-card>
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
        <v-container>
          <v-row>
            <MediaChip
              :media="workInfo.media"
              :mediaText="workInfo.media_text"
            ></MediaChip>
            <v-spacer></v-spacer>
            <DispRating :reviewInfo="reviewInfo"></DispRating>
          </v-row>
        </v-container>

        <v-expansion-panels class="mt-2">
          <v-expansion-panel>
            <v-expansion-panel-header>キャスト</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-simple-table :v-if="!castLoading && isExistsCastInfo">
                <template v-slot:default>
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
                </template>
              </v-simple-table>
              <div align="center" v-if="castLoading && !isExistsCastInfo">
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
        </v-expansion-panels>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <ExternalLinkMenu
          :officialSiteUrl="workInfo.official_site_url"
          :wikipediaUrl="workInfo.wikipedia_url"
        ></ExternalLinkMenu>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import ExternalLinkMenu from "./ExternalLinkMenu";
import CastExternalInfo from "./CastExternalInfo";
import MediaChip from "./MediaChip";
import { getCastsInfoUrl } from "../api/Annict";
import ShareButton from "./ShareButton";
import OfficialTwitterButton from "./OfficialTwitterButton";
import DispRating from "./DispRating";
import BookmarkButton from "./BookmarkButton";
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
  },
  props: ["workInfo", "reviewInfo", "isLogined"],

  data: () => ({
    detailDialog: false,
    castLoading: false,
    casts: [],
    isExistsCastInfo: true,
  }),
  mounted: async function () {
    await this.getCastsInfo();
  },
  methods: {
    getImageUrl(url) {
      if (url !== "") {
        return url;
      }
      return "https://placehold.jp/600x300.png";
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
          this.isExistPage(response.data.total_count);
        })
        .catch((error) => {
          console.log("@@2");
          console.log(error);
        });
      this.castLoading = false;
    },
    isExistPage(count) {
      this.isExistsCastInfo = count !== 0;
    },
  },
};
</script>