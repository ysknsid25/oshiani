<template>
  <v-row
    v-if="
      $vuetify.breakpoint.md || $vuetify.breakpoint.lg || $vuetify.breakpoint.xl
    "
    justify="center"
    class="mb-2"
  >
    <iframe
      src="https://rcm-fe.amazon-adsystem.com/e/cm?o=9&p=48&l=ur1&category=primevideo&banner=1G9HZN3QCQ5HPHV65ZG2&f=ifr&linkID=b76f209ffceaae613fcf68450144edea&t=oshiani-22&tracking_id=oshiani-22"
      width="728"
      height="90"
      scrolling="no"
      border="0"
      marginwidth="0"
      style="border: none"
      frameborder="0"
    ></iframe>
  </v-row>
</template>
<script>
export default {
  name: "AmazonAssociateBanar",
};
</script>