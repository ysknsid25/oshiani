<template>
  <v-card flat width="800">
    <v-card-text class="d-flex">
      <v-avatar rounded size="120" class="me-6">
        <v-img
          :src="
            userInfo.photoUrl === ''
              ? require('@/assets/upper_body-2.png')
              : userInfo.photoUrl
          "
        ></v-img>
      </v-avatar>
      <div class="ml-2">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="userInfo.displayName"
              label="Username"
              dense
              outlined
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="userInfo.providerId"
              dense
              label="Provider"
              outlined
              readonly
            ></v-text-field>
          </v-col>
          <v-col md="6" cols="12">
            <v-text-field
              v-model="userInfo.email"
              label="E-mail"
              dense
              outlined
              readonly
              class="mt-4"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-checkbox
              color="red"
              v-model="userInfo.emailVerified"
              :label="
                userInfo.emailVerified
                  ? '認証済みのメールアドレスです。'
                  : userInfo.providerId + 'でメールアドレスを認証してください。'
              "
              readonly
            ></v-checkbox>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "AccountInfo",
  props: ["userInfo"],
};
</script>
