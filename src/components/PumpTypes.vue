<template>
<v-app>
  <div style="display: flex;flex-wrap: wrap">
    <div id="typeDiv" v-for="t in types" @click="getPumps(t.pumpTypeId)">
    <v-img id="img" :src="t.pumpTypeImage"></v-img>
    <p id="pumpTypeName">{{t.pumpTypeName}}</p>
  </div>
    <v-progress-circular id="progress" v-if="progress" :size="50" color="green" indeterminate></v-progress-circular>
  </div>
</v-app>

</template>

<script>
import Pumps from '../components/Pumps.vue'
import axios from "axios";
import $ from "jquery";

export default {
  name: "PumpTypes",
  props:{
    PumpTypes:false,
    types:[],
  },
  data: () => ({
    PumpTypes:false,
    progress:false,
    searchInput:"",
    pumps:[]
  }),
  components:{
    Pumps
  },
  mounted() {

  },
  methods:{
    filteredData() {
      var th = this;
      this.types.filter(c => {
        if(c.pumpTypeName.includes(th.searchInput)) {
          return c
        }
      })
    },
    getPumps(id){
      this.progress = true;
      const formData = new FormData();
      formData.append('companyId', "20155");
      formData.append('pumpTypeId', id);
      formData.append('cmd', "{'/*************.pump/get-pumps-pt':{}}");
      axios.post( '*************', formData,{auth:{username:"aseyfodin", password:"Gro693ES147"}}
      ).then(response => {
        this.progress = false;
        this.pumps = response.data;
        this.$emit("goToPumps",this.pumps);
        console.log(this.pumps)
      }).catch(error => {
        this.errorMessage = error.message;
        console.error("There was an error!", error);
      });
    },
  },
}
</script>

<style>
#pumpTypeName{
  font-family: IranSans;
  margin: 30px auto;
  font-size: large;
  color: white;
  text-align: center;
}
#typeDiv{
  width: 170px;
  height: 200px;
  background-color: #30475E;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 8px 10px -5px;
  padding: 5px ;
}
#img{
  width: 100%;
  height: 60%;
  margin:0 auto;
  border-radius: 10px;
}

.v-input{
  max-width: 80% !important;
}
.v-application--is-ltr .v-text-field .v-input__append-inner{
  top: 0px;
  position: relative;
}

</style>
