<template>

  <v-app>
    <div style="overflow: scroll;height: 100%">
      <div id="pumpDiv" v-for="(p,index) in pumps" :key="index" @click="pumpClick(pumps[index])">
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
    </div>
  </v-app>
</template>

<script>
import $ from 'jquery'
export default {
  name: "Pumps",
  props:{
    pumpsTabValue:false,
    filterTabValue:false,
    listTabValue:false,
    pumps:[]
  },
  data: () => ({
    Pumps:false,
    searchInput:""
  }),
  methods:{
    pumpClick(index){
      $("#logo").css("z-index","0")
      this.$router.replace({name: 'PumpDetail',params: {pump:index}})
    }
  }
}
</script>

<style scoped>
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
  margin-bottom: 20px;
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
  font-size: 25px;
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
  font-size: 15px;
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
.vl {
  width: 5px;
  height: 90%;
  bottom: 80px;
  margin-left: 43%;
  position: relative;
  background-color: yellow;
  border-radius: 50px;
}
</style>
