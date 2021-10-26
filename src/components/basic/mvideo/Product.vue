<template>
  <li>
    <div class="collapsible-header row">
      <i class="material-icons">add_shopping_cart</i>
      <div class="col s2"><a target="_blank" :href="'https://www.mvideo.ru/products/'+p._id">{{ p.name }}</a></div>
      <div class="col s1 blue lighten-3 right-align" :class="{'light-green' : +p.deltaProc<0, 'orange' : +p.deltaProc>0}" >
         <i v-if="p.isFinalPrice==='1'" class="material-icons red-text left">lock</i>
        <span class="flow-text">
          {{ p.lastPrice }}
        </span>
     
      </div>
      <div class="col s1">{{ (+p.avgSP).toFixed(2) }}</div>
      <div class="col s1"><label for="">{{p.lastDate}}</label><br/>{{ (+p.deltaProc/10).toFixed(1) }}%</div>
      <div class="col s3">{{ p.salePrice }}</div>
      <div class="col s3">{{ p.basePrice }}</div>
    </div>
    <div class="collapsible-body">
      <BarChartVue
        class="container limhei"
        :charData="charData"
        :height="120"
        :options="options"
      />
      <TableDataVue
        v-if="productPrices.length"
        :data="productPrices"
        :label="'Список'"
      />
    </div>
  </li>
</template>

<script>
import { mapState } from "vuex";
import BarChartVue from "../charts/BarChart.vue";
import TableDataVue from "../TableData.vue";

export default {
  components: {
    TableDataVue,
    BarChartVue,
  },
  props: {
    p: Object,
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  },
  computed: {
    ...mapState("mvideo", ["prices", "products"]),
    charData() {
      let char = {
        labels: this.productPrices.map((e) => e.date_price),
        datasets: [
          {
            label: this.p.name + " Базовая",
            borderColor: "#FC2525",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "white",
            backgroundColor: "rgba(0, 108,100, 0.5)",
            data: this.productPrices.map((e) => e.basePrice),
          },
          {
            label: this.p.name + " Продажа",
            borderColor: "#FC2525",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "white",
            backgroundColor: "rgba(155, 208,0, 0.9)",
            data: this.productPrices.map((e) => e.salePrice),
          },
          {
            label: this.p.name + " ПРОМО",
            borderColor: "#FC2525",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "white",
            backgroundColor: "rgba(0, 208,0, 0.9)",
            data: this.productPrices.map((e) => e.basePromoPrice),
          },
        ],
      };
      return char;
    },
    productPrices() {
      let pid = this.p._id;
      let pp = [];
      if (this.prices.length) {
        pp = this.prices.filter((e) => e.productId === pid);
      }
      return pp;
    },
  },
};
</script>

<style scoped>
.row{
  margin-bottom: 1px;
}
</style>