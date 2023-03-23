<template>
  <v-app>
    <div id="searchDiv">
      <p v-if="pumps.length===0" style="font-size: 20px;text-align: center;margin-top:40%;position: relative">No Search Result</p>
      <div id="pumpDiv" v-for="p in pumps" @click="getPumpAndPointCalculate(p.pumpId)">
          <v-img id="pumpImg" :src="p.pumpImage"></v-img>
          <p id="typeName">{{p.pumpTypeName}}</p>
          <p id="pumpName">{{p.pumpName}}</p>
          <br>

          <div id="detailDiv">
            <p >{{$t("Pumps.BEPFlow")}} : {{p.capacity}} m3/h</p>
            <p >{{$t("Pumps.BEPPower")}} : {{p.power}} bar</p>
            <div class="vl"></div>
            <p style="position: absolute;margin-left: 165px;top: 15px;">{{$t("Pumps.ShutOffHead")}} : {{p.head}} m</p>
            <p style="position: absolute;margin-left: 165px;top: 55px;">{{$t("Pumps.LiquidTemperature")}} : {{p.temp}} (℃)</p>
          </div>
        </div>
      <v-row justify="center">
        <v-dialog v-model="searchDialog" max-width="400" style="font-family: IranSans;text-align: center;" eager>
          <v-card style="height: 100%;width: 100%;padding: 10px">
              <v-form id="form" ref="entryForm" @submit.prevent="search()" style="margin-top: 10px">
                <v-combobox  class="combobox" v-model="typesCombo" :items="types" item-text="pumpTypeName" item-value="pumpTypeId" label="" multiple outlined light dense rounded return-object
                             v-bind:label="$t('SearchPump.PumpType')"
                             style="width: 90%;position: relative;display: flex;justify-content: center;margin: auto;top:30px;font-family: IranSans"></v-combobox>

                <v-combobox  class="combobox" v-model="liquidCombo" :items="liquid" item-text="name" item-value="name" multiple outlined light dense rounded @click="getLiquidNames()"
                             v-bind:label="$t('SearchPump.LiquidName')"
                             style="width: 90%;position: relative;display: flex;justify-content: center;margin: auto;top:30px;font-family: IranSans"></v-combobox>

                <p style="color: black;margin-top: 30px">{{ $t('SearchPump.SelectionRange') }}</p>

                <v-range-slider v-model="sliderValue" :tick-labels="season" :value="[0,2]" step="0.35" min="0" max="2" ticks="always" tick-size="5" light style="margin: 20px auto;width: 100%"></v-range-slider>

                <v-text-field v-model="capacity" id="textField" :rules="searchRules" style="width: 45%;position: relative;margin-left: 0px;margin-top: 30px" color="blue" v-bind:label="$t('SearchPump.Capacity')" outlined dense  rounded light ></v-text-field>
                <v-text-field v-model="height" id="textField" :rules="searchRules" style="width: 45%;position: relative;float: right;margin-right: 0px;top: -65px;"  v-bind:label="$t('SearchPump.Height')" outlined dense  rounded light></v-text-field>
                <v-text-field v-model="ratedSpeed" id="textField" style="width: 70%;position: relative;margin-left: 13%;top:-60px"  v-bind:label="$t('SearchPump.RatedSpeed')" outlined dense  rounded light></v-text-field>

                <v-btn dark style="position:relative;width:50px;height:60px;bottom: 30px;border-radius: 50%;margin-left: 40%" color="green" @click="search()"><v-icon>mdi-magnify</v-icon></v-btn>
              </v-form>
          </v-card>
        </v-dialog>
      </v-row>
      <Charts :Charts="Charts" :charts="charts" :goToCharts="charts"/>
      <v-progress-circular id="progress" v-if="progress" :size="50" color="green" indeterminate></v-progress-circular>
    </div>
    <v-snackbar  v-model="snackbar" :timeout="3000" :color="snackColor"  rounded="pill" style="text-align: center;margin: auto;min-width: 0 !important;width: 20px;font-family: IranSans;">
      <v-icon>{{ snackIcon }}</v-icon>
      {{ snackText }}
    </v-snackbar>
    <v-btn color="success" dark fab right style="position: fixed;right: 10px;bottom: 10px;" @click="searchDialog=true;Charts=false">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
import axios from "axios";
import $ from "jquery";
import CustomSlider from "vue-custom-range-slider";
import Charts from "../components/Charts.vue"
import "vue-custom-range-slider/dist/vue-custom-range-slider.css";

export default {
  name: "SearchPump",
  props:{
    types:[],
    Charts:false,
    charts:[]
  },
  data: () => ({
    expansion:true,
    searchDialog:false,
    progress:false,
    typesCombo:"",
    typesComboArray:[],
    liquidCombo:[],
    liquidComboArray:[],
    liquid:[],
    pumps:[],
    searchRules:[],
    capacity:"",
    height:"",
    ratedSpeed:0,
    min: 0,
    max: 2,
    slider:"",
    sliderValue: [0, 2],
    season: ['0', '0.35', '0.7', '1', '1.2', '1.3', '2',],
    tickVal: [0, 0.35, 0.7, 1, 1.2, 1.3, 2],
    snackbar:false,
    snackText:"",
    snackIcon:"",
    snackColor:"",
  }),
  components:{
    CustomSlider,
    Charts
  },
  methods:{
    search(){
      var th = this;
      this.Charts=false
      this.searchRules = [
        v => !!v || this.$t("SearchPump.EmptyError"),
      ]
      let self = this
      setTimeout(function () {
        if (self.$refs.entryForm.validate()){
          self.searchDialog=false;
          self.progress=true;
          $('#searchDiv').scrollTop(0);
          if(self.sliderValue[0]===1.05){
            self.sliderValue[0]=1;
          }else if(self.sliderValue[1]===1.05){
            self.sliderValue[1]=1;
          }
          if(self.sliderValue[0]===1.4){
            self.sliderValue[0]=1.2;
          }else if(self.sliderValue[1]===1.4){
            self.sliderValue[1]=1.2;
          }
          if(self.sliderValue[0]===1.75){
            self.sliderValue[0]=1.3;
          }else if(self.sliderValue[1]===1.75){
            self.sliderValue[1]=1.3;
          }

          if(self.typesCombo.length>0) {
            self.typesCombo.forEach(e => {
              th.typesComboArray.push(e.pumpTypeId)
            })
          }
          if(self.liquidCombo.length>0) {
            self.liquidCombo.forEach(e => {
              th.liquidComboArray.push(e.name)
            })
          }

          const formData = new FormData();
          formData.append('companyId', 20155);
          formData.append('pumpTypeId', self.typesComboArray.toString());
          formData.append('liquidName', self.liquidComboArray.toString());
          formData.append('ratedSpeed', parseInt(self.ratedSpeed));
          formData.append('selectionRangeFrom', String(self.sliderValue[0]));
          formData.append('selectionRangeTo', String(self.sliderValue[1]));
          formData.append('capacity', parseFloat(self.capacity));
          formData.append('height', parseFloat(self.height));
          formData.append('cmd', "{'/*************.pump/find-pump':{}}");
          for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]);
          }
          axios.post( '*************', formData,{auth:{
              username:"aseyfodin",
              password:"Gro693ES147"
            }}
          ).then(response => {
            self.progress=false;
            if(response.data.length===0){
              self.snackColor = "red accent-2";
              self.snackText = self.$t("SearchPump.NoPumpFound");
              self.snackIcon = "mdi-close-circle"
              self.snackbar = true;
              self.pumps = [];
            }else{
              self.typesComboArray = [];
              self.liquidComboArray = [];
              self.pumps = response.data;
            }

            console.log(response)
          }).catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });
        }
      })

      console.log(this.typesCombo)
    },
    getLiquidNames(){
      const formData = new FormData();
      formData.append('companyId', "20155");
      formData.append('cmd', "{'/*************.pump/get-liquid-names':{}}");
      axios.post( '*************', formData,{auth:{username:"aseyfodin", password:"Gro693ES147"}}
      ).then(response => {
        this.liquid = response.data;
      }).catch(error => {
        this.errorMessage = error.message;
        console.error("There was an error!", error);
      });
    },
    getPumpAndPointCalculate(pumpId){
      this.progress = true;
      var json = {
        liquidName:this.liquidComboArray.toString(),
        ratedSpeed:parseInt(this.ratedSpeed),
        selectionRangeFrom:String(this.sliderValue[0]),
        selectionRangeTo:String(this.sliderValue[1]),
        capacity:this.capacity,
        height:this.height
      }
      const formData = new FormData();
      formData.append('companyId', 20155);
      formData.append('pumpId', pumpId);
      formData.append('isSearch', true);
      formData.append('json',  JSON.stringify(json));
      formData.append('cmd', "{'/*************.pump/get-pump-and-point-caculate':{}}");
      for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]);
      }
      axios.post( '*************', formData,{auth:{username:"aseyfodin", password:"Gro693ES147"}}
      ).then(response => {
        this.progress = false;
        this.charts = response.data;
        this.$root.$emit("goToCharts", this.charts);
        this.Charts = !this.Charts;
        this.Charts = true;
        console.log(response)
      }).catch(error => {
        this.errorMessage = error.message;
        console.error("There was an error!", error);
      });
    },
    click(){
      this.Charts = false;
    }
  }
}
</script>

<style>
#searchDiv{
  height: 100%;
  width: 100%;
  position: relative;
  bottom: 10px;
  overflow: scroll;
}
#js-range-slider{
  margin-top: 50px;
}
#pumpDiv{
  width: 95%;
  height: 250px;
  background-color: #30475E;
  left: 10px;
  position: relative;
  border-radius: 10px;
  z-index: 0;
  top: 20px;
  box-shadow: 0 8px 10px -5px;
  margin-bottom: 10px;
}
#pumpImg{
  width: 50%;
  height: 50%;
  margin: 10px 10px auto;
  border-radius: 10px;
  float: left;
}
#pumpName{
  font-family: IranSans;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  font-size: 22px;
  color: yellow;
  text-align: center;
  top: 35%;
  right: 8%;
  position: absolute;
  float: right;
}
#typeName{
  font-family: IranSans;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  font-size: 22px;
  color: #F05454;
  text-align: center;
  top: 10%;
  right: 8%;
  position: absolute;
  float: right;
}
#detailDiv{
  width: 100%;
  height: 40%;
  position: relative;
  margin: 120px auto;
  border-radius: 15px;
  color: white;
  padding: 15px;
  font-size: 15px;
  text-align: left;
}
#progress{
  height: 50px;
  width: 50px;
  position: fixed;
  height: 50px;
  width: 50px;
  margin-left: 45%;
  margin-top: 120%;
}
.vl {
  width: 5px;
  height: 90%;
  bottom: 80px;
  margin-left: 43%;
  position: relative;
  background-color: yellow;
  border-radius: 50px;
}
.v-snack__content{
  text-align: center !important;
}
</style>
