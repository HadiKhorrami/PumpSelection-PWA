<template>
  <v-app style="height: 100%; width: 100%; top: 0;background-color: #DDDDDD;position: fixed">
    <div class="custom-shape-divider-top-1668511637">
      <v-img id="logo" src="./assets/petco-logo/petco-2-256.png"></v-img>
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">

<!--        <path d="M1200 0L0 0 598.97 114.72 1200 0z" class="shape-fill"></path>-->
      </svg>
      <v-card id="tabCard">
        <v-tabs  background-color="#F05454"  center-active dark>
          <v-tab class="tab" @click="listClick()">{{$t("Main.ListOfPumpTypeFilter")}}</v-tab>
          <v-tab class="tab" @click="filterClick()">{{$t("Main.SearchPump")}}</v-tab>
        </v-tabs>

        <v-overflow-btn v-if="filterTabValue===false" v-model="searchInput" :items="searchArray" :item-value="searchValue" :item-text="searchText" id="searchField"
                        @click="searchFieldClick()"   @change="search()" return-object
                        style="width:80%;font-family: IranSans;position: relative;margin-left: 10%;border-radius: 10px;margin-top: 15px;"
                        v-bind:label="$t('Main.Search')"
                        editable filled background-color="white" append-icon="mdi-magnify">
        </v-overflow-btn>
        <v-icon v-if="pumpsTabValue===true" size="40px" style="height: fit-content;margin-left: 10px;float: left" @click="listClick()">mdi-arrow-left-circle</v-icon>
      </v-card>

    </div>
    <div id="mainDiv">
       <PumpTypes :PumpTypes="PumpTypes" v-if="listTabValue" :types="types" @goToPumps="pumpsTypesClick"/>
       <Pumps :Pumps="Pumps" v-if="pumpsTabValue" :pumps="pumps"/>
       <SearchPump :SearchPump="SearchPump" v-if="filterTabValue" :types="types" :expansion="expansion"/>
      <p id="emptyTypes" v-if="types.length===0">No type found</p>
      <p id="emptyPump" v-if="pumps.length===0 && pumpsTabValue===true">No pump found</p>
      <WantToLogOut :WantToLogOut="WantToLogOut"/>
      <v-progress-circular v-if="progress && filterTabValue===false" :size="50" style="height: 50px;width: 50px;position: absolute;bottom: 200px;left: 45%;" color="green" indeterminate></v-progress-circular>
    </div>
    <v-speed-dial style="font-family: IranSans"  v-model="fab" left transition="slide-x-reverse-transition">
      <template v-slot:activator>
        <v-btn id="fab" v-model="fab" color="blue darken-2" dark fab>
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-account-circle
          </v-icon>
        </v-btn>
      </template>
      <v-btn dark  color="red" style="position: relative;right: 50px;font-size: small" @click="WantToLogOut=!WantToLogOut;WantToLogOut=true">
        <v-icon>mdi-exit-to-app</v-icon>&nbsp Exit
      </v-btn>
      <v-btn  dark color="green" style="position: relative;right: 50px;">
        <v-icon>mdi-account</v-icon>
        &nbsp {{ getCookie("firstName") }} {{ getCookie("lastName") }}
      </v-btn>
    </v-speed-dial>

    <router-view></router-view>

  </v-app>
</template>
<script>
import PumpTypes from './components/PumpTypes.vue'
import Pumps from './components/Pumps.vue'
import SearchPump from './components/SearchPump.vue'
import WantToLogOut from './components/WantToLogOut.vue'
import $ from "jquery"
import axios from 'axios'

export default {
  props:{
    PumpTypes:false,
    Pumps:false,
    SearchPump:false,
    expansion:true,
  },
  data: () => ({
    listTabValue:true,
    pumpsTabValue:false,
    filterTabValue:false,
    fab:false,
    WantToLogOut:false,
    progress:false,
    types:[],
    pumps:[],
    pumpsArray:[],
    searchInput:"",
    searchArray:[],
    searchValue:"",
    searchText:"",
  }),
  components:{
    PumpTypes,
    Pumps,
    SearchPump,
    WantToLogOut
  },

  mounted() {

    if(this.getCookie("firstName")===""){
      this.$router.push("/Login")
    }
    this.listClick();
    this.progress = true;
  },
  methods: {
    listClick(){
      this.listTabValue = true;
      this.pumpsTabValue = false;
      this.filterTabValue = false;
      this.WantToLogOut=false;
      this.searchInput = '';
      this.getPumpTypes();
      $('.custom-shape-divider-top-1668511637').css("height","200px")
      $('#mainDiv').css("height","75%")
      $('#emptyPump').css("visibility","hidden")
      $('#emptyTypes').css("visibility","visible")
    },
    pumpsTypesClick(pumps){
      this.pumpsArray = pumps;
      this.pumps = pumps;
      this.pumpsTabValue = true;
      this.listTabValue = false;
      this.filterTabValue = false;
      this.searchArray = this.pumps;
      this.searchValue = "pumpName";
      this.searchText = "pumpName";
      $('#mainDiv').css("height","68%")
      $('#emptyPump').css("visibility","visible")
      $('#emptyTypes').css("visibility","hidden")
      $('#mainDiv').scrollTop(0)
    },
    filterClick(){
      this.filterTabValue = true;
      this.listTabValue = false;
      this.pumpsTabValue = false;
      this.WantToLogOut=false;
      $('.custom-shape-divider-top-1668511637').css("height","fit-content")
      $('#mainDiv').css("height","83%")
      $('#emptyPump').css("visibility","hidden")
      $('#emptyTypes').css("visibility","hidden")
    },
    search(){
      var th = this;
      console.log(th.searchInput)
      if(this.listTabValue===true){
        var filtered  =  this.types.filter(type => type.pumpTypeName.startsWith(th.searchInput.pumpTypeName))
        this.types = filtered;
      }else{
        var filtered  =  this.pumpsArray.filter(pump => pump.pumpName.startsWith(th.searchInput.pumpName))
        this.pumps = filtered;
      }
    },
    getPumpTypes(){
      const formData = new FormData();
      formData.append('cmd', "{'/*************.pumptype/get-pump-types':{}}");
      axios.post( '*************', formData,{auth:{username:"aseyfodin", password:"Gro693ES147"}}
      ).then(response => {
          this.progress = false;
          this.types = response.data;
          this.searchArray = this.types;
          this.searchValue = "pumpTypeId";
          this.searchText = "pumpTypeName";
          console.log(this.searchArray)
        console.log(this.types)
      }).catch(error => {
        this.errorMessage = error.message;
        console.error("There was an error!", error);
      });
    },
    searchFieldClick(){
      if(this.listTabValue===true){
        this.getPumpTypes();
      }else{
        this.pumps = this.pumpsArray;
        this.searchValue = "pumpName";
        this.searchText = "pumpName";
      }
    },
    GoToHome(){
      document.cookie = "firstName=" + "";
      document.cookie = "lastName=" + "";
      this.$router.push("/Login")
    },
    getCookie(name) {
      let cookie = {};
      document.cookie.split(';').forEach(function(el) {
        let [k] = el.split('=');
        cookie[k.trim()] = el.substring(k.length + 1);
      })
      return cookie[name];
    }
  },
}
</script>
<style>
#app{
  background-color: #DDDDDD;
}
#mainDiv{
  width: 100%;
  height: 66%;
  position: relative;
  background-color: #DDDDDD;
  overflow: scroll;
  margin-top: auto;
  position: relative;
}
#tabCard{
  width: 100%;
  height: fit-content;
  background-color: #DDDD;
  margin-top: -10px;
  position: fixed;
}
.tab{
  width:50%;
}
#logo{
  height: 50px;
  width: 50px;
  position: absolute;
  right: 44%;
  top: 5px;
  z-index: 1000;
  animation: move 15s linear infinite;
}
@keyframes move {
0 {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
}
#searchField{
  width:50%;
  font-family: IranSans;
  border-radius: 10px
}
#fab{
  position: fixed;
  bottom: 10px;
  left: 10px;
  background-color: yellowgreen;
}
#emptyTypes{
  position: absolute;
  top: 20%;
  left: 35%;
  font-size: x-large;
}
#emptyPump{
  position: absolute;
  top: 20%;
  left: 25%;
  font-size: x-large;
}
.custom-shape-divider-top-1668511637 {
  position: absolute;
  height: 200px;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
}

.custom-shape-divider-top-1668511637 svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 500px;
}

.custom-shape-divider-top-1668511637 .shape-fill {
  fill: #30475E;
}

/** For mobile devices **/
@media (max-width: 767px) {
  .custom-shape-divider-top-1668511637 svg {
    width: calc(100% + 1.3px);
    height: 70px;
  }
  @font-face {
    font-family: "IranSans";
    src: url("./assets/fonts/IRANSANS.TTF");
    font-weight: normal;
    font-style: normal;
  }
  .v-text-field--enclosed .v-input__append-inner{
    margin-top: unset !important;
  }
}

</style>
