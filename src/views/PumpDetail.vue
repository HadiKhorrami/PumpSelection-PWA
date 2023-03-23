<template>
  <v-app style="height: 100%; width: 100%; top: 0;  background-color: #DDDDDD;position:fixed;">

    <v-app-bar color="#30475E" dark style="max-height: 50px !important;">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer;Charts=false"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-btn icon @click="goHome()">
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" absolute left style="margin-bottom: 20px">
        <v-list nav dense>
          <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
            <v-list-item>
              <v-expansion-panels v-model="expansion" style="width: 100%;margin: auto" dark>
                <v-expansion-panel>
                  <v-expansion-panel-header color="#F05454" style="height: 40px;" @click="click()">{{ $t('PumpDetail.Menu.Density') }}</v-expansion-panel-header>
                  <v-expansion-panel-content style="background-color: white;height: fit-content">
                    <v-checkbox v-for="i in densityArray" :label="i" style="float: left;color: black" dense light @change="setCheckedArray('density',i,$event)"></v-checkbox>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-list-item>

            <v-list-item>
              <v-expansion-panels v-model="expansion" style="width: 100%;margin: auto" dark>
                <v-expansion-panel>
                  <v-expansion-panel-header color="#F05454" style="height: 40px;" @click="click()">{{ $t('PumpDetail.Menu.PointType') }}</v-expansion-panel-header>
                  <v-expansion-panel-content style="background-color: white;height: fit-content">
                    <v-checkbox v-for="i in pointtypeArray" :label="i" style="float: left;color: black;margin: 5px" dense light @change="setCheckedArray('pointtype',i,$event)"></v-checkbox>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-list-item>

            <v-list-item>
              <v-expansion-panels v-model="expansion" style="width: 100%;margin: auto" dark>
                <v-expansion-panel>
                  <v-expansion-panel-header color="#F05454" style="height: 40px;" @click="click()">{{ $t('PumpDetail.Menu.RatedSpeed') }}</v-expansion-panel-header>
                  <v-expansion-panel-content style="background-color: white;height: fit-content">
                    <v-checkbox v-for="i in ratedspeedArray" :label="i" style="float: left;color: black;" dense light @change="setCheckedArray('ratedSpeed',i,$event)"></v-checkbox>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-list-item>

            <v-list-item>
              <v-expansion-panels v-model="expansion" style="width: 100%;margin: auto" dark>
                <v-expansion-panel>
                  <v-expansion-panel-header color="#F05454" style="height: 40px;" @click="click()">{{ $t('PumpDetail.Menu.Capacity') }}</v-expansion-panel-header>
                  <v-expansion-panel-content style="background-color: white;height: fit-content">
                    <v-checkbox v-for="i in capacityArray" :label="i" style="float: left;color: black;margin: 5px" dense light @change="setCheckedArray('capacity',i,$event)"></v-checkbox>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-list-item>

            <v-list-item>
              <v-expansion-panels v-model="expansion" style="width: 100%;margin: auto" dark>
                <v-expansion-panel>
                  <v-expansion-panel-header color="#F05454" style="height: 40px;" @click="click()">{{ $t('PumpDetail.Menu.Height') }}</v-expansion-panel-header>
                  <v-expansion-panel-content style="background-color: white;height: fit-content">
                    <v-checkbox v-for="i in heightArray" :label="i" style="float: left;color: black;margin: 5px" dense light @change="setCheckedArray('height',i,$event)"></v-checkbox>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-btn id="reset" @click="getPumpsByParentId('reset')">Reset</v-btn>
      </v-navigation-drawer>

    <div id="pumpdiv">
      <v-img id="pumpImg" :src="pumpDetail.pumpImage"></v-img>
      <p id="typeName">{{pumpDetail.pumpTypeName}}</p>
      <p id="pumpName">{{pumpDetail.pumpName}}</p>
      <br>

      <div id="detailDiv">
        <p >{{$t("Pumps.BEPFlow")}} : {{pumpDetail.capacity}} m3/h</p>
        <p >{{$t("Pumps.BEPPower")}} : {{pumpDetail.power}} bar</p>
        <div class="vl"></div>
        <p style="position: absolute;margin-left: 165px;top: 15px;">{{$t("Pumps.ShutOffHead")}} : {{pumpDetail.head}} m</p>
        <p style="position: absolute;margin-left: 165px;top: 55px;">{{$t("Pumps.LiquidTemperature")}} : {{pumpDetail.temp}} (℃)</p>
      </div>

    </div>
    <v-card style="overflow: scroll;width: 95%;height:65%;margin:auto;position: relative;top:-0">
      <v-card-title>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" hide-details @input="Charts=false"></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="desserts" :search="search" :mobile-breakpoint="0" @click:row="getPumpAndPointCaculate"></v-data-table>
    </v-card>
    <v-progress-circular id="progress" v-if="progress" :size="50" color="green" indeterminate></v-progress-circular>
    <Charts :Charts="Charts" :charts="charts" :goToCharts="charts" @click:outside="Charts=!Charts;Charts=false"/>
  </v-app>
</template>
<style scoped>
#pumpdiv{
  width: 100%;
  height: 180px;
  background-color: #30475E;
  position: relative;
  z-index: 0;
  box-shadow: 0 8px 10px -5px;
  margin-bottom: 20px;
}
#pumpImg{
  width: 30%;
  height: 40%;
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
  font-size: 20px;
  color: yellow;
  text-align: center;
  top: 30%;
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
  font-size: 12px;
  color: #F05454;
  text-align: center;
  top: 10%;
  right: 8%;
  position: absolute;
  float: right;
}
#detailDiv{
  width: 100%;
  height: 50%;
  position: relative;
  margin: 60px auto;
  border-radius: 15px;
  color: white;
  padding: 15px;
  font-size: 15px;
  text-align: left;
}
.vl {
  width: 5px;
  height: 100%;
  bottom: 80px;
  margin-left: 40%;
  margin-top: 20px;
  position: relative;
  background-color: yellow;
  border-radius: 50px;
}
#reset{
  border-radius: 0 !important;
  bottom: 0;
  position: fixed;
  width: 100%;
  z-index: 100;
  background-color:#30475E;
  color: white;
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
</style>
<script>
import axios from "axios";
import Charts from "../components/Charts.vue"
export default {
  name: "PumpDetail",
  props:{
    Charts:false,
    charts:[]
  },
  data: () => ({
    pumpDetail:"",
    drawer:false,
    progress:false,
    search: '',
    ////////////////////////////
    checkedCapacityArray:[],
    checkedDensityArray:[],
    checkedHeightArray:[],
    checkedPointtypeArray:[],
    checkedRatedspeedArray:[],
    capacityArray:[],
    densityArray:[],
    heightArray:[],
    pointtypeArray:[],
    ratedspeedArray:[],
    ////////////////////////////
    headers: [
      {text: 'Pump Name', value: 'pumpName'},
      { text: 'Max Diameter', value: 'maxDiameter' },
      { text: 'Min Diameter', value: 'minDiameter' },
      { text: 'Rated Speed', value: 'ratedSpeed' },
      { text: 'Density', value: 'density' },
      { text: 'Liquid Name', value: 'liquidName' },
      { text: 'Viscosity', value: 'viscosity' },
      { text: 'Actions', value: 'actions' },
    ],
    desserts: [],
  }),
  components:{
    Charts
  },
  mounted(){

    if(this.getCookie("firstName")===""){
      this.$router.push("/Login")
    }
    this.pumpDetail = this.$route.params.pump
    this.getDataValues();
    this.getPumpsByParentId();
  },
  methods:{
    setCheckedArray(type,value,event){
      var th = this;
      this.desserts = [];
      this.drawer = false;
      if(type==='density' && event===true){
        this.checkedDensityArray.push(value)
        this.getPumpsByParentId();
      }else
      if(type==='density' && event===false){
        this.checkedDensityArray.forEach((e,index)=>{
          if(this.checkedDensityArray[index]===value){
            th.checkedDensityArray.splice(index,1)
          }
        })
        this.getPumpsByParentId();
      }

      if(type==='pointtype' && event===true){
        this.checkedPointtypeArray.push(value)
        this.getPumpsByParentId();
      }else
      if(type==='pointtype' && event===false){
        this.checkedPointtypeArray.forEach((e,index)=>{
          if(this.checkedPointtypeArray[index]===value){
            th.checkedPointtypeArray.splice(index,1)
          }
        })
        this.getPumpsByParentId();
      }

      if(type==='ratedSpeed' && event===true){
        this.checkedRatedspeedArray.push(value)
        this.getPumpsByParentId();
      }else
      if(type==='ratedSpeed' && event===false){
        this.checkedRatedspeedArray.forEach((e,index)=>{
          if(this.checkedRatedspeedArray[index]===value){
            th.checkedRatedspeedArray.splice(index,1)
          }
        })
        this.getPumpsByParentId();
      }

      if(type==='capacity' && event===true){
        this.checkedCapacityArray.push(value)
        this.getPumpsByParentId();
      }else
      if(type==='capacity' && event===false){
        this.checkedCapacityArray.forEach((e,index)=>{
          if(this.checkedCapacityArray[index]===value){
            th.checkedCapacityArray.splice(index,1)
          }
        })
        this.getPumpsByParentId();
      }

      if(type==='height' && event===true){
        this.checkedHeightArray.push(value)
        this.getPumpsByParentId();
      }else
      if(type==='height' && event===false){
        this.checkedHeightArray.forEach((e,index)=>{
          if(this.checkedHeightArray[index]===value){
            th.checkedHeightArray.splice(index,1)
          }
        })
        this.getPumpsByParentId();
      }
    },
    getPumpsByParentId(isReset){
      console.log(isReset)
      if(isReset==='reset'){
        this.checkedPointtypeArray = [];
        this.checkedRatedspeedArray = [];
        this.checkedDensityArray = [];
        this.checkedCapacityArray = [];
        this.checkedHeightArray = [];
        this.drawer = false;
      }
      const formData = new FormData();
      formData.append('companyId', 20155);
      formData.append('pumpId', this.pumpDetail.pumpId);
      formData.append('selectionArea', this.checkedPointtypeArray.toString());
      formData.append('rateSpeed', this.checkedRatedspeedArray.toString());
      formData.append('density', this.checkedDensityArray.toString());
      formData.append('capacity', this.checkedCapacityArray.toString());
      formData.append('height', this.checkedHeightArray.toString());
      formData.append('cmd', "{'/*************.pump/get-pumps-by-parent-id':{}}");
      for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]);
      }
      axios.post( '*************', formData,{auth:{username:"aseyfodin", password:"Gro693ES147"}}
      ).then(response => {
        this.desserts = response.data
        console.log(this.desserts)
      }).catch(error => {
        this.errorMessage = error.message;
        console.error("There was an error!", error);
      });
    },
    getDataValues(){
      const formData = new FormData();
      formData.append('companyId', 20155);
      formData.append('pumpId', this.pumpDetail.pumpId);
      formData.append('cmd', "{'/*************.pump/get-data-values':{}}");
      axios.post( '*************', formData,{auth:{username:"aseyfodin", password:"Gro693ES147"}}
      ).then(response => {
        this.capacityArray = response.data.capacity;
        this.densityArray = response.data.density;
        this.heightArray = response.data.height;
        this.pointtypeArray = response.data.pointtype;
        this.ratedspeedArray = response.data.ratedspeed;
      }).catch(error => {
        this.errorMessage = error.message;
        console.error("There was an error!", error);
      });
    },
    goHome(){
      this.$router.push('/App')
    },
    getPumpAndPointCaculate(value){
      this.progress = true;
      this.Charts = false;
      const formData = new FormData();
      formData.append('companyId', 20155);
      formData.append('pumpId', value.pumpId);
      formData.append('isSearch', false);
      formData.append('json', "");
      formData.append('cmd', "{'/*************.pump/get-pump-and-point-caculate':{}}");
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

