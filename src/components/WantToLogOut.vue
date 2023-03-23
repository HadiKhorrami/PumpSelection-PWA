<template>
  <v-row justify="center">
    <v-dialog v-model="WantToLogOut" max-width="290" style="font-family: IranSans;text-align: center;padding-top: 20px;" persistent>
      <v-card>
        <v-card-text style="font-family: IranSans;text-align: center;padding-top: 20px">
          Do you want to log out?
        </v-card-text>

        <v-card-actions style="font-family: IranSans;">
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="WantToLogOut = false" style="float: left;position: fixed">No</v-btn>
          <v-btn color="green darken-1" text @click="GoToHome()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "WantToLogOut",
  props:{
    WantToLogOut:false
  },
  methods:{
    GoToHome(){
      document.cookie = "firstName=" + "";
      document.cookie = "lastName=" + "";
      this.$router.push("/Login")
    }
  }
}
</script>

<style scoped>

</style>
