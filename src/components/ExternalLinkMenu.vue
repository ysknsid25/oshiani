<template>
  <v-menu>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        v-on="on"
        v-if="isExistpages(officialSiteUrl, wikipediaUrl)"
      >
        <v-icon>fas fa-external-link-alt</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-if="officialSiteUrl !== ''">
        <v-list-item-title>
          <v-btn text :href="officialSiteUrl"> official page </v-btn>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="wikipediaUrl !== ''">
        <v-list-item-title>
          <v-btn text :href="wikipediaUrl"> wikipedia </v-btn>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  name: "ExternalLinkMenu",
  props: ["officialSiteUrl", "wikipediaUrl"],
  methods: {
    isExistpages(official, wiki) {
      return official !== "" || wiki !== "";
    },
  },
};
</script>