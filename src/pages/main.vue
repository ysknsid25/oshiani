<template>
  <v-app>
    <NavigationDrawer></NavigationDrawer>
    <v-container class="mb-6">
      <v-row>
        <v-col cols="12"></v-col>
      </v-row>
    </v-container>
    <v-container>
      <router-view></router-view>
    </v-container>
  </v-app>
</template>
<script>
import NavigationDrawer from "../components/navigation/NavigationDrawer";

export default {
  name: "Main",

  components: {
    NavigationDrawer,
  },

  data: () => ({}),

  mounted: function () {},

  methods: {},
};
</script>