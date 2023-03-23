<template>
  <v-row justify="center">
    <v-dialog v-model="Charts"   max-width="600px" eager>
      <v-card style="background-color: white;height: 600px;width: 100%">
        <div id="charts" style="max-width: 100%;height: 100%;font-family: IranSans">

        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import plotly from 'plotly.js'
import $ from 'jquery'
export default {
  name: "Charts",
  props:{
    Charts:false,
    charts:[]
  },
  data:{
    layout : {
      title: 'item',
      autosize: true,
      width: 300,
      height: 300,
      font: {family: 'IRANSans'},
      hoverlabel: {font: {family: 'IRANSans'}},
      xaxis: {autorange: true},
      yaxis: {autorange: true},
    }
  },
  mounted() {
    var th = this;
    this.$root.$off("goToCharts")
    this.$root.$on("goToCharts",function (charts){
      $("#charts").empty();
      const heightDiv = document.createElement("div");
      const powerDiv = document.createElement("div");
      const efficiencyDiv = document.createElement("div");
      const npshrDiv = document.createElement("div");
      heightDiv.id = 'height';
      powerDiv.id = 'power';
      efficiencyDiv.id = 'efficiency';
      npshrDiv.id = 'npshr';

      heightDiv.style.width = "100%";
      heightDiv.style.height = "340px";
      powerDiv.style.height = "340px";
      powerDiv.style.width = "100%";
      efficiencyDiv.style.height = "340px";
      efficiencyDiv.style.width = "100%";
      npshrDiv.style.height = "340px";
      npshrDiv.style.width = "100%";

      document.getElementById("charts").appendChild(heightDiv);
      document.getElementById("charts").appendChild(powerDiv);
      document.getElementById("charts").appendChild(efficiencyDiv);
      document.getElementById("charts").appendChild(npshrDiv);

      console.log(charts)
      let instance = this;
      let config = {modeBarButtonsToRemove: ['sendDataToCloud'], responsive: true};

      charts.keys.forEach(e=>{
        console.log(charts[e])
        let layout = {
          title: e,
          height:340,
          width:340,
          font: {family: 'IRANSans'},
          hoverlabel: {font: {family: 'IRANSans'}},
          autosize: true,
          xaxis: {autorange: true},
          yaxis: {autorange: true},
        };
        plotly.newPlot(e, charts[e], layout,config);
      })
    })
  },

}
</script>

<style scoped>

</style>
