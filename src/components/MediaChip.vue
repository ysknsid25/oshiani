<template>
  <v-chip
    v-if="media !== ''"
    :color="getMediaTypeColor(media)"
    v-text="mediaText === '' ? 'Othre' : mediaText"
  >
  </v-chip>
</template>
<script>
import { mediaType } from "../api/Annict";
export default {
  name: "MediaChip",
  props: ["media", "mediaText"],

  methods: {
    getMediaTypeColor(media) {
      if (media === "") {
        return media;
      }
      return mediaType[media];
    },
  },
};
</script>