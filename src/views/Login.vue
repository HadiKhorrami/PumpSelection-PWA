<template>
  <v-app style="height: 100%; width: 100%; top: 0;background-color: #424242;position: fixed">
    <v-img id="iMg" src="../assets/petco-logo/petco-5-256.png"></v-img>
    <v-form id="form" ref="entryForm" @submit.prevent="login()">
    <v-text-field v-model="screenName" id="textField" solo rounded  light clearable dark :rules="searchRules" prepend-inner-icon="mdi-account" label="Username" background-color="hsl(0deg 0% 100% / 21%)" color="white" style="width:85%;position:relative;margin-top: 30%;margin-left: 10%"></v-text-field>
    <v-text-field v-model="password" id="textField" solo rounded  light clearable dark :rules="searchRules" prepend-inner-icon="mdi-lock" label="Password" type="password" background-color="hsl(0deg 0% 100% / 21%)" color="white" style="width:85%;position:relative;top: 0px;margin-left: 10%"></v-text-field>
    <v-btn solo rounded dark color="aquamarine" id="btn" @click="login()">Sign In</v-btn>
      <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 50px;font-family: IranSans">
        <v-icon>{{ snackIcon }}</v-icon>
        {{ snackText }}
      </v-snackbar>
        <v-progress-circular id="progress" v-if="progress" :size="50" color="amber" indeterminate></v-progress-circular>
    </v-form>
    <router-view/>
  </v-app>
</template>

<script>
import axios from "axios";
import App from '../App.vue'

const routes = {
  '/App': App
}
export default {
  name: "Login",
  data: () => ({
    searchRules:[],
    screenName:"",
    password:"",
    userId:"",
    firstName:"",
    lastName:"",
    snackbar:false,
    snackText:"",
    snackIcon:"",
    snackColor:"",
    progress:false
  }),
  mounted() {
    this.checkLogIn();
    this.screenName = '';
    this.password = '';
    console.log(this.getCookie("firstName"))
  },
  methods:{
    login(){
      var th = this;
      this.searchRules = [v => !!v || "Please Fill",]
      let self = this
      setTimeout(function () {
        if (self.$refs.entryForm.validate()){
          self.progress = true;
          const formData = new FormData();
          formData.append('companyId', 20155);
          formData.append('screenName', self.screenName);
          formData.append('cmd', "{'/user/get-user-by-screen-name':{}}");
          axios.post('*************', formData,{auth: {username: self.screenName, password: self.password}}
          ).then(response => {
            if(!response.data.exception){
              self.progress = false;
              self.snackColor = "success";
              self.snackText = "Login Successful";
              self.snackIcon = "mdi-check-circle";
              self.snackbar = true;
              setTimeout(self.goToApp,2000);
              var today = new Date();
              var expire = new Date();
              expire.setTime(today.getTime() + 3600000*24*14);
              document.cookie = "firstName=" + response.data.firstName + ";expires="+expire.toGMTString();
              document.cookie = "lastName=" + response.data.lastName + ";expires="+expire.toGMTString();
            }else{
              self.snackColor = "red accent-2";
              self.snackText = "username or password is incorrect";
              self.snackIcon = "mdi-close-circle";
              self.snackbar = true;
            }
            console.log(response)
          }).catch(error => {
            self.snackColor = "red accent-2";
            self.snackText = error.message;
            self.snackIcon = "mdi-close-circle";
            self.snackbar = true;
            self.progress = false;
            console.error("There was an error!", error);
          });
        }
      })
    },
    goToApp(){
      this.$router.push('/App')
    },
    checkLogIn(){
      if(this.getCookie("firstName")!="" && this.getCookie("firstName")!=undefined && this.getCookie("firstName")!='undefined'){
        this.$router.push("/App");
      }
    },
    getCookie(name) {
      let cookie = {};
      document.cookie.split(';').forEach(function(el) {
        let [k] = el.split('=');
        cookie[k.trim()] = el.substring(k.length + 1);
      })
      return cookie[name];
    }
  }
}
</script>

<style>
#iMg{
  width: 120px;
  max-height: 120px;
  margin-left: 35%;
  margin-top: 20%;
}

#btn{
  position: relative;
  width:80%;
  height:45px;
  bottom: 0;
  margin-left: 10%;
  background-color: rgb(32 194 32 / 24%);
  color: rgba(63, 255, 0, 0.98);
}
#progress{
  height: 50px;
  width: 50px;
  position: relative;
  height: 50px;
  width: 50px;
  margin-left: 45%;
  margin-top: 20%;
}
.v-application--is-ltr .v-text-field .v-input__append-inner{
  top:0px !important;
}
.v-text-field--filled:not(.v-text-field--single-line) input{
  margin-top: 0 !important;
}

</style>
