<template>
  <v-container>
    <v-row dense v-if="reviews.length > 0">
      <v-col cols="12" v-for="review in reviews" :key="review.docId">
        <v-card class="mx-auto">
          <v-card-title>
            <v-avatar size="30" class="mr-2">
              <img alt="user" :src="review.photoUrl" />
            </v-avatar>
            <span class="text-h3 font-weight-light mr-2">{{
              review.uname
            }}</span>
            <v-spacer></v-spacer>
            <span class="caption">{{ review.commentdate }}</span>
          </v-card-title>
          <v-card-text class="text-h5">
            <v-row dense>
              <DispRating :avgStar="review.rating"></DispRating>
            </v-row>
            <v-container>
              <v-row v-text="review.comment"> </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense class="mb-2" v-if="reviews.length === 0">
      <v-col cols="12">
        <div align="center">コメントはまだありません。</div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import DispRating from "./DispRating";
export default {
  name: "CommentCard",
  components: {
    DispRating,
  },
  props: ["reviews"],
};
</script>