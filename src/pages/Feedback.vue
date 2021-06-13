<!-- Google Formsを使ったからもう必要なくなった -->
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <div align="center">
          <v-card elevation="2">
            <v-card-title> FeedBack </v-card-title>
            <v-card-subtitle>
              よろしければFeedBackをお送りください。
            </v-card-subtitle>
            <v-card-text>
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSeF73VLSCklRLGIe-IARZfOQUx9nQBEhMN2GhIBT5NTnR9x0A/viewform?embedded=true"
                width="300"
                height="600"
                frameborder="0"
                marginheight="0"
                marginwidth="0"
                >読み込んでいます…</iframe
              >
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "Feedback",
  data: () => ({}),
};
</script>