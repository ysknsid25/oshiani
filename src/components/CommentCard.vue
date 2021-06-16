<template>
  <v-container>
    <v-row>
      <v-card class="mx-auto">
        <v-card-title>
          <v-avatar size="30" class="mr-2">
            <img
              alt="user"
              src="https://pbs.twimg.com/profile_images/1347880205931532291/8I5F2O7j_normal.jpg"
            />
          </v-avatar>
          <span class="text-h3 font-weight-light mr-2">Evan You</span>
          <v-spacer></v-spacer>
          <span class="caption">2021/06/16 09:00:01</span>
        </v-card-title>
        <v-card-text class="text-h5">
          "Turns out semicolon-less style is easier and safer in TS because most
          gotcha edge cases are type invalid as well."
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "CommentCard",
};
</script>