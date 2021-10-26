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
      {url: "api/restGet",data:{fields: [],from: "объект_квартира", kod_home: this.home }, stateName: "billing/home"},
      {url: "api/restGet",data:{fields: ["DISTINCT", "s.id:ID", "s.namien:METER"],from: "объект_счетчики:s", filter: { "s.KOD_HOME": this.home }}, stateName: "billing/meters"},
      {url: "api/restGet",data:{fields: ["b.KOD_METER","DATE_FORMAT(b.DATE_BIL,'%d/%m/%Y'):DATE_BIL","b.BILLING"],from: ["billing:b","объект_счетчики:s"], join:["b.KOD_METER=s.ID"], filter: {"b.DATE_BIL": {fields: ["MAX(bb.DATE_BIL):max"], from: "billing:bb", filter: {"bb.DATE_BIL":this.dateBilling, "bb.KOD_METER": "${b.KOD_METER}"}}, "s.KOD_HOME": this.home }}, stateName:  "billing/billdate"},
      {url: "api/restGet",data:{fields: ["b.KOD_METER","DATE_FORMAT(b.DATE_BIL,'%d/%m/%Y'):DATE_BIL","b.BILLING"],from: ["billing:b","объект_счетчики:s"], join:["b.KOD_METER=s.ID"], filter: {"b.DATE_BIL": {fields: ["MAX(bb.DATE_BIL):max"], from: "billing:bb", filter: {"bb.DATE_BIL":"<:"+this.dateBilling, "bb.KOD_METER": "${b.KOD_METER}"}}, "s.KOD_HOME": this.home }}, stateName: "billing/prevBill"},
      {url: "api/restGet",data:{fields: ["s.ID:KOD_METER","DATE_FORMAT(r.DATE_BEG,'%d/%m/%Y'):DATEPRICE","r.BILLING:PRICE"],from: ["объект_расценки:r","объект_счетчики:s"], join:["s.KOD_TYPE=r.KOD_TYPE"], filter: {"r.DATE_BEG": {fields: ["max(rr.DATE_BEG):max"], from: "объект_расценки:rr", filter: {"rr.DATE_BEG":"<=:"+this.dateBilling, "rr.KOD_TYPE": "${s.KOD_TYPE}"}}, "s.KOD_HOME": this.home } }, stateName: "billing/price"},
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