<template>
  <div id="billing">
    <div class="row">
      <div class="input-field col s6">
        <select v-model="home">
          <option v-for="(h, i) in homeList" :key="i" :value="h.ID">{{h.NAIMEN}}</option>
        </select>
        <label>Квартира</label>
      </div>
      <div class="input-field col s6">
        <input type="text" :value="dateBilling" class="datepicker">
        <div id="datepi"></div>
      </div>
    </div>
    
    <div class="card collection">
      <div class="row card-title collection-item">
      <div v-for="(h, i) in billHead" :key="i" class="col" :class="h.class">{{h.name}}</div>
    </div>
    <oneMeter v-for="m in meterList" :key="m.ID" :meter='m.METER' :mid="+m.ID" :date="dateBilling" />
    </div>
    
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import oneMeter from "../components/billing/oneMeter";
export default {
  components: {
    oneMeter,
  },
  data: () => ({
    dateBilling: "2020-11-01",
    home: 1,
  }),
  watch:{
    home(){
      this.getData()
    },
    billDateList(newVal){
      setTimeout(() => {
        this.$M.FormSelect.init(document.querySelectorAll('select'), {})
        this.$M.Datepicker.init(document.querySelectorAll('.datepicker'), 
                          {
                            format: 'yyyy-mm-dd',
                            autoClose: true,
                            events: newVal,
                            container: document.getElementById('datepi'),
                            onSelect: this.setDateBill
                            });
      }, 10);
    },
  // homeList(newVal){
  //   console.log(newVal)
  //   let len = 0
  //   for (const key in newVal) {
  //     key
  //     len++
  //   }
  //   if (len>0){
  //     setTimeout(() => {
  //       this.$M.FormSelect.init(document.querySelectorAll('select'), {})
  //       this.$M.Datepicker.init(document.querySelectorAll('.datepicker'), 
  //                         {
  //                           format: 'yyyy-mm-dd',
  //                           autoClose: true,
  //                           events: this.billDateList,
  //                           container: document.getElementById('datepi'),
  //                           onSelect: this.setDateBill
  //                           });
  //     }, 10);
  //   }
  // }
  },
  computed: {
    ...mapGetters(["meterList", "billHead", "homeList", "billDateList"]),
    fetchList() {return [
      {data: { sqlname: "getHome", kod_home: this.home }, stateName: "billing/home"},
      {data: { sqlname: "getMeters", kod_home: this.home }, stateName: "billing/meters"},
      {data: { sqlname: "curBilling", kod_home: this.home, bil_date: this.dateBilling }, stateName: "billing/bill"},
      {data: { sqlname: "getDateBilling", kod_home: this.home }, stateName: "billing/billdate"},
      {data: { sqlname: "getPrevBilling", kod_home: this.home, bil_date: this.dateBilling }, stateName: "billing/prevBill"},
      {data: { sqlname: "getCurrentPrice", kod_home: this.home, bil_date: this.dateBilling }, stateName: "billing/price"},
    ]}
  },
  methods: {
    ...mapActions(["fetchData"]),
    getData(){
      this.fetchList.forEach(e => this.fetchData(e))
    },
    setDateBill(date){
      let d = new Date(date)
      let year = d.getFullYear()
      let month = d.getMonth()
      month++
      if (month.toFixed().length === 1){
        month = '0' + month
      }
      let day = '' + d.getDate()
      if (day.length ===1){
        day = '0' + day
      }
      console.log( year +'-' + month + '-' + day)
      this.dateBilling = year +'-' + month + '-' + day
    }
  },
  mounted() {
    this.getData()
    console.log(this.$getCookie('HASHIP')) 
  },
};
</script>

<style>
#billing{
  max-width: 1200px;
  margin: auto;
}
.has-event {
  background-color: red;
}
</style>